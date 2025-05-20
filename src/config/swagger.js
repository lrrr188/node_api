/**
 * @file Swagger 配置
 * @description Swagger API 文档配置
 * @author AI Assistant
 * @createDate 2024-03-21
 */

// API 版本
const API_VERSION = process.env.API_VERSION || 'v1';

// Swagger 配置
const config = {
  development: {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'School Admin API',
        version: API_VERSION,
        description: '学校管理系统 API 文档',
        contact: {
          name: 'API Support',
          email: 'support@example.com'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      servers: [
        {
          url: `http://localhost:3000/api/${API_VERSION}`,
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
    apis: ['./src/api/v1/**/*.js']  // API 路由文件路径
  },
  
  test: {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'School Admin API',
        version: API_VERSION,
        description: '学校管理系统 API 文档 - 测试环境',
        contact: {
          name: 'API Support',
          email: 'support@example.com'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      servers: [
        {
          url: `http://test-api.example.com/api/${API_VERSION}`,
          description: '测试服务器'
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
    apis: ['./src/api/v1/**/*.js']
  },
  
  production: {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'School Admin API',
        version: API_VERSION,
        description: '学校管理系统 API 文档 - 生产环境',
        contact: {
          name: 'API Support',
          email: 'support@example.com'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      servers: [
        {
          url: process.env.API_URL || `https://api.example.com/api/${API_VERSION}`,
          description: '生产服务器'
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
    apis: ['./src/api/v1/**/*.js']
  }
};

// 获取当前环境
const env = process.env.NODE_ENV || 'development';
const swaggerConfig = config[env];

export { swaggerConfig, API_VERSION };
export default swaggerConfig; 