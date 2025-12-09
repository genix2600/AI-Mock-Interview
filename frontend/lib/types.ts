
import {z} from 'genkit';

export const GenerateInterviewQuestionInputSchema = z.object({
  role: z
    .string()
    .describe(
      'The role description for which the interview question should be generated (e.g., "Senior frontend developer with React experience").'
    ),
  difficulty: z
    .string()
    .describe('The difficulty level of the interview question (e.g., easy, medium, hard).'),
  cvContent: z.string().optional().describe("The text content of the candidate's CV, if provided."),
});
export type GenerateInterviewQuestionInput = z.infer<typeof GenerateInterviewQuestionInputSchema>;

export const GenerateInterviewQuestionOutputSchema = z.object({
  question: z
    .object({
      question_id: z.string().describe('A unique identifier for the generated question.'),
      text: z.string().describe('The text of the generated interview question.'),
      expected_points: z
        .array(z.string())
        .describe(
          'A list of expected points that the interviewer should look for in the candidate s answer.'
        ),
      difficulty: z.string().describe('The difficulty level of the generated interview question.'),
    })
    .describe('The generated interview question.'),
});
export type GenerateInterviewQuestionOutput = z.infer<typeof GenerateInterviewQuestionOutputSchema>;


// Schemas and types for evaluate-interview-answer
export const EvaluateInterviewAnswerInputSchema = z.object({
  session_id: z.string().describe('The ID of the interview session.'),
  question_id: z.string().describe('The ID of the question being answered.'),
  transcript: z.string().describe("The transcript of the user's answer."),
  audio_features: z
    .object({
      speech_rate_wpm: z.number().describe('The speech rate in words per minute.'),
      filler_rate: z.number().describe('The rate of filler words used.'),
      pause_count: z.number().describe('The number of pauses in the answer.'),
    })
    .describe("Audio features extracted from the user's answer."),
  expected_points: z.array(z.string()).describe('Expected points to be covered in the answer.'),
  question_text: z.string().describe('The text of the question asked.'),
});
export type EvaluateInterviewAnswerInput = z.infer<typeof EvaluateInterviewAnswerInputSchema>;

const ExplainableFeedbackSchema = z.object({
  rubric: z.string().describe('The rubric being evaluated (e.g., technical_correctness).'),
  score: z.number().describe('The score for the rubric (0-100).'),
  comments: z.string().describe('Comments on the answer.'),
  evidence: z.array(z.string()).describe('Evidence snippets from the transcript.'),
});

const LearningPlanSchema = z.object({
    improvement_points: z.array(z.string()).describe('Actionable bullet points for improvement.'),
    learning_resources_keywords: z.array(z.string()).describe('Keywords to search for learning materials.'),
});


export const EvaluateInterviewAnswerOutputSchema = z.object({
  scores: z
    .object({
      technical_correctness: z.number().describe('Score for technical correctness (0-100).'),
      problem_solving: z.number().describe('Score for problem-solving (0-100).'),
      communication: z.number().describe('Score for communication (0-100).'),
      // Fluency and confidence are calculated after, not by the LLM
      fluency: z.number().optional().describe('Score for fluency (0-100).'),
      confidence: z.number().optional().describe('Score for confidence (0-100).'),
      final_score: z.number().optional().describe('The final score for the answer (0-100).'),
    })
    .describe('Scores for different aspects of the answer.'),
  explainable_feedback: z
    .array(ExplainableFeedbackSchema)
    .describe('Explainable feedback for each rubric.'),
  learning_plan: LearningPlanSchema.describe('A personalized plan for improvement.'),
});
export type EvaluateInterviewAnswerOutput = z.infer<typeof EvaluateInterviewAnswerOutputSchema>;


// Schemas and types for transcribe-spoken-answers
export const TranscribeSpokenAnswersInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The audio data URI of the spoken answer, including MIME type and Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeSpokenAnswersInput = z.infer<typeof TranscribeSpokenAnswersInputSchema>;

export const TranscribeSpokenAnswersOutputSchema = z.object({
  transcript: z.string().describe('The transcribed text of the spoken answer.'),
  durationSec: z.number().describe('The duration of the audio in seconds.'),
});
export type TranscribeSpokenAnswersOutput = z.infer<typeof TranscribeSpokenAnswersOutputSchema>;
