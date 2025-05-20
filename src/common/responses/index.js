/**
 * @file 统一响应格式模块
 * @description 定义API响应的标准格式和常用响应方法
 * @author AI Assistant
 * @createDate 2024-03-21
 */

/**
 * @class ApiResponse
 * @description API响应格式处理类，提供统一的响应方法
 */
export class ApiResponse {
  /**
   * @static
   * @description 成功响应
   * @param {*} [data=null] - 响应数据
   * @param {string} [message='操作成功'] - 响应消息
   * @returns {Object} 标准成功响应对象
   */
  static success(data = null, message = '操作成功') {
    return {
      success: true,
      code: 200,
      message,
      data
    };
  }

  /**
   * @static
   * @description 错误响应
   * @param {string} [message='操作失败'] - 错误消息
   * @param {number} [code=500] - 错误码
   * @param {*} [data=null] - 错误数据
   * @returns {Object} 标准错误响应对象
   */
  static error(message = '操作失败', code = 500, data = null) {
    return {
      success: false,
      code,
      message,
      data
    };
  }

  /**
   * @static
   * @description 列表数据响应
   * @param {Array} data - 列表数据
   * @param {number} total - 总数据量
   * @param {number} [page=1] - 当前页码
   * @param {number} [pageSize=10] - 每页数量
   * @returns {Object} 标准列表响应对象
   */
  static list(data, total, page = 1, pageSize = 10) {
    return {
      success: true,
      code: 200,
      message: '获取列表成功',
      data: {
        list: data,
        pagination: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    };
  }

  /**
   * @static
   * @description 创建成功响应
   * @param {*} [data=null] - 创建的数据
   * @param {string} [message='创建成功'] - 响应消息
   * @returns {Object} 标准创建成功响应对象
   */
  static created(data = null, message = '创建成功') {
    return {
      success: true,
      code: 201,
      message,
      data
    };
  }

  /**
   * @static
   * @description 无内容响应
   * @param {string} [message='操作成功'] - 响应消息
   * @returns {Object} 标准无内容响应对象
   */
  static noContent(message = '操作成功') {
    return {
      success: true,
      code: 204,
      message,
      data: null
    };
  }
}

export default ApiResponse;

