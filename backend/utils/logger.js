const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist (only if not on Vercel)
const logsDir = path.join(__dirname, '../logs');
if (!process.env.VERCEL && !fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Base transports (Console is always safe)
const transports = [];

if (process.env.VERCEL) {
  // On Vercel, only log to console (file system is read-only)
  transports.push(
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat,
    })
  );
} else {
  // Local environment: use file transports
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
  
  if (process.env.NODE_ENV !== 'production') {
    transports.push(
      new winston.transports.Console({
        format: consoleFormat,
      })
    );
  }
}

// Exception handlers
const exceptionHandlers = process.env.VERCEL ? [] : [
  new winston.transports.File({
    filename: path.join(logsDir, 'exceptions.log'),
    maxsize: 5242880,
    maxFiles: 5,
  })
];

const rejectionHandlers = process.env.VERCEL ? [] : [
  new winston.transports.File({
    filename: path.join(logsDir, 'rejections.log'),
    maxsize: 5242880,
    maxFiles: 5,
  })
];

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'brgrhut-api' },
  transports,
  exceptionHandlers: exceptionHandlers.length > 0 ? exceptionHandlers : undefined,
  rejectionHandlers: rejectionHandlers.length > 0 ? rejectionHandlers : undefined,
});

// If we're not in production and not on Vercel, console logging is already added above

module.exports = logger;

