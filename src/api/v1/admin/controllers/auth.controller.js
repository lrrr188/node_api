/**
 * @file 认证控制器
 * @description 处理认证相关的请求
 * @author AI Assistant
 * @createDate 2024-03-21
 */

import { AuthService } from '../services/auth.service.js';
import { Logger } from '../../../utils/logger/index.js';

/**
 * @class AuthController
 * @description 认证控制器类
 */
export class AuthController {
  /**
   * @static
   * @description 管理员登录
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件
   */
  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const result = await AuthService.login(username, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @static
   * @description 管理员登出
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件
   */
  static async logout(req, res, next) {
    try {
      const userId = req.user.id;
      await AuthService.logout(userId);
      res.json({ message: '登出成功' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @static
   * @description 获取管理员信息
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件
   */
  static async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const profile = await AuthService.getProfile(userId);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }
} 