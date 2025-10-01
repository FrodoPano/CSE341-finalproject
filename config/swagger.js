const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Professional Portfolio API',
      version: '1.0.0',
      description: 'API for managing professional portfolio data and users',
      contact: {
        name: 'API Support',
        url: 'https://cse341-finalproject.onrender.com'
      }
    },
    servers: [
      {
        url: 'https://cse341-finalproject.onrender.com',
        description: 'Production server'
      },
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server'
      }
    ]
  },
  apis: ['./routes/*.js'], // path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };