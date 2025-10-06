const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management API
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of all projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllProjects);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 *       400:
 *         description: Invalid ID
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getProjectById);

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project (Protected)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *           example:
 *             title: "E-Commerce Website"
 *             description: "Full-stack e-commerce platform with React and Node.js"
 *             technologies: ["React", "Node.js", "MongoDB", "Express"]
 *             projectUrl: "https://myecommerce.com"
 *             githubUrl: "https://github.com/user/ecommerce"
 *             featured: true
 *             completionDate: "2024-01-15"
 *             professionalId: "507f1f77bcf86cd799439011"
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', auth, createProject);

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update project by ID (Protected)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', auth, updateProject);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete project by ID (Protected)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', auth, deleteProject);

module.exports = router;