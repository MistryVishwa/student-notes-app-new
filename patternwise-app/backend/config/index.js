const Joi = require('joi');

/**
 * Environment Configuration Schema
 * Validates all required environment variables at startup
 */
const configSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(5000),
  HOST: Joi.string().default('localhost'),
  ALLOWED_ORIGINS: Joi.string()
    .description('Comma-separated list of allowed CORS origins')
    .required(),
  LEETCODE_API_URL: Joi.string()
    .uri()
    .default('https://leetcode.com/graphql'),
  LEETCODE_TIMEOUT_MS: Joi.number().default(5000),
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),
  RATE_LIMIT_ENABLED: Joi.boolean().default(true),
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),
  RESPONSE_CACHE_ENABLED: Joi.boolean().default(true),
  RESPONSE_CACHE_TTL_MS: Joi.number().default(300000), // 5 minutes
}).unknown(true);

/**
 * Validate and load configuration
 */
function loadConfig() {
  const { error, value: config } = configSchema.validate(process.env);

  if (error) {
    throw new Error(
      `Configuration validation failed: ${error.details.map(d => d.message).join(', ')}`
    );
  }

  return config;
}

/**
 * Get CORS configuration
 * @returns {object} CORS options for express middleware
 */
function getCorsConfig(config) {
  const allowedOrigins = config.ALLOWED_ORIGINS.split(',').map(o => o.trim());

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // 24 hours
  };
}

const config = loadConfig();

module.exports = {
  config,
  getCorsConfig,
};
