/**
 * @file Redis 配置
 * @description Redis 客户端配置和连接管理
 * @author AI Assistant
 * @createDate 2024-03-21
 */

import Redis from 'ioredis';
import { Logger } from '../../utils/logger/index.js';

// Redis 配置
const config = {
  development: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: process.env.REDIS_DB || 0,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    showFriendlyErrorStack: true,
    tls: process.env.REDIS_SSL === 'true' ? {
      rejectUnauthorized: false
    } : undefined
  },
  test: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: process.env.REDIS_DB || 1,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 2,
    enableReadyCheck: true,
    showFriendlyErrorStack: true
  },
  production: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB || 0,
    retryStrategy: (times) => {
      const delay = Math.min(times * 100, 3000);
      return delay;
    },
    maxRetriesPerRequest: 5,
    enableReadyCheck: true,
    showFriendlyErrorStack: false,
    tls: process.env.REDIS_SSL === 'true' ? {
      rejectUnauthorized: true
    } : undefined
  }
};

// 获取当前环境
const env = process.env.NODE_ENV || 'development';
const redisConfig = config[env];

// 创建 Redis 客户端实例
const redisClient = new Redis(redisConfig);

// Redis 连接事件处理
redisClient.on('connect', () => {
  Logger.info('Redis 连接成功');
});

redisClient.on('error', (err) => {
  Logger.error('Redis 连接错误:', err);
});

redisClient.on('close', () => {
  Logger.warn('Redis 连接关闭');
});

// 默认缓存时间（秒）
const DEFAULT_EXPIRE = parseInt(process.env.REDIS_DEFAULT_EXPIRE || '3600');

/**
 * 设置缓存
 * @param {string} key - 缓存键
 * @param {any} value - 缓存值
 * @param {number} [expire=DEFAULT_EXPIRE] - 过期时间（秒）
 * @returns {Promise<void>}
 */
export const setCache = async (key, value, expire = DEFAULT_EXPIRE) => {
  try {
    await redisClient.set(
      key, 
      typeof value === 'string' ? value : JSON.stringify(value), 
      'EX', 
      expire
    );
  } catch (error) {
    Logger.error('Redis 设置缓存失败:', error);
    throw error;
  }
};

/**
 * 获取缓存
 * @param {string} key - 缓存键
 * @returns {Promise<any>}
 */
export const getCache = async (key) => {
  try {
    const value = await redisClient.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    Logger.error('Redis 获取缓存失败:', error);
    throw error;
  }
};

/**
 * 删除缓存
 * @param {string} key - 缓存键
 * @returns {Promise<void>}
 */
export const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    Logger.error('Redis 删除缓存失败:', error);
    throw error;
  }
};

/**
 * 获取 Redis 连接状态
 * @returns {Object} Redis 状态信息
 */
export const getRedisStatus = () => {
  return {
    status: redisClient.status,
    isOpen: redisClient.status === 'ready',
    config: {
      host: redisConfig.host,
      port: redisConfig.port,
      db: redisConfig.db,
      tls: redisConfig.tls ? '已启用' : '未启用'
    }
  };
};

// 导出 Redis 客户端实例和配置
export { redisConfig };
export default redisClient;
