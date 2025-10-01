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
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *         password:
 *           type: string
 *           minLength: 6
 *           description: User password (will be hashed)
 *           writeOnly: true
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           default: user
 *           description: User role
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 507f1f77bcf86cd799439012
 *         email: user@example.com
 *         role: user
 *         createdAt: 2023-10-01T00:00:00.000Z
 *         updatedAt: 2023-10-01T00:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
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
 *         description: Invalid ID
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getUserById);

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or duplicate email
 *       500:
 *         description: Internal server error
 */
router.post('/', createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.put('/:id', updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid ID
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteUser);

module.exports = router;