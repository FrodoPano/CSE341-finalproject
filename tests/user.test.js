const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/user');

describe('User API Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/test_cse341');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany();
  });

  describe('GET /users', () => {
    test('should return all users without passwords', async () => {
      await User.create([
        { email: "user1@test.com", password: "password123" },
        { email: "user2@test.com", password: "password123" }
      ]);

      const response = await request(app).get('/users');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Array));
      expect(response.body.length).toBe(2);
      expect(response.body[0]).not.toHaveProperty('password');
      expect(response.body[1]).not.toHaveProperty('password');
    });

    test('should handle server errors', async () => {
      jest.spyOn(User, 'find').mockRejectedValueOnce(new Error('Database error'));
      
      const response = await request(app).get('/users');
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});