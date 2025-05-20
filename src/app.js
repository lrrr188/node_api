/**
 * @file 应用程序入口
 * @description Express 应用程序配置和中间件设置
 * @author AI Assistant
 * @createDate 2024-03-21
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { errorHandler } from './middlewares/error/index.js';
import { requestLogger } from './utils/logger/index.js';
import { API_VERSION, swaggerConfig } from './config/index.js';

// 创建 Express 应用
const app = express();

// 基础中间件
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production', // 生产环境启用 CSP
  crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production', // 生产环境启用 COEP
  crossOriginOpenerPolicy: process.env.NODE_ENV === 'production', // 生产环境启用 COOP
  crossOriginResourcePolicy: process.env.NODE_ENV === 'production', // 生产环境启用 CORP
})); // 安全头

// 启用压缩
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  level: 6, // 压缩级别 (0-9)，默认为6
  threshold: 1024 // 只压缩大于1KB的响应
}));

// 请求体解析
app.use(express.json({ limit: '10mb' })); // JSON 解析，限制请求体大小
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // URL 编码解析

// CORS 配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // 允许发送cookie
  maxAge: 86400 // CORS预检请求缓存24小时
}));

// 静态文件服务
if (process.env.ENABLE_STATIC === 'true') {
  app.use('/static', express.static('public', {
    maxAge: '1d', // 静态文件缓存1天
    etag: true, // 启用ETag
    lastModified: true // 启用Last-Modified
  }));
}

// 请求日志
if (process.env.ENABLE_REQUEST_LOG !== 'false') {
  app.use(requestLogger);
}

// API 路由
app.use(`/api/${API_VERSION}/admin`, (await import('./api/v1/admin/routes/index.js')).default);
app.use(`/api/${API_VERSION}/web`, (await import('./api/v1/web/routes/index.js')).default);

// Swagger API 文档
if (process.env.ENABLE_API_DOCS !== 'false') {
  const specs = swaggerJsdoc(swaggerConfig);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }' // 隐藏顶部栏
  }));
}

// 404处理
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `找不到路径: ${req.originalUrl}`,
    code: 404
  });
});

// 错误处理中间件
app.use(errorHandler);

// 未捕获的异常处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

// 未处理的Promise拒绝处理
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
});

export default app;
