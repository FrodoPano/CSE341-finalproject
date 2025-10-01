require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { swaggerUi, specs } = require('./config/swagger');

// Route imports
const professionalRoutes = require('./routes/professionalRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Add connection event listeners
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ Mongoose connection error:', err);
});

// Middleware
app.use(helmet());

// CORS configuration - MOVED AFTER app initialization
app.use(cors({
  origin: [
    'https://cse341-finalproject.onrender.com',
    'http://localhost:3000',
    'http://localhost:8080'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Handle preflight requests - MOVED AFTER CORS middleware
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory (your frontend)
app.use(express.static('public'));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }'
}));

// Routes
app.use('/professional', professionalRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Database status route
app.get('/status', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMessages = {
    0: 'Disconnected',
    1: 'Connected', 
    2: 'Connecting',
    3: 'Disconnecting'
  };
  
  res.json({
    server: 'Running',
    environment: process.env.NODE_ENV || 'development',
    database: statusMessages[dbStatus] || 'Unknown',
    databaseState: dbStatus,
    swaggerDocs: '/api-docs'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Professional Portfolio API is running!',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      professional: '/professional',
      users: '/users',
      auth: '/auth',
      apiDocs: '/api-docs',
      status: '/status'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📚 Swagger Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`👤 Professional data: http://localhost:${PORT}/professional`);
  console.log(`👥 Users: http://localhost:${PORT}/users`);
  console.log(`📊 Status: http://localhost:${PORT}/status`);
});