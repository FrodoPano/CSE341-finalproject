const Professional = require('../models/professional');

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

// Get professional data
const getProfessional = async (req, res) => {
  try {
    // Try to get data from database
    let professional = await Professional.findOne();
    
    if (!professional) {
      // If no data exists, create with sample data
      professional = new Professional(sampleData);
      await professional.save();
      console.log('Sample professional data created');
    }
    
    res.json(professional);
  } catch (error) {
    console.error('Error fetching professional data:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

// Get professional by ID
const getProfessionalById = async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id);
    
    if (!professional) {
      return res.status(404).json({ error: 'Professional not found' });
    }
    
    res.json(professional);
  } catch (error) {
    console.error('Error fetching professional by ID:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

module.exports = {
  getProfessional,
  getProfessionalById
};