const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { body, validationResult } = require('express-validator');

const READY_MARKER = 'ARCHENG_SERVER_READY ';
const ERROR_MARKER = 'ARCHENG_SERVER_ERROR ';

function createApp({ allowedOrigins } = {}) {
  const app = express();
  const configuredOrigins = allowedOrigins || (process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : []);

  app.set('trust proxy', process.env.TRUST_PROXY === '1' ? 1 : false);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'https://cdn.tailwindcss.com'],
          styleSrc: ["'self'", 'https://cdnjs.cloudflare.com', "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          fontSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
          connectSrc: ["'self'"],
          frameAncestors: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    })
  );

  app.use(cors({
    origin(origin, callback) {
      callback(null, !origin || configuredOrigins.includes(origin));
    },
  }));
  app.use(express.json({ limit: '10kb' }));
  app.use(express.static(path.join(__dirname, '../public')));

  const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many contact form submissions, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post(
    '/api/contact',
    contactLimiter,
    [
      body('name').isString().withMessage('Name must be text').bail().trim().notEmpty().isLength({ max: 100 }),
      body('email').isString().withMessage('Email must be text').bail().trim().isEmail().normalizeEmail(),
      body('message').isString().withMessage('Message must be text').bail().trim().notEmpty().isLength({ max: 1000 }),
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array().map(({ param, msg }) => ({ field: param, message: msg })),
        });
      }

      return res.json({ status: 'ok' });
    }
  );

  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });

  app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') {
      return res.status(413).json({ error: 'Request body too large' });
    }

    if (err instanceof SyntaxError && Object.prototype.hasOwnProperty.call(err, 'body')) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }

    console.error('Unhandled server error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  });

  app.locals.contactLimiter = contactLimiter;
  return app;
}

const app = createApp();

if (require.main === module) {
  const host = process.env.HOST || '0.0.0.0';
  const port = Number(process.env.PORT ?? 3000);

  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    process.stderr.write(`${ERROR_MARKER}${JSON.stringify({
      code: 'ERR_INVALID_PORT',
      message: 'PORT must be an integer between 0 and 65535.',
    })}\n`);
    process.exitCode = 1;
  } else {
    const server = app.listen(port, host, () => {
      process.stdout.write(`${READY_MARKER}${JSON.stringify({ port: server.address().port })}\n`);
    });
    let shutdownRequested = false;

    server.on('error', (error) => {
      process.stderr.write(`${ERROR_MARKER}${JSON.stringify({
        code: error.code || 'ERR_SERVER_START',
        message: error.message,
      })}\n`);
      process.exitCode = 1;
    });

    process.on('message', (message) => {
      if (message !== 'shutdown' || shutdownRequested) {
        return;
      }

      shutdownRequested = true;
      const finishShutdown = (error) => {
        if (error) {
          process.stderr.write(`Failed to close application server: ${error.message}\n`);
          process.exitCode = 1;
        }

        if (process.connected) {
          process.disconnect();
        }
      };

      if (server.listening) {
        server.close(finishShutdown);
      } else {
        finishShutdown();
      }
    });
  }
}

module.exports = app;
module.exports.createApp = createApp;
