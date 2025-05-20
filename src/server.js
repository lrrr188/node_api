/**
 * @file 服务器入口
 * @description 启动 HTTP 服务器
 * @author AI Assistant
 * @createDate 2024-03-21
 */

import app from './app.js';
import sequelize from './config/database/index.js';
import { showStartupAnimation, showStartupInfo, showError, showShutdownInfo, showShutdownSuccess, showShutdownError } from './startup/banner.js';
import { Logger } from './utils/logger/index.js';

// 设置最大事件监听器数量
process.setMaxListeners(15);

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

// 创建 HTTP 服务器
const server = app.listen(port, host, async () => {
  try {
    // 清屏
    console.clear();
    
    // 显示启动动画
    await showStartupAnimation();
    
    // 显示服务器信息
    await showStartupInfo({
      port,
      host,
      env: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    showError('启动信息显示失败', error);
  }
});

// 优雅关闭标志
let isShuttingDown = false;

// 优雅关闭
const gracefulShutdown = async () => {
  if (isShuttingDown) {
    return;
  }
  
  isShuttingDown = true;
  showShutdownInfo();
  
  try {
    // 关闭 HTTP 服务器
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });

    // 关闭数据库连接
    await sequelize.close();
    Logger.info('数据库连接已关闭');
    
    showShutdownSuccess();
    process.exit(0);
  } catch (error) {
    showShutdownError(error);
    process.exit(1);
  }
};

// 监听进程信号
const signals = ['SIGTERM', 'SIGINT'];
signals.forEach(signal => {
  process.once(signal, gracefulShutdown);
});

// 未捕获的异常
process.once('uncaughtException', (error) => {
  showError('未捕获的异常', error);
  gracefulShutdown();
});

// 未处理的 Promise 拒绝
process.once('unhandledRejection', (reason, promise) => {
  showError('未处理的 Promise 拒绝', { reason, promise });
  gracefulShutdown();
}); 