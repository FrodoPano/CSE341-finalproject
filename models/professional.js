const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
  professionalName: {
    type: String,
    required: true,
    trim: true
  },
  base64Image: {
    type: String,
    required: true
  },
  nameLink: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    }
  },
  primaryDescription: {
    type: String,
    required: true,
    trim: true
  },
  workDescription1: {
    type: String,
    required: true,
    trim: true
  },
  workDescription2: {
    type: String,
    required: true,
    trim: true
  },
  linkTitleText: {
    type: String,
    required: true,
    trim: true
  },
  linkedInLink: {
    text: {
      type: String,
      required: true,
      trim: true
    },
    link: {
      type: String,
      required: true,
      trim: true
    }
  },
  githubLink: {
    text: {
      type: String,
      required: true,
      trim: true
    },
    link: {
      type: String,
      required: true,
      trim: true
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Professional', professionalSchema);