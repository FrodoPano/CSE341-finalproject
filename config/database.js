const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI, 
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    // Provide helpful error messages for common issues
    if (error.message.includes('bad auth')) {
      console.log('💡 Check your MongoDB Atlas username and password');
    } else if (error.message.includes('getaddrinfo')) {
      console.log('💡 Check your internet connection and MongoDB Atlas cluster status');
    } else if (error.message.includes('timed out')) {
      console.log('💡 Connection timeout - check firewall settings or try again');
    }
    
    // Don't exit in development
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;