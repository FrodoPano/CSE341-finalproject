const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    unique: true,
    minlength: [2, 'Skill name must be at least 2 characters long'],
    maxlength: [50, 'Skill name cannot exceed 50 characters']
  },
  category: {
    type: String,
    required: [true, 'Skill category is required'],
    enum: {
      values: ['frontend', 'backend', 'database', 'devops', 'tools', 'soft-skills'],
      message: 'Category must be one of: frontend, backend, database, devops, tools, soft-skills'
    }
  },
  proficiency: {
    type: Number,
    required: [true, 'Proficiency level is required'],
    min: [1, 'Proficiency must be at least 1'],
    max: [10, 'Proficiency cannot exceed 10']
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Years of experience cannot be negative']
  },
  professionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professional',
    required: [true, 'Professional ID is required']
  }
}, {
  timestamps: true
});

// Compound index
skillSchema.index({ professionalId: 1, category: 1 });

module.exports = mongoose.model('Skill', skillSchema);