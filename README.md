# School Admin Server

基于 Node.js + Express + Sequelize 构建的系统后端服务

## 目录

- [项目简介](#项目简介)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [开发规范](#开发规范)
- [功能模块](#功能模块)
- [中间件详解](#中间件详解)
- [安全配置](#安全配置)
- [API 文档](#api-文档)
- [日志系统](#日志系统)
- [数据库](#数据库)
- [部署指南](#部署指南)
- [常见问题](#常见问题)

## 项目简介

本项目是一个现代化的系统后端服务，提供了完整的用户管理、权限控制、日志记录等功能。采用 RESTful API 设计，支持多环境部署，具有完善的错误处理和日志记录机制。

## 功能特性

### 用户认证与授权
- JWT 基于角色的访问控制
- 多角色权限管理
- 登录失败次数限制
- Token 自动续期

### 数据安全
- 密码加密存储
- XSS 防护
- CSRF 防护
- 请求速率限制
- SQL 注入防护

### 日志记录
- 访问日志
- 操作日志
- 错误日志
- 性能监控

### 系统功能
- 用户管理
- 角色管理
- 权限管理
- 菜单管理
- 系统配置
- 数据字典

## 技术栈

### 核心框架
- **Node.js**: v18.0.0+
- **Express.js**: v4.18.0+
- **MySQL**: v8.0+
- **Redis**: v6.0+

### 数据库和缓存
- **Sequelize**: v6.x (ORM)
- **ioredis**: v5.x (Redis 客户端)
- **mysql2**: v3.x (MySQL 驱动)

### 安全和认证
- **jsonwebtoken**: JWT 实现
- **bcryptjs**: 密码加密
- **helmet**: 安全头设置
- **cors**: 跨域资源共享
- **express-rate-limit**: 请求限制

### 工具和验证
- **winston**: 日志管理
- **joi**: 数据验证
- **moment**: 时间处理
- **lodash**: 工具函数
- **uuid**: 唯一标识符

### 开发工具
- **ESLint**: 代码检查
- **Prettier**: 代码格式化
- **Nodemon**: 开发热重载
- **Jest**: 单元测试
- **Swagger**: API 文档

## 项目结构

### 目录树

```
src/
├── api/                          # API 接口目录
│   ├── v1/                      # API 版本
│   │   ├── admin/              # 管理端接口
│   │   │   ├── controllers/    # 控制器层：处理请求和响应
│   │   │   ├── services/       # 服务层：业务逻辑
│   │   │   ├── validations/    # 验证层：请求参数验证
│   │   │   └── routes/         # 路由层：URL 映射
│   │   └── web/               # 前端接口
│   └── docs/                  # API 文档
│
├── config/                      # 配置文件目录
│   ├── database/              # 数据库配置
│   │   ├── index.js          # 主配置文件
│   │   └── migrations/       # 数据迁移文件
│   ├── redis/                # Redis 配置
│   ├── logger/               # 日志配置
│   └── security/             # 安全配置
│
├── middlewares/                 # 中间件目录
│   ├── auth/                 # 认证中间件
│   │   ├── jwt.js           # JWT 认证
│   │   └── roles.js         # 角色认证
│   ├── validation/          # 参数验证中间件
│   ├── rateLimiter/         # 请求限制中间件
│   └── error/               # 错误处理中间件
│
├── models/                      # 数据模型目录
│   ├── user.js               # 用户模型
│   ├── role.js              # 角色模型
│   └── permission.js        # 权限模型
│
├── services/                    # 业务服务目录
│   ├── auth/                 # 认证相关服务
│   ├── user/                 # 用户相关服务
│   └── system/               # 系统相关服务
│
├── utils/                       # 工具函数目录
│   ├── logger/               # 日志工具
│   ├── validator/            # 数据验证工具
│   ├── security/            # 安全相关工具
│   └── helper/              # 通用辅助函数
│
├── startup/                     # 启动配置目录
│   ├── banner.js            # 启动界面配置
│   ├── routes.js            # 路由注册配置
│   └── middleware.js        # 中间件注册配置
│
└── server.js                    # 应用程序入口文件
```

### 目录说明

#### api/
- **controllers/**: 控制器，处理 HTTP 请求和响应
- **services/**: 业务逻辑层，实现具体功能
- **validations/**: 请求参数验证规则
- **routes/**: API 路由定义和映射·

#### config/
- **database/**: 数据库配置和迁移
- **redis/**: Redis 缓存配置
- **logger/**: 日志系统配置
- **security/**: 安全相关配置

#### middlewares/
- **auth/**: 身份认证和授权
- **validation/**: 请求参数验证
- **rateLimiter/**: 访问频率限制
- **error/**: 统一错误处理

#### models/
数据库模型定义，包含：
- 用户管理
- 角色管理
- 权限管理

#### services/
业务逻辑实现，包含：
- 认证服务
- 用户服务
- 系统服务

#### utils/
工具函数集合：
- 日志工具
- 数据验证
- 安全工具
- 辅助函数

#### startup/
应用启动相关配置：
- 启动界面
- 路由注册
- 中间件配置

## 环境要求

### 系统要求
- Node.js >= 18.0.0
- MySQL >= 8.0
- Redis >= 6.0
- PM2 (生产环境)

### 推荐开发环境
- VSCode
- Postman/Insomnia
- MySQL Workbench
- Redis Desktop Manager

### 开发工具配置
- **VSCode 插件**:
  - ESLint
  - Prettier
  - EditorConfig
  - DotENV
  - REST Client

## 快速开始

1. **克隆项目**
```bash
git clone [项目地址]
cd server_v4
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
复制 .env.example 到 .env 并修改配置：
```bash
cp .env.example .env
```

4. **数据库初始化**
```bash
# 创建数据库
npm run db:create

# 运行迁移
npm run db:migrate

# 添加种子数据
npm run db:seed
```

5. **启动服务**
```bash
# 开发环境
npm run dev

# 生产环境
npm start
```

## 配置说明

### 环境变量配置 (.env)

```env
# 服务器配置
NODE_ENV=development        # 环境：development/test/production
PORT=3000                  # 服务端口
HOST=localhost             # 服务地址
API_PREFIX=/api/v1         # API前缀

# 数据库配置
DB_HOST=localhost          # 数据库地址
DB_PORT=3306              # 数据库端口
DB_NAME=school_admin      # 数据库名
DB_USER=root              # 数据库用户
DB_PASS=password          # 数据库密码
DB_POOL_MIN=0             # 最小连接数
DB_POOL_MAX=5             # 最大连接数
DB_POOL_IDLE=10000        # 空闲超时(ms)
DB_POOL_ACQUIRE=30000     # 连接超时(ms)

# Redis配置
REDIS_HOST=localhost       # Redis地址
REDIS_PORT=6379           # Redis端口
REDIS_PASSWORD=           # Redis密码
REDIS_DB=0               # Redis数据库
REDIS_PREFIX=school:     # 键前缀

# JWT配置
JWT_SECRET=your-secret-key # JWT密钥
JWT_EXPIRES_IN=7d         # Token过期时间
JWT_REFRESH_IN=30d        # 刷新Token过期时间

# 日志配置
LOG_FILE_PATH=/path/to/logs  # 日志路径
LOG_LEVEL=info              # 日志级别
LOG_MAX_SIZE=10m           # 单文件最大尺寸
LOG_MAX_FILES=7            # 最大文件数

# 安全配置
RATE_LIMIT_WINDOW=15      # 限流时间窗口(分钟)
RATE_LIMIT_MAX=100        # 最大请求次数
CORS_ORIGIN=*             # CORS允许来源
PASSWORD_SALT_ROUNDS=10   # 密码加密轮数

# API文档
ENABLE_API_DOCS=true      # 启用API文档
SWAGGER_USERNAME=admin    # 文档访问用户名
SWAGGER_PASSWORD=123456   # 文档访问密码

# 开发配置
DB_SYNC_ALTER=false       # 自动同步表结构
DB_SYNC_FORCE=false       # 强制同步（清空数据）
ENABLE_REQUEST_LOG=true   # 启用请求日志
```

### 日志系统

系统使用 Winston 进行日志管理，分为以下几类：

#### 错误日志 (error.log)
- 系统错误
- 未捕获异常
- 数据库错误
- 格式：`[ERROR] YYYY-MM-DD HH:mm:ss - 错误信息`

#### 访问日志 (access.log)
- HTTP 请求记录
- 响应时间
- 状态码
- 格式：`[HTTP] YYYY-MM-DD HH:mm:ss - [METHOD] URL STATUS TIME`

#### 应用日志 (app.log)
- 业务操作记录
- 重要流程
- 关键节点
- 格式：`[INFO] YYYY-MM-DD HH:mm:ss - 操作信息`

#### 调试日志 (debug.log)
- 开发调试信息
- 性能监控数据
- 格式：`[DEBUG] YYYY-MM-DD HH:mm:ss - 调试信息`

### 日志配置项
```javascript
{
  level: 'info',              // 日志级别
  format: 'combined',         // 日志格式
  maxSize: '10m',            // 单文件大小
  maxFiles: '7d',            // 保留天数
  zippedArchive: true,       // 压缩存档
  timestamp: true,           // 时间戳
  colorize: false            // 彩色输出
}
```

## 中间件详解

### 认证中间件 (auth)
- JWT 令牌验证
- 角色权限检查
- 访问控制列表 (ACL)
- Token 续期处理

### 请求处理
- 请求解析 (body-parser)
- 文件上传 (multer)
- 压缩 (compression)
- 跨域 (cors)

### 安全中间件
- 安全头设置 (helmet)
- XSS 防护
- CSRF 防护
- 速率限制

### 日志中间件
- 请求日志
- 响应时间
- 错误捕获
- 性能监控

### 验证中间件
- 请求参数验证
- 数据清理
- 类型转换
- 自定义规则

## 安全配置

### 密码加密
```javascript
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};
```

### JWT 配置
```javascript
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};
```

### 请求限制
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15分钟
  max: 100                    // 最大请求数
});
```

### 安全头设置
```javascript
const helmet = require('helmet');

app.use(helmet());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy());
```

## 数据库

### 表结构设计

#### 用户表 (users)
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  role_id INT,
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 角色表 (roles)
```sql
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 权限表 (permissions)
```sql
CREATE TABLE permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 连接池配置

```javascript
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  pool: {
    min: parseInt(process.env.DB_POOL_MIN),
    max: parseInt(process.env.DB_POOL_MAX),
    idle: parseInt(process.env.DB_POOL_IDLE),
    acquire: parseInt(process.env.DB_POOL_ACQUIRE)
  },
  logging: process.env.NODE_ENV === 'development'
});
```

## 部署指南

### 1. 环境准备
- 安装 Node.js, MySQL, Redis
- 配置环境变量
- 准备 SSL 证书（如需要）

### 2. 项目部署

#### 使用 PM2
```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start ecosystem.config.js

# 查看日志
pm2 logs

# 监控
pm2 monit
```

#### PM2 配置 (ecosystem.config.js)
```javascript
module.exports = {
  apps: [{
    name: 'school-admin',
    script: './dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
```

### 3. Nginx 配置

#### HTTPS 配置
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 常见问题

### 1. 数据库连接问题
- 检查数据库配置是否正确
- 确认数据库服务是否运行
- 检查防火墙设置

### 2. Redis 连接问题
- 验证 Redis 服务状态
- 检查密码配置
- 确认端口是否开放

### 3. 性能优化
- 启用 Redis 缓存
- 优化数据库查询
- 使用数据库索引
- 启用 Gzip 压缩

### 4. 日志管理
- 定期清理日志
- 设置日志轮转
- 监控磁盘空间

### 5. 安全建议
- 定期更新依赖
- 使用安全的密码策略
- 启用 HTTPS
- 实施 IP 白名单 