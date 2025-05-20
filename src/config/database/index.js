/**
 * @file 数据库配置
 * @description MySQL 数据库配置和连接管理
 * @author AI Assistant
 * @createDate 2024-03-21
 */

import { Sequelize } from 'sequelize';
import { Logger } from '../../utils/logger/index.js';

// 数据库配置
const config = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'school_admin',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.DB_LOGGING === 'true' ? 
      (msg) => Logger.debug(msg) : 
      false,
    timezone: '+08:00',
    define: {
      timestamps: true,
      underscored: true,
      paranoid: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at'
    },
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || '10'),
      min: parseInt(process.env.DB_POOL_MIN || '2'),
      acquire: 30000,
      idle: 10000,
      evict: 30000, // 每30秒运行一次清理函数
      handleDisconnects: true // 自动处理断开的连接
    },
    retry: {
      max: 5,
      timeout: 3000,
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/
      ]
    },
    benchmark: true, // 启用查询时间测量
    dialectOptions: {
      connectTimeout: 10000,
      // 开发环境不启用 SSL
      ssl: null
    }
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'school_admin_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    timezone: '+08:00',
    define: {
      timestamps: true,
      underscored: true,
      paranoid: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at'
    },
    pool: {
      max: 5,
      min: 1,
      acquire: 30000,
      idle: 10000,
      evict: 30000,
      handleDisconnects: true
    },
    retry: {
      max: 3,
      timeout: 2000,
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/
      ]
    },
    benchmark: true,
    dialectOptions: {
      connectTimeout: 10000,
      ssl: null
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    timezone: '+08:00',
    define: {
      timestamps: true,
      underscored: true,
      paranoid: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at'
    },
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || '20'),
      min: parseInt(process.env.DB_POOL_MIN || '5'),
      acquire: 60000,
      idle: 30000,
      evict: 60000,
      handleDisconnects: true
    },
    retry: {
      max: 5,
      timeout: 5000,
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/
      ]
    },
    benchmark: true,
    dialectOptions: {
      connectTimeout: 10000,
      // 生产环境启用 SSL
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};

// 获取当前环境
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// 慢查询阈值（毫秒）
const SLOW_QUERY_THRESHOLD = parseInt(process.env.SLOW_QUERY_TIME || '1000');

/**
 * 重试连接数据库
 * @param {number} retries - 当前重试次数
 * @returns {Promise<void>}
 */
const retryConnection = async (retries = 0) => {
  try {
    await sequelize.authenticate();
    Logger.info('数据库连接成功');
  } catch (error) {
    const shouldRetry = dbConfig.retry.match.some(pattern => pattern.test(error.name));
    if (shouldRetry && retries < dbConfig.retry.max) {
      Logger.warn(`数据库连接失败(${error.name})，${dbConfig.retry.timeout/1000}秒后重试(${retries + 1}/${dbConfig.retry.max})...`);
      await new Promise(resolve => setTimeout(resolve, dbConfig.retry.timeout));
      return retryConnection(retries + 1);
    }
    throw error;
  }
};

// 创建 Sequelize 实例
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    timezone: dbConfig.timezone,
    define: dbConfig.define,
    pool: {
      ...dbConfig.pool,
      // 连接获取时的回调
      afterCreate: (connection, done) => {
        Logger.debug('创建新连接:', connection.uuid);
        done(null, connection);
      },
      // 连接释放时的回调
      afterDisconnect: (connection) => {
        Logger.debug('释放连接:', connection.uuid);
      }
    },
    benchmark: dbConfig.benchmark,
    dialectOptions: dbConfig.dialectOptions
  }
);

// 添加性能监控钩子
sequelize.addHook('beforeQuery', (options) => {
  options.startTime = Date.now();
});

sequelize.addHook('afterQuery', (options) => {
  const duration = Date.now() - options.startTime;
  if (duration > SLOW_QUERY_THRESHOLD) {
    Logger.warn('检测到慢查询:', {
      sql: options.sql,
      duration: `${duration}ms`,
      params: options.replacements || options.bind,
      stackTrace: new Error().stack
    });
  }
});

// 初始化连接池
await sequelize.authenticate();

/**
 * 获取数据库连接信息
 * @returns {Object} 数据库连接信息
 */
const getConnectionInfo = () => {
  return {
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    username: dbConfig.username,
    dialect: dbConfig.dialect,
    timezone: dbConfig.timezone,
    pool: dbConfig.pool,
    ssl: dbConfig.dialectOptions.ssl
  };
};

/**
 * 测试数据库连接
 * @returns {Promise<Object>} 连接测试结果
 */
const testConnection = async () => {
  try {
    await retryConnection();
    const info = getConnectionInfo();
    return {
      success: true,
      info
    };
  } catch (error) {
    Logger.error('数据库连接失败:', error);
    throw error;
  }
};

/**
 * 同步数据库模型
 * @param {Object} options - 同步选项
 * @returns {Promise<Object>} 同步结果
 */
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    const models = Object.keys(sequelize.models);
    Logger.info('数据库同步成功', { models });
    return {
      success: true,
      models
    };
  } catch (error) {
    Logger.error('数据库同步失败:', error);
    throw error;
  }
};

/**
 * 关闭数据库连接
 * @returns {Promise<void>}
 */
const closeConnection = async () => {
  try {
    await sequelize.close();
    Logger.info('数据库连接已关闭');
  } catch (error) {
    Logger.error('关闭数据库连接失败:', error);
    throw error;
  }
};

// 进程退出时关闭连接
process.on('SIGINT', async () => {
  try {
    await closeConnection();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
});

export {
  sequelize as default,
  testConnection,
  syncDatabase,
  closeConnection,
  getConnectionInfo
};
