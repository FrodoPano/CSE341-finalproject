const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '7d'
  });
};

// User registration
const registerUser = async (req, res) => {
  try {
    const { email, password, role = 'user' } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: 'Duplicate email',
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = new User({ email, password, role });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Don't send password back
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        error: 'Validation Error',
        messages
      });
    }
    
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email and password are required'
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Don't send password back
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};











/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 6
 *         role:
 *           type: string
 *           enum: [user, admin]
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid ID format
 *       500:
 *         description: Internal server error
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'User not found' 
      });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Invalid ID',
        message: 'The provided ID is invalid' 
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error or duplicate email
 *       500:
 *         description: Internal server error
 */
const createUser = async (req, res) => {
  try {
    const { email, password, role = 'user' } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Duplicate email',
        message: 'User with this email already exists' 
      });
    }
    
    const user = new User({ email, password, role });
    await user.save();
    
    // Don't send password back
    const userResponse = { ...user.toObject() };
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ 
        error: 'Validation Error',
        messages 
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Validation error or invalid ID
 *       500:
 *         description: Internal server error
 */
const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'User not found' 
      });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Invalid ID',
        message: 'The provided ID is invalid' 
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ 
        error: 'Validation Error',
        messages 
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid ID format
 *       500:
 *         description: Internal server error
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'User not found' 
      });
    }
    
    res.status(200).json({ 
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Invalid ID',
        message: 'The provided ID is invalid' 
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};