/**
 * @file 错误处理中间件
 * @description 统一处理应用程序中的错误，包括操作错误和系统错误
 * @author AI Assistant
 * @createDate 2024-03-21
 */

import { AppError } from '../../common/errors/index.js';
import { ApiResponse } from '../../common/responses/index.js';
import { Logger } from '../../utils/logger/index.js';

/**
 * 清理错误堆栈中的敏感信息
 * @param {string} stack - 错误堆栈
 * @returns {string} 清理后的堆栈
 */
const sanitizeErrorStack = (stack) => {
  if (!stack) return '';
  
  // 移除文件系统路径
  return stack
    .split('\n')
    .map(line => {
      return line
        .replace(/\(.*node_modules/g, '(node_modules')
        .replace(/\(\/.*\/src\//g, '(src/')
        .replace(/\{.*\}/g, '{...}') // 移除 JSON 数据
        .replace(/\[.*\]/g, '[...]'); // 移除数组数据
    })
    .join('\n');
};

/**
 * 清理错误消息中的敏感信息
 * @param {string} message - 错误消息
 * @returns {string} 清理后的消息
 */
const sanitizeErrorMessage = (message) => {
  if (!message) return '未知错误';
  
  // 移除可能的敏感信息
  return message
    .replace(/\b\d{4}[-]\d{4}[-]\d{4}[-]\d{4}\b/g, '****-****-****-****') // 信用卡号
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '****@****.***') // 邮箱
    .replace(/\b\d{11}\b/g, '*****') // 手机号
    .replace(/password[:=]\s*['"][^'"]*['"]/, 'password: "****"') // 密码
    .replace(/secret[:=]\s*['"][^'"]*['"]/, 'secret: "****"'); // 密钥
};

/**
 * @function errorHandler
 * @description 全局错误处理中间件
 * @param {Error} err - 错误对象
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
export const errorHandler = (err, req, res, next) => {
  // 记录错误日志
  Logger.error('错误详情:', {
    url: req.originalUrl,
    method: req.method,
    error: {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });

  // 处理已知的操作错误
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      ApiResponse.error(sanitizeErrorMessage(err.message), err.statusCode)
    );
  }

  // 处理 Sequelize 验证错误
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(e => sanitizeErrorMessage(e.message)).join(', ');
    return res.status(422).json(
      ApiResponse.error(message, 422)
    );
  }

  // 处理 Sequelize 唯一约束错误
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = err.errors.map(e => sanitizeErrorMessage(e.message)).join(', ');
    return res.status(409).json(
      ApiResponse.error(message, 409)
    );
  }

  // 处理 JWT 错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(
      ApiResponse.error('无效的令牌', 401)
    );
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(
      ApiResponse.error('令牌已过期', 401)
    );
  }

  // 处理请求体解析错误
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json(
      ApiResponse.error('无效的请求数据格式', 400)
    );
  }

  // 处理文件上传错误
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json(
      ApiResponse.error('文件大小超出限制', 400)
    );
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json(
      ApiResponse.error('文件数量超出限制', 400)
    );
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json(
      ApiResponse.error('未预期的文件类型', 400)
    );
  }

  // 处理未知错误
  const isDev = process.env.NODE_ENV === 'development';
  return res.status(500).json(
    ApiResponse.error(
      isDev ? sanitizeErrorMessage(err.message) : '服务器内部错误',
      500,
      isDev ? {
        stack: sanitizeErrorStack(err.stack),
        type: err.name
      } : undefined
    )
  );
};

/**
 * @function notFoundHandler
 * @description 处理 404 错误
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
export const notFoundHandler = (req, res, next) => {
  next(new AppError(`找不到路径: ${req.originalUrl}`, 404));
}; 