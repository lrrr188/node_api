/**
 * @file 日志配置
 * @description 日志系统配置
 * @author AI Assistant
 * @createDate 2024-03-21
 */

/**
 * 日志配置文件的主要结构：
 */
const config = {
  // 开发环境配置
  development: {
    // 日志级别：debug（最详细的日志级别，包含调试信息）
    level: 'debug',
    // 日志格式配置
    format: {
      timestamp: true,    // 显示时间戳
      colorize: true      // 在控制台使用彩色输出
    },
    // 日志输出方式配置
    transports: {
      console: true,      // 输出到控制台
      file: {
        error: true,      // 记录错误日志到文件
        combined: true,   // 记录所有级别日志到文件
        path: 'logs'      // 日志文件存储路径
      }
    }
  },

  // 测试环境配置
  test: {
    // 日志级别：info（比 debug 级别低，不包含调试信息）
    level: 'info',
    format: {
      timestamp: true,    // 显示时间戳
      colorize: false     // 不使用彩色输出
    },
    transports: {
      console: true,      // 输出到控制台
      file: {
        error: true,      // 记录错误日志
        combined: true,   // 记录所有日志
        path: 'logs'      // 日志存储路径
      }
    }
  },

  // 生产环境配置
  production: {
    // 日志级别：可通过环境变量配置，默认 info
    level: process.env.LOG_LEVEL || 'info',
    format: {
      timestamp: true,    // 显示时间戳
      colorize: false     // 生产环境不使用彩色输出
    },
    transports: {
      console: false,     // 生产环境不输出到控制台
      file: {
        error: true,      // 记录错误日志
        combined: true,   // 记录所有日志
        path: process.env.LOG_PATH || 'logs'  // 日志路径可配置
      }
    }
  }
};

// 根据当前环境获取对应的日志配置
const env = process.env.NODE_ENV || 'development';
const loggerConfig = config[env];

// 导出配置
export { loggerConfig };
export default loggerConfig; 