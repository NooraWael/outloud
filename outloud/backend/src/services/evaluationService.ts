import OpenAI from 'openai';
import { HeatmapSegment } from '../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface EvaluateParams {
  userTranscript: string;
  materialText?: string;
  topicTitle: string;
}

interface EvaluationResult {
  scores: {
    coverage: number;
    clarity: number;
    correctness: number;
    causality: number;
  };
  heatmap: HeatmapSegment[];
  summary: string;
  retell_prompt: string;
}

export async function evaluateExplanation({
  userTranscript,
  materialText,
  topicTitle,
}: EvaluateParams): Promise<EvaluationResult> {
  const prompt = buildEvaluationPrompt(userTranscript, materialText, topicTitle);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert educational evaluator. You analyze student explanations and provide detailed feedback.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.3, // Lower temperature for consistent evaluation
    response_format: { type: 'json_object' }, // Enforce JSON response
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');

  // Validate and return
  return {
    scores: {
      coverage: Math.min(100, Math.max(0, result.scores?.coverage || 0)),
      clarity: Math.min(100, Math.max(0, result.scores?.clarity || 0)),
      correctness: Math.min(100, Math.max(0, result.scores?.correctness || 0)),
      causality: Math.min(100, Math.max(0, result.scores?.causality || 0)),
    },
    heatmap: result.heatmap || [],
    summary: result.summary || 'Evaluation completed.',
    retell_prompt: result.retell_prompt || 'Try explaining again with more detail.',
  };
}

function buildEvaluationPrompt(
  userTranscript: string,
  materialText: string | undefined,
  topicTitle: string
): string {
  const materialSection = materialText
    ? `\n\n## Study Material (Ground Truth)\n${materialText.slice(0, 3000)}`
    : '';

  return `You are evaluating a student's spoken explanation of "${topicTitle}".

${materialSection}

## Student's Explanation (Transcribed)
"${userTranscript}"

---

## Your Task

Analyze the student's explanation and provide a JSON response with the following structure:

\`\`\`json
{
  "scores": {
    "coverage": 0-100,
    "clarity": 0-100,
    "correctness": 0-100,
    "causality": 0-100
  },
  "heatmap": [
    {
      "text": "exact phrase from student's transcript",
      "verdict": "strong" | "vague" | "misconception",
      "note": "brief explanation why"
    }
  ],
  "summary": "2-3 sentence overall feedback",
  "retell_prompt": "A specific 20-second challenge for improvement"
}
\`\`\`

## Scoring Criteria (0-100)

**Coverage** (0-100):
- Did they mention the key concepts from the material?
- What percentage of important topics did they cover?

**Clarity** (0-100):
- Is their explanation well-structured and easy to follow?
- Do they use precise terminology or vague words like "stuff", "things", "like"?

**Correctness** (0-100):
- Are the facts accurate according to the material?
- Any misconceptions or contradictions?

**Causality** (0-100):
- Do they explain WHY things happen, not just WHAT?
- Do they show understanding of cause-effect relationships?

## Heatmap Guidelines

Break the student's explanation into meaningful phrases (5-15 words each). For each phrase, assign a verdict:

- **"strong"**: Accurate, clear, demonstrates understanding
- **"vague"**: Hand-wavy, incomplete, uses filler words ("like", "kind of", "stuff")
- **"misconception"**: Factually wrong, contradicts material, logical error

The "text" field MUST be verbatim from the student's transcript.

## Summary
Write 2-3 sentences of overall feedback. Be constructive and specific.

## Retell Prompt
Give them a specific 20-second challenge that addresses their weaknesses. Format:
"In 20 seconds, explain [specific aspect] again, focusing on [what to improve] and avoiding [common mistake]."

CRITICAL: Output ONLY valid JSON. No markdown, no code blocks, just the JSON object.`;
}