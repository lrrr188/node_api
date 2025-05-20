/**
 * @file 全局日志系统
 * @description 使用 winston 实现多环境日志记录，支持文件和控制台输出
 * @author AI Assistant
 * @createDate 2024-03-21
 */

import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 日志级别配置
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 根据环境选择日志级别
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
};

// 日志颜色配置
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

// 日志格式配置
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// 日志输出目标配置
const LOG_PATH = path.join(__dirname, '../../../logs');

const transports = [
  // 控制台输出
  new winston.transports.Console(),
  
  // 错误日志文件
  new winston.transports.File({
    filename: path.join(LOG_PATH, 'error.log'),
    level: 'error',
  }),
  
  // 访问日志文件
  new winston.transports.File({
    filename: path.join(LOG_PATH, 'access.log'),
    level: 'http',
  }),
  
  // 应用日志文件
  new winston.transports.File({
    filename: path.join(LOG_PATH, 'app.log'),
    level: 'info',
  }),
  
  // 调试日志文件
  new winston.transports.File({
    filename: path.join(LOG_PATH, 'debug.log'),
    level: 'debug',
  })
];

// 创建日志实例
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

/**
 * @class Logger
 * @description 日志工具类，提供统一的日志记录方法
 */
export class Logger {
  /**
   * @static
   * @description 记录错误日志
   * @param {string} message - 错误信息
   * @param {Error} [error] - 错误对象
   */
  static error(message, error) {
    const errorMessage = error ? `${message}\n${error.stack}` : message;
    logger.error(errorMessage);
  }

  /**
   * @static
   * @description 记录警告日志
   * @param {string} message - 警告信息
   */
  static warn(message) {
    logger.warn(message);
  }

  /**
   * @static
   * @description 记录信息日志
   * @param {string} message - 信息内容
   */
  static info(message) {
    logger.info(message);
  }

  /**
   * @static
   * @description 记录 HTTP 请求日志
   * @param {string} message - 请求信息
   */
  static http(message) {
    logger.http(message);
  }

  /**
   * @static
   * @description 记录调试日志
   * @param {string} message - 调试信息
   */
  static debug(message) {
    logger.debug(message);
  }

  /**
   * @static
   * @description 记录数据库操作日志
   * @param {string} operation - 操作类型
   * @param {string} model - 模型名称
   * @param {Object} [data] - 操作数据
   */
  static db(operation, model, data) {
    const message = `[DB] ${operation} ${model}${data ? `: ${JSON.stringify(data)}` : ''}`;
    logger.info(message);
  }

  /**
   * @static
   * @description 记录请求日志
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {number} responseTime - 响应时间
   */
  static request(req, res, responseTime) {
    const message = `[${req.method}] ${req.originalUrl} ${res.statusCode} ${responseTime}ms`;
    logger.http(message);
  }
}

/**
 * @function requestLogger
 * @description 请求日志中间件，记录请求的详细信息
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
export const requestLogger = (req, res, next) => {
  // 记录请求开始时间
  const start = Date.now();

  // 请求结束时记录日志
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    Logger.request(req, res, responseTime);
  });

  next();
};

/**
 * @function errorLogger
 * @description 错误日志中间件，记录错误信息
 * @param {Error} err - 错误对象
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
export const errorLogger = (err, req, res, next) => {
  Logger.error(`[${req.method}] ${req.originalUrl}`, err);
  next(err);
};
