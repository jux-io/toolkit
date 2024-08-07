import * as winston from 'winston';
import { format } from 'winston';

import { Format } from 'logform';
import bare from 'cli-color/bare';
import clc from 'cli-color';
import safeStringify from 'fast-safe-stringify';
import { inspect } from 'util';
import path from 'path';
import isEmpty from 'lodash/isEmpty';

export const colorScheme: Record<string, bare.Format> = {
  info: clc.cyanBright,
  warn: clc.yellowBright,
  error: clc.red,
  debug: clc.magentaBright,
  verbose: clc.cyanBright,
  input: clc.yellowBright,
  success: clc.greenBright,
} as const;

const simpleConsoleLogFormat = (): Format =>
  format.printf(({ message }) => {
    return message;
  });

const logfileFormat = (): Format =>
  format.printf(({ timestamp, message, level, ...meta }) => {
    const stringifiedMeta = safeStringify(meta);
    const metadata = JSON.parse(stringifiedMeta);
    const formattedMeta = isEmpty(metadata)
      ? ''
      : inspect(metadata, {
          depth: null,
        });
    return `${timestamp} ${level}: ${message} ${
      formattedMeta ? `\n${formattedMeta}` : ''
    }`;
  });

const winstonLogger = winston.createLogger({
  level: process.env.LOGLEVEL || 'info',
  format: winston.format((info) => {
    return info;
  })(),
  transports: [
    new winston.transports.File({
      filename:
        process.platform === 'win32'
          ? path.resolve(process.env.LOCALAPPDATA as string, 'jux', 'jux.log')
          : path.resolve(
              process.env.HOME as string,
              '.config',
              'jux',
              'jux.log'
            ),
      maxsize: 4096000, // 4MB
      format: winston.format.combine(
        winston.format.timestamp(),
        logfileFormat()
      ),
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.metadata(),
        winston.format.timestamp(),
        winston.format.ms(),
        simpleConsoleLogFormat()
      ),
    }),
  ],
});

class CustomLogger {
  logger: winston.Logger;
  constructor() {
    this.logger = winstonLogger;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(message: string, metadata?: any) {
    this.logger.log(
      'info',
      `[${colorScheme.info('info')}] ${message}`,
      metadata
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(message: string, metadata?: any) {
    this.logger.log(
      'warn',
      `[${colorScheme.warn('warn')}] ${message}`,
      metadata
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: string, metadata?: any) {
    this.logger.log(
      'error',
      `[🤖 ${colorScheme.error('error')}] ${message}`,
      metadata
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message: string, metadata?: any) {
    this.logger.log(
      'debug',
      `[${colorScheme.debug('debug')}] ${message}`,
      metadata
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  verbose(message: string, metadata?: any) {
    this.logger.log(
      'verbose',
      `[${colorScheme.verbose('verbose')}] ${message}`,
      metadata
    );
  }
}

export const logger = new CustomLogger();
