const net = require('net');
const path = require('path');
const { startServer, stopServer } = require('../desktop/server-manager');

const serverPath = path.join(__dirname, '..', 'server', 'index.js');

describe('desktop server lifecycle', () => {
  let runningServer;

  afterEach(async () => {
    if (runningServer) {
      await stopServer(runningServer.child);
      runningServer = null;
    }
  });

  test('waits for the server ready signal and shuts it down cleanly', async () => {
    runningServer = await startServer({ serverPath, port: 0 });

    const response = await fetch(`${runningServer.url}/health`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok' });

    await stopServer(runningServer.child);
    runningServer = null;
  });

  test('reports a port conflict instead of treating the server as ready', async () => {
    const occupiedServer = net.createServer();
    await new Promise((resolve) => occupiedServer.listen(0, '127.0.0.1', resolve));
    const occupiedPort = occupiedServer.address().port;

    try {
      await expect(startServer({
        serverPath,
        host: '127.0.0.1',
        port: occupiedPort,
      })).rejects.toMatchObject({ code: 'EADDRINUSE' });
    } finally {
      await new Promise((resolve, reject) => {
        occupiedServer.close((error) => (error ? reject(error) : resolve()));
      });
    }
  });
});
