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
 * tags:
 *   name: Professional
 *   description: Professional portfolio management
 */

// GET /professional - Get all professional profiles
router.get('/', getAllProfessionals);

// GET /professional/:id - Get specific professional data
router.get('/:id', getProfessionalById);

// POST /professional - Create professional profile
router.post('/', createProfessional);

// PUT /professional/:id - Update professional profile
router.put('/:id', updateProfessional);

// DELETE /professional/:id - Delete professional profile
router.delete('/:id', deleteProfessional);

module.exports = router;