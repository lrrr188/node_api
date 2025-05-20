/**
 * @file Web 路由入口
 * @description 整合所有 Web 端路由（待开发）
 * @author AI Assistant
 * @createDate 2024-03-21
 */

import express from 'express';
import { requestLogger } from '../../../../utils/logger/index.js';

const router = express.Router();

// 请求日志中间件
router.use(requestLogger);

// TODO: Web 端路由待开发
router.get('/', (req, res) => {
  res.json({
    message: 'Web API 正在开发中...'
  });
});

export default router; 