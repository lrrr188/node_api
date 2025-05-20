/**
 * @file 认证验证规则
 * @description 定义认证相关的请求验证规则
 * @author AI Assistant
 * @createDate 2024-03-21
 */

import Joi from 'joi';

/**
 * @constant {Object} loginSchema
 * @description 登录请求验证规则
 */
export const loginSchema = Joi.object({
  username: Joi.string().required().min(3).max(30).messages({
    'string.empty': '用户名不能为空',
    'string.min': '用户名长度不能小于 {#limit} 个字符',
    'string.max': '用户名长度不能大于 {#limit} 个字符',
    'any.required': '用户名是必填项',
  }),
  password: Joi.string().required().min(6).max(30).messages({
    'string.empty': '密码不能为空',
    'string.min': '密码长度不能小于 {#limit} 个字符',
    'string.max': '密码长度不能大于 {#limit} 个字符',
    'any.required': '密码是必填项',
  }),
}); 