const express = require('express');
const router = express.Router();
const { getProfessional, getProfessionalById } = require('../controllers/professionalController');

// GET /professional - Get professional data
router.get('/', getProfessional);

// GET /professional/:id - Get specific professional data
router.get('/:id', getProfessionalById);

module.exports = router;