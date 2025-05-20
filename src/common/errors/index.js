/**
 * @file 统一错误处理模块
 * @description 定义应用中的错误类型和错误处理机制
 * @author AI Assistant
 * @createDate 2024-03-21
 */

/**
 * @class AppError
 * @description 应用程序基础错误类，所有自定义错误都继承自此类
 * @extends Error
 */
export class AppError extends Error {
  /**
   * @constructor
   * @param {string} message - 错误信息
   * @param {number} statusCode - HTTP状态码
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * @class BadRequestError
 * @description 400 错误 - 客户端请求错误
 * @extends AppError
 */
export class BadRequestError extends AppError {
  /**
   * @constructor
   * @param {string} [message='无效的请求'] - 错误信息
   */
  constructor(message = '无效的请求') {
    super(message, 400);
  }
}

/**
 * @class UnauthorizedError
 * @description 401 错误 - 未授权访问
 * @extends AppError
 */
export class UnauthorizedError extends AppError {
  /**
   * @constructor
   * @param {string} [message='未授权访问'] - 错误信息
   */
  constructor(message = '未授权访问') {
    super(message, 401);
  }
}

/**
 * @class ForbiddenError
 * @description 403 错误 - 禁止访问
 * @extends AppError
 */
export class ForbiddenError extends AppError {
  /**
   * @constructor
   * @param {string} [message='禁止访问'] - 错误信息
   */
  constructor(message = '禁止访问') {
    super(message, 403);
  }
}

/**
 * @class NotFoundError
 * @description 404 错误 - 资源不存在
 * @extends AppError
 */
export class NotFoundError extends AppError {
  /**
   * @constructor
   * @param {string} [message='资源不存在'] - 错误信息
   */
  constructor(message = '资源不存在') {
    super(message, 404);
  }
}

/**
 * @class ValidationError
 * @description 422 错误 - 数据验证失败
 * @extends AppError
 */
export class ValidationError extends AppError {
  /**
   * @constructor
   * @param {string} [message='数据验证失败'] - 错误信息
   */
  constructor(message = '数据验证失败') {
    super(message, 422);
  }
}

/**
 * @class ConflictError
 * @description 409 错误 - 资源冲突
 * @extends AppError
 */
export class ConflictError extends AppError {
  /**
   * @constructor
   * @param {string} [message='资源冲突'] - 错误信息
   */
  constructor(message = '资源冲突') {
    super(message, 409);
  }
}

/**
 * @class InternalServerError
 * @description 500 错误 - 服务器内部错误
 * @extends AppError
 */
export class InternalServerError extends AppError {
  /**
   * @constructor
   * @param {string} [message='服务器内部错误'] - 错误信息
   */
  constructor(message = '服务器内部错误') {
    super(message, 500);
  }
}

