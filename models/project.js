const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long']
  },
  technologies: [{
    type: String,
    trim: true
  }],
  projectUrl: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+\..+/, 'Please enter a valid URL']
  },
  githubUrl: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+\..+/, 'Please enter a valid URL']
  },
  featured: {
    type: Boolean,
    default: false
  },
  completionDate: {
    type: Date,
    required: [true, 'Completion date is required']
  },
  professionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professional',
    required: [true, 'Professional ID is required']
  }
}, {
  timestamps: true
});

// Index for better query performance
projectSchema.index({ professionalId: 1, featured: -1 });

module.exports = mongoose.model('Project', projectSchema);