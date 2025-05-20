/**
 * @file 管理后台路由入口
 * @description 整合所有管理后台路由
 * @author AI Assistant
 * @createDate 2024-03-21
 */

import express from 'express';
import { requestLogger } from '../../../../utils/logger/index.js';

const router = express.Router();

// 请求日志中间件
router.use(requestLogger);

// 测试路由
router.get('/', (req, res) => {
  res.json({
    message: '管理后台 API 正在开发中...'
  });
});

export default router; 