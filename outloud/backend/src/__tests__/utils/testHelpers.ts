import { supabase } from '../../services/supabase';

// Clean up test data after each test
export const cleanupTestData = async () => {
  // Delete test users (keep demo topics)
  await supabase
    .from('users')
    .delete()
    .like('username', 'test_%');
  
  await supabase
    .from('users')
    .delete()
    .like('username', 'guest_%');
};

// Create a test user
export const createTestUser = async (username: string, password: string) => {
  const bcrypt = require('bcryptjs');
  const password_hash = await bcrypt.hash(password, 12);

  const { data, error } = await supabase
    .from('users')
    .insert({
      username,
      password_hash,
      is_guest: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Generate test JWT token
export const generateTestToken = (userId: string, username: string) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { userId, username, isGuest: false },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};