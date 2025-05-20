/**
 * @Author: System Architect Team
 * @Date: 2024-03-19
 * @Description: 管理员认证路由
 */

import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js';
import { validateRequest } from '../../../middlewares/validate.middleware.js';
import { loginSchema } from '../validations/auth.validation.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/auth/login:
 *   post:
 *     summary: 管理员登录
 *     tags: [Admin/Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *                 example: admin
 *               password:
 *                 type: string
 *                 description: 密码
 *                 example: admin123
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: 用户ID
 *                     username:
 *                       type: string
 *                       description: 用户名
 *                     role:
 *                       type: string
 *                       description: 用户角色
 *       401:
 *         description: 用户名或密码错误
 *       400:
 *         description: 请求参数错误
 */
router.post('/login', validateRequest(loginSchema), AuthController.login);

/**
 * @swagger
 * /api/v1/admin/auth/logout:
 *   post:
 *     summary: 管理员登出
 *     tags: [Admin/Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 登出成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 成功消息
 *                   example: 登出成功
 *       401:
 *         description: 未授权
 */
router.post('/logout', authMiddleware, AuthController.logout);

/**
 * @swagger
 * /api/v1/admin/auth/profile:
 *   get:
 *     summary: 获取管理员信息
 *     tags: [Admin/Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: 用户ID
 *                 username:
 *                   type: string
 *                   description: 用户名
 *                 role:
 *                   type: string
 *                   description: 用户角色
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: 用户权限列表
 *       401:
 *         description: 未授权
 */
router.get('/profile', authMiddleware, AuthController.getProfile);

export default router; 