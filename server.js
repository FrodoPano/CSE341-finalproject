require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { swaggerUi, specs } = require('./config/swagger');
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');

// Route imports
const professionalRoutes = require('./routes/professionalRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ Mongoose connection error:', err);
});

// Security middleware
app.use(helmet());

// CORS configuration - Allow all origins for Swagger testing
app.use(cors({
  origin: [
    'https://cse341-finalproject-kngm.onrender.com', // Your actual Render URL
    'http://localhost:3000',
    'http://localhost:8080'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin']
}));

// Handle preflight requests
app.options('*', cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Swagger Documentation with CORS headers
app.use('/api-docs', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  next();
}, swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }'
}));

// Routes
app.use('/professional', professionalRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.use('/projects', projectRoutes);
app.use('/skills', skillRoutes);

// Status route
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
    databaseState: dbStatus
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

// Error handling
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
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
});