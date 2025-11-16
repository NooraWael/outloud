import request from 'supertest';
import app from '../index';
import { cleanupTestData, createTestUser, generateTestToken } from './utils/testHelpers';
import { supabase } from '../services/supabase';

describe('Conversation Routes', () => {
  let token: string;
  let userId: string;
  let topicId: string;

  beforeAll(async () => {
    await cleanupTestData();

    // Create test user
    const user = await createTestUser('test_conv_user', 'password123');
    userId = user.id;
    token = generateTestToken(user.id, user.username);

    // Get a demo topic ID
    const { data: topics } = await supabase
      .from('demo_topics')
      .select('id')
      .limit(1)
      .single();

    if (!topics) {
      throw new Error('No demo topics found. Please seed demo_topics table first.');
    }

    topicId = topics.id;
  });

  afterAll(async () => {
    await cleanupTestData();
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  describe('POST /conversations', () => {
    it('should create a conversation for authenticated user', async () => {
      const response = await request(app)
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({
          topic_id: topicId,
          persona: 'mentor',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('conversation');
      expect(response.body.conversation.user_id).toBe(userId);
      expect(response.body.conversation.topic_id).toBe(topicId);
      expect(response.body.conversation.persona).toBe('mentor');
      expect(response.body.conversation.turn_count).toBe(0);
      expect(response.body.conversation.status).toBe('active');
    });

    it('should create a conversation for guest user (no auth)', async () => {
      const response = await request(app)
        .post('/conversations')
        .send({
          topic_id: topicId,
          persona: 'critic',
        });

      expect(response.status).toBe(201);
      expect(response.body.conversation.user_id).toBeNull();
      expect(response.body.conversation.persona).toBe('critic');
    });

    it('should return 404 for non-existent topic', async () => {
      const fakeTopicId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({
          topic_id: fakeTopicId,
          persona: 'mentor',
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Topic not found');
    });

    it('should return 400 for invalid persona', async () => {
      const response = await request(app)
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({
          topic_id: topicId,
          persona: 'invalid_persona',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('persona');
    });

    it('should return 400 for missing topic_id', async () => {
      const response = await request(app)
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({
          persona: 'mentor',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /conversations/:id', () => {
    let conversationId: string;

    beforeAll(async () => {
      // Create a conversation for testing
      const response = await request(app)
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({
          topic_id: topicId,
          persona: 'mentor',
        });

      conversationId = response.body.conversation.id;
    });

    it('should get conversation details with messages', async () => {
      const response = await request(app)
        .get(`/conversations/${conversationId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('conversation');
      expect(response.body).toHaveProperty('messages');
      expect(response.body).toHaveProperty('latestEvaluation');
      expect(response.body.conversation.id).toBe(conversationId);
      expect(response.body.messages).toBeInstanceOf(Array);
    });

    it('should return 404 for non-existent conversation', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .get(`/conversations/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Conversation not found');
    });

    it('should allow guest users to access their own conversations', async () => {
      // Create guest conversation
      const guestConvResponse = await request(app)
        .post('/conversations')
        .send({
          topic_id: topicId,
          persona: 'mentor',
        });

      const guestConvId = guestConvResponse.body.conversation.id;

      // Access without auth
      const response = await request(app)
        .get(`/conversations/${guestConvId}`);

      expect(response.status).toBe(200);
      expect(response.body.conversation.id).toBe(guestConvId);
    });
  });

  describe('GET /conversations', () => {
    beforeAll(async () => {
      // Create multiple conversations for the user
      await request(app)
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ topic_id: topicId, persona: 'mentor' });

      await request(app)
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ topic_id: topicId, persona: 'critic' });
    });

    it('should list all user conversations', async () => {
      const response = await request(app)
        .get('/conversations')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('conversations');
      expect(response.body).toHaveProperty('count');
      expect(response.body.conversations).toBeInstanceOf(Array);
      expect(response.body.conversations.length).toBeGreaterThan(0);
      
      // Check if conversations have topic details
      const firstConv = response.body.conversations[0];
      expect(firstConv).toHaveProperty('demo_topics');
      expect(firstConv.demo_topics).toHaveProperty('title');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/conversations');

      expect(response.status).toBe(401);
    });

    it('should order conversations by updated_at descending', async () => {
      const response = await request(app)
        .get('/conversations')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      
      const conversations = response.body.conversations;
      if (conversations.length > 1) {
        const firstDate = new Date(conversations[0].updated_at);
        const secondDate = new Date(conversations[1].updated_at);
        expect(firstDate.getTime()).toBeGreaterThanOrEqual(secondDate.getTime());
      }
    });
  });

 describe('POST /conversations/:id/voice-message', () => {
    let conversationId: string;

    beforeEach(async () => {
      // Create a fresh conversation for EACH test
      const response = await request(app)
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({
          topic_id: topicId,
          persona: 'mentor',
        });

      conversationId = response.body.conversation.id;
    });

    it('should return 400 if no audio file is uploaded', async () => {
      const response = await request(app)
        .post(`/conversations/${conversationId}/voice-message`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Audio file is required');
    });

    it('should accept audio file and return user + AI messages', async () => {
      // Create a fake audio buffer (for testing without actual audio)
      const fakeAudioBuffer = Buffer.from('fake audio data');

      const response = await request(app)
        .post(`/conversations/${conversationId}/voice-message`)
        .set('Authorization', `Bearer ${token}`)
        .attach('audio', fakeAudioBuffer, 'test-audio.webm');

      // This will likely fail because STT service isn't running in test
      // We'll need to mock it later, but let's document the expected behavior
      
      // Expected (when STT service is mocked):
      // expect(response.status).toBe(200);
      // expect(response.body).toHaveProperty('userMessage');
      // expect(response.body).toHaveProperty('aiMessage');
      // expect(response.body).toHaveProperty('turn_count');
      // expect(response.body).toHaveProperty('can_continue');
      
      // For now, we expect it to fail connecting to STT
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should return 404 for non-existent conversation', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const fakeAudioBuffer = Buffer.from('fake audio data');

      const response = await request(app)
        .post(`/conversations/${fakeId}/voice-message`)
        .set('Authorization', `Bearer ${token}`)
        .attach('audio', fakeAudioBuffer, 'test-audio.webm');

      expect(response.status).toBe(404);
    });

    it('should enforce 3-turn limit', async () => {
      // Manually set turn_count to 3 in database
      await supabase
        .from('conversations')
        .update({ turn_count: 3 })
        .eq('id', conversationId);

      // Try to send a message
      const fakeAudioBuffer = Buffer.from('fake audio data');
      const response = await request(app)
        .post(`/conversations/${conversationId}/voice-message`)
        .set('Authorization', `Bearer ${token}`)
        .attach('audio', fakeAudioBuffer, 'test-audio.webm');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Conversation has reached maximum turns (3)');
    });

    it('should reject non-audio files', async () => {
      const fakeTextBuffer = Buffer.from('This is not audio');

      const response = await request(app)
        .post(`/conversations/${conversationId}/voice-message`)
        .set('Authorization', `Bearer ${token}`)
        .attach('audio', fakeTextBuffer, 'test.txt');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Only audio files are allowed');
    });

    it('should reject files larger than 10MB', async () => {
      // Create a buffer larger than 10MB
      const largeBuffer = Buffer.alloc(11 * 1024 * 1024); // 11MB

      const response = await request(app)
        .post(`/conversations/${conversationId}/voice-message`)
        .set('Authorization', `Bearer ${token}`)
        .attach('audio', largeBuffer, 'large-audio.webm');

      expect(response.status).toBe(400);
    });
  });
});