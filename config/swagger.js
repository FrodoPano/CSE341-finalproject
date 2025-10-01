const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Professional Portfolio API',
      version: '1.0.0',
      description: 'API for managing professional portfolio data',
      contact: {
        name: 'API Support',
        email: 'frodopano@example.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://cse341-finalproject.onrender.com' 
          : `http://localhost:${process.env.PORT || 3000}`,
        description: `${process.env.NODE_ENV || 'development'} server`
      },
    ],
    tags: [
      {
        name: 'Professional',
        description: 'Professional portfolio management'
      },
      {
        name: 'Users',
        description: 'User management'
      }
    ],
    components: {
      schemas: {
        Professional: {
          type: 'object',
          required: ['professionalName', 'base64Image', 'primaryDescription'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated professional ID'
            },
            professionalName: {
              type: 'string',
              example: 'Jane Doe',
              description: 'Full professional name'
            },
            base64Image: {
              type: 'string',
              example: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
              description: 'Base64 encoded profile image'
            },
            nameLink: {
              type: 'object',
              properties: {
                firstName: { 
                  type: 'string',
                  example: 'Jane'
                },
                url: { 
                  type: 'string',
                  example: 'https://example.com'
                }
              }
            },
            primaryDescription: {
              type: 'string',
              example: 'Full Stack Developer & UI/UX Designer',
              description: 'Primary professional description'
            },
            workDescription1: {
              type: 'string',
              example: 'Experienced developer with a passion for creating intuitive user experiences.',
              description: 'First work description paragraph'
            },
            workDescription2: {
              type: 'string',
              example: 'Previously worked at Tech Innovations Inc.',
              description: 'Second work description paragraph'
            },
            linkTitleText: {
              type: 'string',
              example: 'Connect with me:',
              description: 'Title for links section'
            },
            linkedInLink: {
              type: 'object',
              properties: {
                text: { 
                  type: 'string',
                  example: 'LinkedIn Profile'
                },
                link: { 
                  type: 'string',
                  example: 'https://linkedin.com/in/janedoe'
                }
              }
            },
            githubLink: {
              type: 'object',
              properties: {
                text: { 
                  type: 'string',
                  example: 'GitHub Profile'
                },
                link: { 
                  type: 'string',
                  example: 'https://github.com/janedoe'
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        User: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated user ID'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123',
              writeOnly: true
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user',
              example: 'user'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { 
              type: 'string',
              example: 'Validation Error'
            },
            message: { 
              type: 'string',
              example: 'Professional name is required'
            },
            messages: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            stack: { 
              type: 'string',
              example: 'Error: Validation failed...'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };