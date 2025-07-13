const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { body, validationResult } = require('express-validator');
const app = express();
const port = process.env.PORT || 3000;

// Enable trust proxy for deployment behind reverse proxies
app.set('trust proxy', 1);

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
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    }
  })
);

// Read allowed origins from environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : undefined; // Allow all origins if none specified

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: 'Too many contact form submissions, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.post(
  '/api/contact',
  contactLimiter,
  [
    body('name').trim().notEmpty().isLength({ min: 1, max: 100 }).escape(),
    body('email').isEmail().normalizeEmail(),
    body('message').trim().notEmpty().isLength({ min: 1, max: 1000 }).escape(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const sanitized = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    };
    
    // Log submission with timestamp and request info
    const logData = {
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      submission: sanitized
    };
    
    if (process.env.NODE_ENV === 'production') {
      console.log('Contact form submission:', JSON.stringify(logData));
    } else {
      console.log('Contact form submission:', sanitized);
    }
    
    res.json({ status: 'ok' });
  }
);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;
