// User
export interface User {
  id: string;
  username: string;
  password_hash?: string;
  is_guest: boolean;
  created_at: string;
}

// Demo Topic
export interface DemoTopic {
  id: string;
  title: string;
  description: string;
  persona: 'mentor' | 'critic';
  material_text: string;
  created_at: string;
}

// Conversation
export interface Conversation {
  id: string;
  user_id: string | null;
  topic_id: string;
  persona: 'mentor' | 'critic';
  turn_count: number;
  status: 'active' | 'evaluated';
  created_at: string;
  updated_at: string;
}

// Message
export interface Message {
  id: string;
  conversation_id: string;
  sender: 'user' | 'ai';
  text: string;
  audio_url: string | null;
  created_at: string;
}

// Evaluation
export interface Evaluation {
  id: string;
  conversation_id: string;
  scores: {
    coverage: number;
    clarity: number;
    correctness: number;
    causality: number;
  };
  heatmap: HeatmapSegment[];
  summary: string;
  retell_prompt: string;
  created_at: string;
}

export interface HeatmapSegment {
  text: string;
  verdict: 'strong' | 'vague' | 'misconception';
  note: string;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  username: string;
  isGuest: boolean;
}