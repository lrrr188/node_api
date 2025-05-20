/**
 * @file 启动动画和信息显示
 * @description 服务器启动动画和信息显示
 * @author AI Assistant
 * @createDate 2024-03-21
 */

import 'dotenv/config';
import chalk from 'chalk';
import ora from 'ora';
import stripAnsi from 'strip-ansi';
import { Logger } from '../utils/logger/index.js';
import sequelize from '../config/database/index.js';

// 运行状态动画帧
const runningFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
let currentFrame = 0;
let runningInterval;
let lastContentHeight = 0;

/**
 * @constant {Object} styles - 终端显示样式配置
 * @description 使用 Nord 配色方案的终端样式定义
 */
const styles = {
  // Nord 配色方案
  title: chalk.hex('#88C0D0').bold,      // 北极蓝
  separator: chalk.hex('#4C566A'),        // 深灰蓝
  label: chalk.hex('#8FBCBB'),           // 青绿色
  value: chalk.hex('#A3BE8C'),           // 柔和绿
  success: chalk.hex('#A3BE8C'),         // 柔和绿
  warning: chalk.hex('#EBCB8B'),         // 温暖黄
  error: chalk.hex('#BF616A'),           // 柔和红
  info: chalk.hex('#81A1C1'),            // 天空蓝
  highlight: chalk.hex('#B48EAD'),       // 淡紫色
  dim: chalk.hex('#4C566A'),             // 深灰蓝
  box: {
    topLeft: '╭',
    topRight: '╮',
    bottomLeft: '╰',
    bottomRight: '╯',
    vertical: '│',
    horizontal: '─',
    top: '┬',
    bottom: '┴',
    left: '├',
    right: '┤',
    cross: '┼'
  }
};

/**
 * 计算字符串显示宽度（考虑中文字符）
 * @param {string} str - 要计算的字符串
 * @returns {number} 显示宽度
 */
const getStringWidth = (str) => {
  const stripped = stripAnsi(str);
  return [...stripped].reduce((width, char) => {
    return width + (char.match(/[\u4e00-\u9fa5]|[，。：；！？（）【】《》]|[\uff00-\uffff]/) ? 2 : 1);
  }, 0);
};

/**
 * 创建分隔线
 * @param {string} char - 分隔字符
 * @param {number} length - 长度
 * @returns {string} 分隔线
 */
const createSeparator = (char = '─', length = 50) => styles.separator(char.repeat(length));

/**
 * 创建完整边框的信息框
 * @param {string[]} content - 内容行数组
 * @param {number} [width=76] - 框的宽度
 * @returns {string[]} 格式化后的行数组
 */
const createFullBox = (content, width = 76) => {
  const lines = [];
  const boxWidth = width;
  
  // 添加顶部边框
  lines.push(
    styles.separator('╭' + '═'.repeat(boxWidth) + '╮')
  );
  
  // 添加内容
  content.forEach(line => {
    const lineWidth = getStringWidth(stripAnsi(line));
    const padding = boxWidth - lineWidth;
    lines.push(
      styles.separator('│') + line + ' '.repeat(padding) + styles.separator('│')
    );
  });
  
  // 添加底部边框
  lines.push(
    styles.separator('╰' + '═'.repeat(boxWidth) + '╯')
  );
  
  return lines;
};

/**
 * 获取运行状态动画帧
 * @returns {string} 当前动画帧
 */
const getRunningFrame = () => {
  const frame = runningFrames[currentFrame];
  currentFrame = (currentFrame + 1) % runningFrames.length;
  return frame;
};

/**
 * 创建带标题的内容块
 * @param {string} title - 标题
 * @param {string[]} content - 内容行数组
 * @param {number} width - 内容区域宽度
 * @returns {string[]} 格式化后的行数组
 */
const createTitledSection = (title, content, width) => {
  const lines = [];
  
  // 计算标题实际显示宽度（考虑中文字符）
  const titleDisplayWidth = getStringWidth(title);
  const paddedTitle = ` ${title} `; // 在标题两侧添加空格
  const paddedTitleWidth = titleDisplayWidth + 2; // 加上两侧空格的宽度
  
  // 添加标题分隔线
  lines.push(
    styles.separator('├' + '─'.repeat(width) + '┤'),
    styles.separator('│') + styles.title(paddedTitle) + ' '.repeat(Math.max(0, width - paddedTitleWidth)) + styles.separator('│'),
    styles.separator('├' + '─'.repeat(width) + '┤')
  );
  
  // 添加内容
  content.forEach(line => {
    const lineWidth = getStringWidth(stripAnsi(line));
    const padding = Math.max(0, width - lineWidth);
    lines.push(
      styles.separator('│') + line + ' '.repeat(padding) + styles.separator('│')
    );
  });
  
  return lines;
};

/**
 * 显示启动信息
 * @param {Object} info - 服务器信息
 * @param {number} info.port - 服务器端口
 * @param {string} info.host - 服务器主机
 * @param {string} info.env - 运行环境
 */
export const showStartupInfo = async ({ port, host, env }) => {
  // 获取数据库状态
  const dbStatus = await sequelize.authenticate()
    .then(async () => {
      // 获取所有模型
      const models = sequelize.models;
      const modelNames = Object.keys(models);
      
      // 获取每个表的记录数
      const tableStats = await Promise.all(
        modelNames.map(async (modelName) => {
          try {
            const count = await models[modelName].count();
            return `${modelName} (${count}条记录)`;
          } catch (err) {
            return `${modelName} (统计失败)`;
          }
        })
      );

      return {
        status: '已连接',
        host: sequelize.config.host,
        database: sequelize.config.database,
        tables: tableStats,
        modelNames
      };
    })
    .catch(err => ({
      status: '连接错误',
      error: err.message
    }));

  // 准备所有信息
  const getInfo = () => [
    // 服务器状态
    styles.label('数据库连接  │ ') + styles.success(dbStatus.status),
    styles.label('服务器状态  │ ') + styles.success(runningFrames[currentFrame]) + ' ' + styles.success('运行中'),
    '',
    // 服务器信息
    styles.title('服务器信息'),
    styles.separator('─'.repeat(76)),
    '',
    styles.label('运行模式  │ ') + styles.success(env),
    styles.label('进程 ID   │ ') + styles.success(process.pid),
    styles.label('监听地址  │ ') + styles.success(`${host}:${port}`),
    styles.label('启动时间  │ ') + styles.success(new Date().toLocaleString()),
    styles.label('Node版本  │ ') + styles.success(process.version),
    styles.label('系统平台  │ ') + styles.success(process.platform),
    '',
    // 数据库信息
    styles.title('数据库信息'),
    styles.separator('─'.repeat(76)),
    '',
    styles.label('连接状态  │ ') + styles.success(dbStatus.status),
    styles.label('主机地址  │ ') + styles.success(dbStatus.host || '未知'),
    styles.label('数据库名  │ ') + styles.success(dbStatus.database || '未知'),
    ...(dbStatus.error ? [
      styles.label('错误信息  │ ') + styles.error(dbStatus.error)
    ] : [
      '',
      styles.label('数据表信息:'),
      '',
      ...(dbStatus.tables || []).map(table => 
        styles.success(`  • ${table}`)
      )
    ]),
    '',
    // API信息
    styles.title('API信息'),
    styles.separator('─'.repeat(76)),
    '',
    styles.label('接口文档      │ ') + styles.success(`http://${host}:${port}/api-docs`),
    styles.label('Swagger JSON  │ ') + styles.success(`http://${host}:${port}/api-docs.json`),
    '',
    // 开发模式配置
    ...(env === 'development' ? [
      styles.title('开发模式配置'),
      styles.separator('─'.repeat(76)),
      '',
      process.env.DB_SYNC_ALTER === 'true' 
        ? styles.success('✓ 已启用数据库自动同步 (alter)')
        : process.env.DB_SYNC_FORCE === 'true'
          ? styles.warning('⚠ 已启用数据库强制同步 (force)')
          : styles.error('✗ 未启用数据库同步'),
      process.env.ENABLE_API_DOCS === 'true'
        ? styles.success('✓ 已启用API文档')
        : styles.error('✗ 未启用API文档'),
      process.env.ENABLE_REQUEST_LOG === 'true'
        ? styles.success('✓ 已启用请求日志')
        : styles.error('✗ 未启用请求日志'),
      '',
      styles.label('数据库表列表:'),
      '',
      ...(dbStatus.modelNames || []).map(tableName => 
        styles.success(`  • ${tableName}`)
      ),
      '',
      styles.dim('提示: 使用 DB_SYNC_ALTER=true 来自动同步表结构')
    ] : [])
  ];

  // 停止现有的动画
  if (runningInterval) {
    clearInterval(runningInterval);
    runningInterval = null;
  }

  // 显示初始信息
  console.clear();
  const content = createFullBox([
    styles.title('服务器状态'),
    styles.separator('─'.repeat(76)),
    '',
    ...getInfo()
  ], 76);
  console.log(content.join('\n') + '\n');
  lastContentHeight = content.length + 1;

  // 启动运行状态动画
  runningInterval = setInterval(() => {
    currentFrame = (currentFrame + 1) % runningFrames.length;
    
    // 移动光标到内容开始处
    process.stdout.write('\x1B[' + (lastContentHeight + 1) + 'A');
    
    // 重新显示更新后的信息
    const newContent = createFullBox([
      styles.title('服务器状态'),
      styles.separator('─'.repeat(76)),
      '',
      ...getInfo()
    ], 76);
    console.log(newContent.join('\n') + '\n');
    
    // 更新内容高度
    lastContentHeight = newContent.length + 1;
  }, 80);

  // 处理窗口大小改变
  process.stdout.on('resize', () => {
    if (runningInterval) {
      console.clear();
      const content = createFullBox([
        styles.title('服务器状态'),
        styles.separator('─'.repeat(76)),
        '',
        ...getInfo()
      ], 76);
      console.log(content.join('\n') + '\n');
      lastContentHeight = content.length + 1;
    }
  });
};

/**
 * 显示启动动画
 * @returns {Promise<void>}
 */
export const showStartupAnimation = async () => {
  // 创建加载动画
  const loadingSpinner = ora({
    text: '正在启动服务器...',
    spinner: {
      frames: [
        '▰▱▱▱▱▱▱',
        '▰▰▱▱▱▱▱',
        '▰▰▰▱▱▱▱',
        '▰▰▰▰▱▱▱',
        '▰▰▰▰▰▱▱',
        '▰▰▰▰▰▰▱',
        '▰▰▰▰▰▰▰',
        '▰▰▰▰▰▰▰',
        '▱▰▰▰▰▰▰',
        '▱▱▰▰▰▰▰',
        '▱▱▱▰▰▰▰',
        '▱▱▱▱▰▰▰',
        '▱▱▱▱▱▰▰',
        '▱▱▱▱▱▱▰',
      ]
    },
    color: 'cyan',
    prefixText: '',
    suffixText: ''
  }).start();

  // 运行动画 2 秒
  await new Promise(resolve => setTimeout(resolve, 2000));
  loadingSpinner.stop();
};

/**
 * 显示错误信息
 * @param {string} title - 错误标题
 * @param {Error} error - 错误对象
 */
export const showError = (title, error) => {
  console.log('\n' + createSeparator('═', 60));
  console.log(styles.error(`\n✖ ${title}\n`));
  console.log(styles.error('错误详情:'));
  console.error(error);
  console.log('\n' + createSeparator('═', 60) + '\n');
  
  Logger.error(title, error);
};

// 清理函数
const cleanup = () => {
  if (runningInterval) {
    clearInterval(runningInterval);
    runningInterval = null;
  }
};

/**
 * 显示关闭信息
 */
export const showShutdownInfo = () => {
  cleanup();
  console.log('\n' + createSeparator('═', 60));
  console.log(styles.warning('\n正在关闭服务器...\n'));
};

/**
 * 显示关闭成功信息
 */
export const showShutdownSuccess = () => {
  cleanup();
  console.log(styles.success('• HTTP服务器已关闭'));
  console.log(styles.success('• 数据库连接已关闭'));
  console.log(styles.success('\n✨ 服务器已成功关闭 ✨\n'));
  console.log(createSeparator('═', 60) + '\n');
};

/**
 * 显示关闭错误信息
 * @param {Error} error - 错误对象
 */
export const showShutdownError = (error) => {
  cleanup();
  console.log(styles.error('服务器关闭时发生错误:'));
  console.error(error);
  console.log('\n' + createSeparator('═', 60) + '\n');
};

// 确保在进程退出时停止动画
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('uncaughtException', cleanup);
process.on('unhandledRejection', cleanup);
