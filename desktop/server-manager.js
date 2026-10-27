const { spawn } = require('child_process');
const path = require('path');

const READY_MARKER = 'ARCHENG_SERVER_READY ';
const ERROR_MARKER = 'ARCHENG_SERVER_ERROR ';

function startServer({
  serverPath,
  host = '127.0.0.1',
  port = 0,
  startupTimeoutMs = 10000,
  executable = process.execPath,
  environment = process.env,
  signal,
} = {}) {
  if (!serverPath) {
    return Promise.reject(new TypeError('serverPath is required to start the application server.'));
  }

  if (signal && signal.aborted) {
    return Promise.reject(createAbortError());
  }

  const child = spawn(executable, [serverPath], {
    cwd: path.dirname(serverPath),
    env: {
      ...environment,
      ELECTRON_RUN_AS_NODE: '1',
      HOST: host,
      PORT: String(port),
    },
    stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
  });

  return new Promise((resolve, reject) => {
    let settled = false;
    let stdoutBuffer = '';
    let stderrBuffer = '';
    let startupError;

    const startupTimer = setTimeout(() => {
      const error = new Error(`Application server did not become ready within ${startupTimeoutMs}ms.`);
      error.code = 'ERR_SERVER_START_TIMEOUT';
      fail(error);
    }, startupTimeoutMs);
    startupTimer.unref();

    function finish() {
      clearTimeout(startupTimer);
      if (signal) {
        signal.removeEventListener('abort', onAbort);
      }
    }

    function fail(error) {
      if (settled) {
        return;
      }

      settled = true;
      finish();
      child.kill();
      reject(error);
    }

    function onAbort() {
      fail(createAbortError());
    }

    child.once('error', (error) => {
      fail(error);
    });

    child.once('exit', (code, signal) => {
      if (!settled) {
        const error = startupError || new Error(
          `Application server exited before becoming ready (code ${code}, signal ${signal}).`
        );
        error.code = error.code || 'ERR_SERVER_START_EXIT';
        fail(error);
      }
    });

    child.stdout.on('data', (data) => {
      stdoutBuffer += data.toString();
      const lines = stdoutBuffer.split(/\r?\n/);
      stdoutBuffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith(READY_MARKER)) {
          try {
            const { port: readyPort } = JSON.parse(line.slice(READY_MARKER.length));
            if (!Number.isInteger(readyPort) || readyPort < 1 || readyPort > 65535) {
              throw new Error('Server reported an invalid listening port.');
            }

            if (!settled) {
              settled = true;
              finish();
              child.archengPort = readyPort;
              resolve({
                child,
                port: readyPort,
                url: `http://${host}:${readyPort}`,
              });
            }
          } catch (error) {
            fail(error);
          }
        } else if (line.trim()) {
          console.log(line);
        }
      }
    });

    child.stderr.on('data', (data) => {
      stderrBuffer += data.toString();
      const lines = stderrBuffer.split(/\r?\n/);
      stderrBuffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith(ERROR_MARKER)) {
          try {
            const details = JSON.parse(line.slice(ERROR_MARKER.length));
            startupError = new Error(details.message);
            startupError.code = details.code;
            fail(startupError);
          } catch (error) {
            fail(error);
          }
        } else if (line.trim()) {
          console.error(line);
        }
      }
    });

    if (signal) {
      signal.addEventListener('abort', onAbort, { once: true });
      if (signal.aborted) {
        onAbort();
      }
    }
  });
}

function createAbortError() {
  const error = new Error('Application server startup was cancelled.');
  error.name = 'AbortError';
  error.code = 'ABORT_ERR';
  return error;
}

function stopServer(child, shutdownTimeoutMs = 5000) {
  if (!child || child.exitCode !== null || child.signalCode !== null) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    let forceTimer;
    const shutdownTimer = setTimeout(() => {
      child.kill();
      forceTimer = setTimeout(() => {
        child.removeListener('exit', onExit);
        reject(new Error(`Application server did not stop within ${shutdownTimeoutMs}ms.`));
      }, 1000);
    }, shutdownTimeoutMs);

    function onExit() {
      clearTimeout(shutdownTimer);
      clearTimeout(forceTimer);
      resolve();
    }

    child.once('exit', onExit);

    try {
      if (child.connected) {
        child.send('shutdown');
      } else {
        child.kill();
      }
    } catch (error) {
      clearTimeout(shutdownTimer);
      child.removeListener('exit', onExit);
      reject(error);
    }
  });
}

module.exports = { startServer, stopServer };
