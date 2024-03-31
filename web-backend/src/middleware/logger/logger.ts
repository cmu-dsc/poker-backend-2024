import winston, { Logform } from 'winston'

winston.addColors({
  error: 'red',
  info: 'green',
  warn: 'yellow',
  debug: 'white',
  http: 'cyan',
})

/**
 * The logger used for logging.
 * @see {@link https://www.npmjs.com/package/winston}
 */
const logger = winston.createLogger({
  level: 'http',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.label({ label: '[server]' }),
    winston.format.printf(
      (info: Logform.TransformableInfo) =>
        `${info.label}  ${info.timestamp}  [${info.level}] : ${info.message}`,
    ),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/warn.log', level: 'warn' }),
  ],
})

export default logger
