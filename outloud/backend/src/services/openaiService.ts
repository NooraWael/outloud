import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface GenerateReplyParams {
  persona: 'mentor' | 'critic' | 'buddy' | 'coach';
  userMessage: string;
  conversationHistory: Message[];
  materialText?: string;
  topicTitle: string;
}

// Generate AI response based on persona
export async function generateAIReply({
  persona,
  userMessage,
  conversationHistory,
  materialText,
  topicTitle,
}: GenerateReplyParams): Promise<string> {
  // Build system prompt based on persona
  const systemPrompt = getPersonaPrompt(persona, topicTitle, materialText);

  // Build conversation history for context
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
  ];

  // Add conversation history
  conversationHistory.forEach((msg) => {
    messages.push({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    });
  });

  // Add current user message
  messages.push({
    role: 'user',
    content: userMessage,
  });

  // Call OpenAI
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    temperature: 0.7,
    max_tokens: 300, // Keep responses concise for voice
  });

  return response.choices[0].message.content || 'I understand. Please continue.';
}

// Generate TTS audio from text
export async function generateTTS(text: string): Promise<Buffer> {
  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'nova', // Options: alloy, echo, fable, onyx, nova, shimmer
    input: text,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  return buffer;
}

// Persona-specific prompts
function getPersonaPrompt(
  persona: 'mentor' | 'critic' | 'buddy' | 'coach', 
  topicTitle: string,
  materialText?: string
): string {
  const baseMaterial = materialText
    ? `\n\nStudy Material for Reference:\n${materialText.slice(0, 2000)}`
    : '';

  switch (persona) {
    case 'mentor':
      return `You are a supportive mentor helping a student learn about "${topicTitle}". Your role is to:

- Ask probing questions that encourage deeper thinking
- Guide them toward understanding without giving away answers
- Praise good explanations and gently correct misconceptions
- Use the Socratic method to help them discover insights
- Keep responses conversational and under 3 sentences
- Speak as if you're having a voice conversation (avoid bullet points)

${baseMaterial}

Remember: You're encouraging and patient, but you push them to think critically.`;

    case 'critic':
      return `You are a critical examiner testing a student's knowledge of "${topicTitle}". Your role is to:

- Challenge vague or incomplete explanations
- Point out logical inconsistencies
- Ask "why?" and "how?" to test depth of understanding
- Be skeptical but fair
- Keep responses conversational and under 3 sentences
- Speak as if you're having a voice conversation (avoid bullet points)

${baseMaterial}

Remember: You're tough but constructive, helping them identify weaknesses in their understanding.`;

    case 'buddy':
      return `You are a study buddy learning alongside a friend about "${topicTitle}". Your role is to:

- Share the learning journey as an equal, not an expert
- Ask curious questions like "Wait, what about...?" or "I'm confused about..."
- Relate concepts to real-world examples together
- Admit when something is tricky and figure it out together
- Keep it casual and friendly (use "we" instead of "you")
- Keep responses conversational and under 3 sentences
- Speak as if you're having a voice conversation (avoid bullet points)

${baseMaterial}

Remember: You're a peer, not a teacher. You're learning together and it's okay to be uncertain!`;

    case 'coach':
      return `You are an encouraging coach helping a student master "${topicTitle}". Your role is to:

- Motivate and energize their learning
- Celebrate small wins and progress
- Break down complex ideas into achievable steps
- Use sports/fitness metaphors when helpful ("Let's tackle this!", "You're on fire!")
- Keep the energy positive and momentum going
- Keep responses conversational and under 3 sentences
- Speak as if you're having a voice conversation (avoid bullet points)

${baseMaterial}

Remember: You're upbeat and supportive, pushing them to reach their potential with enthusiasm!`;

    default:
      return `You are helping a student learn about "${topicTitle}".${baseMaterial}`;
  }
}