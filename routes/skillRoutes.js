const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill
} = require('../controllers/skillController');

/**
 * @swagger
 * tags:
 *   name: Skills
 *   description: Skill management API
 */

/**
 * @swagger
 * /skills:
 *   get:
 *     summary: Get all skills
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: List of all skills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Skill'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllSkills);

/**
 * @swagger
 * /skills/{id}:
 *   get:
 *     summary: Get skill by ID
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Skill ID
 *     responses:
 *       200:
 *         description: Skill found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Skill'
 *       404:
 *         description: Skill not found
 *       400:
 *         description: Invalid ID
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getSkillById);

/**
 * @swagger
 * /skills:
 *   post:
 *     summary: Create a new skill (Protected)
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Skill'
 *           example:
 *             name: "React"
 *             category: "frontend"
 *             proficiency: 8
 *             yearsOfExperience: 3
 *             professionalId: "507f1f77bcf86cd799439011"
 *     responses:
 *       201:
 *         description: Skill created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Skill'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', auth, createSkill);

/**
 * @swagger
 * /skills/{id}:
 *   put:
 *     summary: Update skill by ID (Protected)
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Skill ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Skill'
 *     responses:
 *       200:
 *         description: Skill updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Skill'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Skill not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', auth, updateSkill);

/**
 * @swagger
 * /skills/{id}:
 *   delete:
 *     summary: Delete skill by ID (Protected)
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Skill ID
 *     responses:
 *       200:
 *         description: Skill deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Skill not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', auth, deleteSkill);

module.exports = router;