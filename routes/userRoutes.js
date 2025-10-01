const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

// GET /users - Get all users
router.get('/', getAllUsers);

// GET /users/:id - Get specific user
router.get('/:id', getUserById);

// POST /users - Create user
router.post('/', createUser);

// PUT /users/:id - Update user
router.put('/:id', updateUser);

// DELETE /users/:id - Delete user
router.delete('/:id', deleteUser);

module.exports = router;