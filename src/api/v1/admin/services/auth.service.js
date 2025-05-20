/**
 * @file 认证服务
 * @description 实现认证相关的业务逻辑
 * @author AI Assistant
 * @createDate 2024-03-21
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UnauthorizedError } from '../../../common/errors/index.js';
import { Logger } from '../../../utils/logger/index.js';
import { RedisService } from '../../../config/redis/index.js';

/**
 * @class AuthService
 * @description 认证服务类
 */
export class AuthService {
  /**
   * @static
   * @description 管理员登录
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @returns {Promise<Object>} 登录结果
   */
  static async login(username, password) {
    try {
      // TODO: 从数据库查询用户
      const user = {
        id: 1,
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
      };

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedError('用户名或密码错误');
      }

      // 生成 token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // 将 token 存入 Redis
      await RedisService.set(`token:${user.id}`, token, 7 * 24 * 60 * 60); // 7天

      Logger.info(`用户 ${username} 登录成功`);

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      };
    } catch (error) {
      Logger.error('登录失败:', error);
      throw error;
    }
  }

  /**
   * @static
   * @description 管理员登出
   * @param {number} userId - 用户ID
   */
  static async logout(userId) {
    try {
      // 从 Redis 中删除 token
      await RedisService.del(`token:${userId}`);
      Logger.info(`用户 ${userId} 登出成功`);
    } catch (error) {
      Logger.error('登出失败:', error);
      throw error;
    }
  }

  /**
   * @static
   * @description 获取管理员信息
   * @param {number} userId - 用户ID
   * @returns {Promise<Object>} 用户信息
   */
  static async getProfile(userId) {
    try {
      // TODO: 从数据库查询用户信息
      const user = {
        id: userId,
        username: 'admin',
        role: 'admin',
        permissions: ['read', 'write'],
      };

      return user;
    } catch (error) {
      Logger.error('获取用户信息失败:', error);
      throw error;
    }
  }
} 