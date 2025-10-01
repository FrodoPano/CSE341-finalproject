const express = require('express');
const router = express.Router();
const {
  getAllProfessionals,
  getProfessionalById,
  createProfessional,
  updateProfessional,
  deleteProfessional
} = require('../controllers/professionalController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Professional:
 *       type: object
 *       required:
 *         - professionalName
 *         - base64Image
 *         - primaryDescription
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID
 *         professionalName:
 *           type: string
 *           description: Full professional name
 *         base64Image:
 *           type: string
 *           description: Base64 encoded profile image
 *         nameLink:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             url:
 *               type: string
 *         primaryDescription:
 *           type: string
 *           description: Primary professional description
 *         workDescription1:
 *           type: string
 *           description: First work description
 *         workDescription2:
 *           type: string
 *           description: Second work description
 *         linkTitleText:
 *           type: string
 *           description: Title for links section
 *         linkedInLink:
 *           type: object
 *           properties:
 *             text:
 *               type: string
 *             link:
 *               type: string
 *         githubLink:
 *           type: object
 *           properties:
 *             text:
 *               type: string
 *             link:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 507f1f77bcf86cd799439011
 *         professionalName: Jane Doe
 *         base64Image: iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==
 *         nameLink:
 *           firstName: Jane
 *           url: https://example.com
 *         primaryDescription: Full Stack Developer
 *         workDescription1: Experienced developer with 5+ years in web development.
 *         workDescription2: Specialized in React, Node.js, and MongoDB.
 *         linkTitleText: Connect with me
 *         linkedInLink:
 *           text: LinkedIn
 *           link: https://linkedin.com/in/janedoe
 *         githubLink:
 *           text: GitHub
 *           link: https://github.com/janedoe
 */

/**
 * @swagger
 * tags:
 *   name: Professionals
 *   description: The professionals managing API
 */

/**
 * @swagger
 * /professional:
 *   get:
 *     summary: Returns the list of all professionals
 *     tags: [Professionals]
 *     responses:
 *       200:
 *         description: The list of professionals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professional'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllProfessionals);

/**
 * @swagger
 * /professional/{id}:
 *   get:
 *     summary: Get professional by ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Professional ID
 *     responses:
 *       200:
 *         description: Professional found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Professional not found
 *       400:
 *         description: Invalid ID
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getProfessionalById);

/**
 * @swagger
 * /professional:
 *   post:
 *     summary: Create a new professional
 *     tags: [Professionals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professional'
 *     responses:
 *       201:
 *         description: Professional created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/', createProfessional);

/**
 * @swagger
 * /professional/{id}:
 *   put:
 *     summary: Update professional by ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Professional ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professional'
 *     responses:
 *       200:
 *         description: Professional updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Professional not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.put('/:id', updateProfessional);

/**
 * @swagger
 * /professional/{id}:
 *   delete:
 *     summary: Delete professional by ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Professional ID
 *     responses:
 *       200:
 *         description: Professional deleted successfully
 *       404:
 *         description: Professional not found
 *       400:
 *         description: Invalid ID
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteProfessional);

module.exports = router;