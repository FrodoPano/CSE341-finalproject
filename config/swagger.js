const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Professional Portfolio API',
      version: '1.0.0',
      description: 'API for managing professional portfolio data and users',
    },
    servers: [
      {
        url: 'https://cse341-finalproject-kngm.onrender.com', // Your actual Render URL
        description: 'Production server'
      },
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server'
      }
    ]
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };