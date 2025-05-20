import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
const envPath = path.join(__dirname, envFile);

console.log('正在加载环境变量文件:', envPath);

const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('环境变量加载失败:', result.error);
  process.exit(1);
}

console.log('环境变量加载成功！');
console.log('数据库配置:', {
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT
});

console.log('Redis配置:', {
  REDIS_URL: process.env.REDIS_URL,
  REDIS_DB: process.env.REDIS_DB
}); 