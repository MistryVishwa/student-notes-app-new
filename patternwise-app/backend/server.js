const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');
const corsValidator = require('./middleware/corsValidator');
const { config, getCorsConfig } = require('./config');

const app = express();
const PORT = config.PORT || 5000;
const HOST = config.HOST || 'localhost';

// Initialize CORS with whitelist
const corsConfig = getCorsConfig(config);
app.use(cors(corsConfig));

// CORS validation middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(corsValidator);
}

app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Serve Frontend (if needed in production)
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, HOST, () => {
  console.debug(
    `PatternWise server running on http://${HOST}:${PORT}`
  );
  if (process.env.NODE_ENV === 'development') {
    console.debug(`CORS Allowed Origins: ${config.ALLOWED_ORIGINS}`);
  }
});
