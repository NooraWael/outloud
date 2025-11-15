import request from 'supertest';
import app from '../index';
import { cleanupTestData, createTestUser } from './utils/testHelpers';

describe('Auth Routes', () => {
  // Clean up before and after all tests
  beforeAll(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('POST /auth/signup', () => {
    it('should create a new user and return token', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          username: 'test_user_1',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe('test_user_1');
      expect(response.body.user.is_guest).toBe(false);
      expect(response.body.user).not.toHaveProperty('password_hash');
    });

    it('should return 400 if username already exists', async () => {
      // Create user first
      await request(app)
        .post('/auth/signup')
        .send({
          username: 'test_user_2',
          password: 'password123',
        });

      // Try to create again
      const response = await request(app)
        .post('/auth/signup')
        .send({
          username: 'test_user_2',
          password: 'password456',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username already taken');
    });

    it('should return 400 if username is too short', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          username: 'ab',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('username');
    });

    it('should return 400 if password is too short', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          username: 'test_user_3',
          password: '12345',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('password');
    });
  });

  describe('POST /auth/login', () => {
    beforeAll(async () => {
      // Create a test user for login tests
      await createTestUser('test_login_user', 'password123');
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'test_login_user',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.username).toBe('test_login_user');
    });

    it('should return 401 with incorrect password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'test_login_user',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid username or password');
    });

    it('should return 401 with non-existent username', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'nonexistent_user',
          password: 'password123',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /auth/guest', () => {
    it('should create a guest user and return token', async () => {
      const response = await request(app)
        .post('/auth/guest');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.is_guest).toBe(true);
      expect(response.body.user.username).toMatch(/^guest_/);
    });

    it('should create unique guest users on multiple calls', async () => {
      const response1 = await request(app).post('/auth/guest');
      const response2 = await request(app).post('/auth/guest');

      expect(response1.body.user.username).not.toBe(response2.body.user.username);
    });
  });

  describe('GET /auth/me', () => {
    let token: string;
    let userId: string;

    beforeAll(async () => {
      const user = await createTestUser('test_me_user', 'password123');
      userId = user.id;
      
      const jwt = require('jsonwebtoken');
      token = jwt.sign(
        { userId: user.id, username: user.username, isGuest: false },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
    });

    it('should return current user with valid token', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user.id).toBe(userId);
      expect(response.body.user.username).toBe('test_me_user');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Access token required');
    });

    it('should return 403 with invalid token', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Invalid or expired token');
    });
  });
});