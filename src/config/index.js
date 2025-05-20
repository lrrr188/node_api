/**
 * @file 主配置文件
 * @description 导出所有配置
 * @author AI Assistant
 * @createDate 2024-03-21
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载环境变量
dotenv.config({
  path: resolve(__dirname, '../../.env.development')
});

// 验证环境变量
const validateEnv = () => {
  const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  
  // 生产环境额外检查
  if (process.env.NODE_ENV === 'production') {
    requiredEnvVars.push('JWT_SECRET', 'CORS_ORIGIN');
  }



  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error(`缺少必要的环境变量: ${missingVars.join(', ')}`);
    process.exit(1);
  }
};

// 验证环境变量
validateEnv();

// 环境变量
const env = process.env.NODE_ENV || 'development';

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: 'mysql'
};

// JWT 配置
const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};

// CORS 配置
const corsConfig = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// API 版本
const API_VERSION = 'v1';

// Swagger 配置
const swaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '学校管理系统 API',
      version: API_VERSION,
      description: '学校管理系统后端 API 文档'
    },
    servers: [
      {
        url: `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`,
        description: '开发服务器'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/api/v1/**/*.js'] // API 文件路径
};

export {
  env,
  API_VERSION,
  dbConfig,
  jwtConfig,
  corsConfig,
  swaggerConfig,
  validateEnv
};
