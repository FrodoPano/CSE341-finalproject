const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Professional Portfolio API',
      version: '1.0.0',
      description: 'API for managing professional portfolio data',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://cse341-finalproject.onrender.com' 
          : `http://localhost:${process.env.PORT || 3000}`,
        description: `${process.env.NODE_ENV || 'development'} server`
      },
    ],
    components: {
      schemas: {
        Professional: {
          type: 'object',
          required: ['professionalName', 'base64Image', 'primaryDescription'],
          properties: {
            professionalName: {
              type: 'string',
              description: 'Full professional name'
            },
            base64Image: {
              type: 'string',
              description: 'Base64 encoded profile image'
            },
            nameLink: {
              type: 'object',
              properties: {
                firstName: { type: 'string' },
                url: { type: 'string' }
              }
            },
            primaryDescription: {
              type: 'string',
              description: 'Primary professional description'
            },
            workDescription1: {
              type: 'string',
              description: 'First work description paragraph'
            },
            workDescription2: {
              type: 'string',
              description: 'Second work description paragraph'
            },
            linkTitleText: {
              type: 'string',
              description: 'Title for links section'
            },
            linkedInLink: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                link: { type: 'string' }
              }
            },
            githubLink: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                link: { type: 'string' }
              }
            }
          }
        },
        User: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email'
            },
            password: {
              type: 'string',
              minLength: 6
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            stack: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };