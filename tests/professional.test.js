const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Professional = require('../models/professional');

describe('Professional API Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/test_cse341');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Professional.deleteMany();
  });

  describe('GET /professional', () => {
    test('should return empty array when no professionals exist', async () => {
      const response = await request(app).get('/professional');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Array));
      expect(response.body.length).toBe(0);
    });

    test('should return all professionals', async () => {
      // Create test professional
      const professional = await Professional.create({
        professionalName: "Test Professional",
        base64Image: "test-image",
        nameLink: { firstName: "Test", url: "https://test.com" },
        primaryDescription: "Test Description",
        workDescription1: "Work 1",
        workDescription2: "Work 2",
        linkTitleText: "Links",
        linkedInLink: { text: "LinkedIn", link: "https://linkedin.com" },
        githubLink: { text: "GitHub", link: "https://github.com" }
      });

      const response = await request(app).get('/professional');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Array));
      expect(response.body.length).toBe(1);
      expect(response.body[0].professionalName).toBe("Test Professional");
    });

    test('should handle server errors', async () => {
      // Mock database error
      jest.spyOn(Professional, 'find').mockRejectedValueOnce(new Error('Database error'));
      
      const response = await request(app).get('/professional');
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /professional/:id', () => {
    test('should return professional by valid ID', async () => {
      const professional = await Professional.create({
        professionalName: "Test Professional",
        base64Image: "test-image",
        nameLink: { firstName: "Test", url: "https://test.com" },
        primaryDescription: "Test Description",
        workDescription1: "Work 1",
        workDescription2: "Work 2",
        linkTitleText: "Links",
        linkedInLink: { text: "LinkedIn", link: "https://linkedin.com" },
        githubLink: { text: "GitHub", link: "https://github.com" }
      });

      const response = await request(app).get(`/professional/${professional._id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.professionalName).toBe("Test Professional");
    });

    test('should return 404 for non-existent professional', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/professional/${fakeId}`);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for invalid ID format', async () => {
      const response = await request(app).get('/professional/invalid-id');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});