const Skill = require('../models/skill');
const Professional = require('../models/professional');

/**
 * @swagger
 * components:
 *   schemas:
 *     Skill:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - proficiency
 *         - yearsOfExperience
 *         - professionalId
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         category:
 *           type: string
 *         proficiency:
 *           type: number
 *         yearsOfExperience:
 *           type: number
 *         professionalId:
 *           type: string
 */

// GET all skills
const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().populate('professionalId', 'professionalName');
    res.status(200).json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

// GET skill by ID
const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate('professionalId', 'professionalName');
    
    if (!skill) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Skill not found'
      });
    }
    
    res.status(200).json(skill);
  } catch (error) {
    console.error('Error fetching skill:', error);
    
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

// POST create skill (Protected)
const createSkill = async (req, res) => {
  try {
    // Check if professional exists
    const professional = await Professional.findById(req.body.professionalId);
    if (!professional) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Professional ID does not exist'
      });
    }

    const skill = new Skill(req.body);
    const savedSkill = await skill.save();
    
    // Populate professional data in response
    await savedSkill.populate('professionalId', 'professionalName');
    
    res.status(201).json(savedSkill);
  } catch (error) {
    console.error('Error creating skill:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        error: 'Validation Error',
        messages
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Duplicate skill',
        message: 'A skill with this name already exists'
      });
    }
    
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

// PUT update skill (Protected)
const updateSkill = async (req, res) => {
  try {
    if (req.body.professionalId) {
      const professional = await Professional.findById(req.body.professionalId);
      if (!professional) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Professional ID does not exist'
        });
      }
    }

    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('professionalId', 'professionalName');
    
    if (!skill) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Skill not found'
      });
    }
    
    res.status(200).json(skill);
  } catch (error) {
    console.error('Error updating skill:', error);
    
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

// DELETE skill (Protected)
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    
    if (!skill) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Skill not found'
      });
    }
    
    res.status(200).json({
      message: 'Skill deleted successfully',
      deletedSkill: skill
    });
  } catch (error) {
    console.error('Error deleting skill:', error);
    
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
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill
};