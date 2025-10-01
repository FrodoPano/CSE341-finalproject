const Professional = require('../models/professional');

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
 *         professionalName:
 *           type: string
 *         base64Image:
 *           type: string
 *         nameLink:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             url:
 *               type: string
 *         primaryDescription:
 *           type: string
 *         workDescription1:
 *           type: string
 *         workDescription2:
 *           type: string
 *         linkTitleText:
 *           type: string
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
 */

// Sample data for initial setup
const sampleData = {
  professionalName: "Jane Doe",
  base64Image: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  nameLink: {
    firstName: "Jane Doe",
    url: "https://example.com"
  },
  primaryDescription: "Full Stack Developer & UI/UX Designer",
  workDescription1: "Experienced developer with a passion for creating intuitive user experiences. Specialized in React, Node.js, and modern web technologies.",
  workDescription2: "Previously worked at Tech Innovations Inc. where I led the development of several award-winning applications. Focused on writing clean, maintainable code.",
  linkTitleText: "Connect with me:",
  linkedInLink: {
    text: "LinkedIn Profile",
    link: "https://linkedin.com/in/janedoe"
  },
  githubLink: {
    text: "GitHub Profile",
    link: "https://github.com/janedoe"
  }
};

/**
 * @swagger
 * /professional:
 *   get:
 *     summary: Get all professional profiles
 *     tags: [Professional]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professional'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const getAllProfessionals = async (req, res) => {
  try {
    const professionals = await Professional.find();
    
    if (professionals.length === 0) {
      // Create sample data if no professionals exist
      const sampleProfessional = new Professional(sampleData);
      await sampleProfessional.save();
      return res.status(201).json([sampleProfessional]);
    }
    
    res.status(200).json(professionals);
  } catch (error) {
    console.error('Error fetching professionals:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

/**
 * @swagger
 * /professional/{id}:
 *   get:
 *     summary: Get professional by ID
 *     tags: [Professional]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Invalid ID format
 *       500:
 *         description: Internal server error
 */
const getProfessionalById = async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id);
    
    if (!professional) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'Professional not found' 
      });
    }
    
    res.status(200).json(professional);
  } catch (error) {
    console.error('Error fetching professional by ID:', error);
    
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
 * /professional:
 *   post:
 *     summary: Create a new professional profile
 *     tags: [Professional]
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
const createProfessional = async (req, res) => {
  try {
    const professional = new Professional(req.body);
    const savedProfessional = await professional.save();
    
    res.status(201).json(savedProfessional);
  } catch (error) {
    console.error('Error creating professional:', error);
    
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
 * /professional/{id}:
 *   put:
 *     summary: Update professional profile
 *     tags: [Professional]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Validation error or invalid ID
 *       500:
 *         description: Internal server error
 */
const updateProfessional = async (req, res) => {
  try {
    const professional = await Professional.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!professional) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'Professional not found' 
      });
    }
    
    res.status(200).json(professional);
  } catch (error) {
    console.error('Error updating professional:', error);
    
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
 * /professional/{id}:
 *   delete:
 *     summary: Delete professional profile
 *     tags: [Professional]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Professional ID
 *     responses:
 *       200:
 *         description: Professional deleted successfully
 *       404:
 *         description: Professional not found
 *       400:
 *         description: Invalid ID format
 *       500:
 *         description: Internal server error
 */
const deleteProfessional = async (req, res) => {
  try {
    const professional = await Professional.findByIdAndDelete(req.params.id);
    
    if (!professional) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'Professional not found' 
      });
    }
    
    res.status(200).json({ 
      message: 'Professional deleted successfully',
      deletedProfessional: professional 
    });
  } catch (error) {
    console.error('Error deleting professional:', error);
    
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
  getAllProfessionals,
  getProfessionalById,
  createProfessional,
  updateProfessional,
  deleteProfessional
};