const Project = require('../models/project');
const Professional = require('../models/professional');

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - completionDate
 *         - professionalId
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         technologies:
 *           type: array
 *           items:
 *             type: string
 *         projectUrl:
 *           type: string
 *         githubUrl:
 *           type: string
 *         featured:
 *           type: boolean
 *         completionDate:
 *           type: string
 *           format: date
 *         professionalId:
 *           type: string
 */

// GET all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('professionalId', 'professionalName');
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

// GET project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('professionalId', 'professionalName');
    
    if (!project) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Project not found'
      });
    }
    
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    
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

// POST create project (Protected)
const createProject = async (req, res) => {
  try {
    // Check if professional exists
    const professional = await Professional.findById(req.body.professionalId);
    if (!professional) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Professional ID does not exist'
      });
    }

    const project = new Project(req.body);
    const savedProject = await project.save();
    
    // Populate professional data in response
    await savedProject.populate('professionalId', 'professionalName');
    
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    
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

// PUT update project (Protected)
const updateProject = async (req, res) => {
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

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('professionalId', 'professionalName');
    
    if (!project) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Project not found'
      });
    }
    
    res.status(200).json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    
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

// DELETE project (Protected)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Project not found'
      });
    }
    
    res.status(200).json({
      message: 'Project deleted successfully',
      deletedProject: project
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    
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
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};