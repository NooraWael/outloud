// User & Auth
export interface User {
  id: string;
  username: string;
  is_guest: boolean;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
}

// Topics
export interface DemoTopic {
  id: string;
  title: string;
  description: string;
  persona: 'mentor' | 'critic' | 'buddy' | 'coach';
  created_at: string;
  material_text?: string;
}

export interface DemoTopicsResponse {
  topics: DemoTopic[];
  count: number;
}

// Conversations
export interface Conversation {
  id: string;
  user_id: string | null;
  topic_id: string;
  persona: 'mentor' | 'critic' | 'buddy' | 'coach';
  turn_count: number;
  status: 'active' | 'evaluated';
  created_at: string;
  updated_at: string;
  demo_topics?: DemoTopic;
}

export interface CreateConversationRequest {
  topic_id: string;
  persona: 'mentor' | 'critic' | 'buddy' | 'coach';
}

export interface ConversationResponse {
  conversation: Conversation;
}

export interface ConversationDetailResponse {
  conversation: Conversation;
  messages: Message[];
  latestEvaluation: Evaluation | null;
}

export interface ConversationsListResponse {
  conversations: Conversation[];
  count: number;
}

// Messages
export interface Message {
  id: string;
  conversation_id: string;
  sender: 'user' | 'ai';
  text: string;
  audio_url: string | null;
  created_at: string;
}

export interface VoiceMessageResponse {
  userMessage: Message;
  aiMessage: Message;
  turn_count: number;
  can_continue: boolean;
}

// Evaluation
export interface HeatmapSegment {
  text: string;
  verdict: 'strong' | 'vague' | 'misconception';
  note: string;
}

export interface Scores {
  coverage: number;
  clarity: number;
  correctness: number;
  causality: number;
}

export interface Evaluation {
  id: string;
  conversation_id: string;
  scores: Scores;
  heatmap: HeatmapSegment[];
  summary: string;
  retell_prompt: string;
  created_at: string;
}

export interface EvaluationResponse {
  evaluation: Evaluation;
}

// API Error
export interface APIError {
  message: string;
  statusCode?: number;
}