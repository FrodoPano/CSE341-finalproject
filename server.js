require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const professionalRoutes = require('./routes/professionalRoutes');
const authRoutes = require('./routes/authRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory (your frontend)
app.use(express.static('public'));

// Routes
app.use('/professional', professionalRoutes);
app.use('/auth', authRoutes);

// API documentation route (placeholder for Swagger)
app.get('/api-docs', (req, res) => {
  res.json({
    message: 'API Documentation - Swagger UI will be implemented here',
    endpoints: {
      professional: {
        'GET /professional': 'Get professional data',
        'GET /professional/:id': 'Get specific professional data'
      },
      auth: {
        'POST /auth/register': 'Register new user',
        'POST /auth/login': 'User login'
      }
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Professional Portfolio API is running!',
    endpoints: {
      professional: '/professional',
      apiDocs: '/api-docs'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`Professional data available at http://localhost:${PORT}/professional`);
});