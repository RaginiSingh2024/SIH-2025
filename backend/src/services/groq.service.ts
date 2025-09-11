import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export interface flashcardDataType {
  question: string;
  answer: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface quizQuestionDataType {
  kind: 'mcq' | 'true_false' | 'fill_blank';
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

const FLASHCARD_PROMPT = `
You are an AI assistant that creates educational flashcards from text content. Generate flashcards that help students learn and remember key concepts.

Instructions:
1. Create concise, clear questions and answers
2. Focus on important concepts, definitions, facts, and relationships
3. Make questions specific and answerable
4. Assign appropriate difficulty levels (easy, medium, hard)
5. Add relevant tags for categorization
6. Return ONLY valid JSON without any markdown formatting or explanations

Generate exactly {count} flashcards from the following text:

{text}

Return a JSON array of flashcards with this exact structure:
[
  {
    "question": "Clear, specific question",
    "answer": "Concise, accurate answer",
    "tags": ["relevant", "tags"],
    "difficulty": "easy|medium|hard"
  }
]
`;

const QUIZ_PROMPT = `
You are an AI assistant that creates educational quiz questions from text content. Generate a mix of multiple choice, true/false, and fill-in-the-blank questions.

Instructions:
1. Create clear, unambiguous questions
2. For MCQ: provide 4 options with only one correct answer
3. For True/False: create statements that are clearly true or false
4. For Fill-in-blank: use "___" to indicate the blank
5. Include explanations for answers
6. Assign appropriate difficulty levels
7. Add relevant tags for categorization
8. Return ONLY valid JSON without any markdown formatting or explanations

Generate exactly {count} quiz questions from the following text (mix the question types):

{text}

Return a JSON array of quiz questions with this exact structure:
[
  {
    "kind": "mcq|true_false|fill_blank",
    "prompt": "Question text (use ___ for fill-in-blank)",
    "options": ["option1", "option2", "option3", "option4"],
    "correctAnswer": "correct answer",
    "explanation": "Brief explanation of the answer",
    "tags": ["relevant", "tags"],
    "difficulty": "easy|medium|hard"
  }
]

Note: Only include "options" field for MCQ questions.
`;

export const generateFlashcards = async (
  text: string,
  count: number = 10,
): Promise<flashcardDataType[]> => {
  try {
    const prompt = FLASHCARD_PROMPT.replace(
      '{count}',
      count.toString(),
    ).replace('{text}', text);

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai/gpt-oss-120b',
      temperature: 0.7,
      max_tokens: 4096,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from Groq API');
    }

    // Clean the response and parse JSON
    const cleanedContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const flashcards = JSON.parse(cleanedContent) as flashcardDataType[];

    // Validate the response structure
    if (!Array.isArray(flashcards)) {
      throw new Error('Invalid response format: expected array');
    }

    return flashcards.filter(
      (card) =>
        card.question &&
        card.answer &&
        Array.isArray(card.tags) &&
        ['easy', 'medium', 'hard'].includes(card.difficulty),
    );
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw new Error('Failed to generate flashcards from text');
  }
};

export const generateQuizQuestions = async (
  text: string,
  count: number = 10,
): Promise<quizQuestionDataType[]> => {
  try {
    const prompt = QUIZ_PROMPT.replace('{count}', count.toString()).replace(
      '{text}',
      text,
    );

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai/gpt-oss-120b',
      temperature: 0.7,
      max_tokens: 4096,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from Groq API');
    }

    // Clean the response and parse JSON
    const cleanedContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const questions = JSON.parse(cleanedContent) as quizQuestionDataType[];

    // Validate the response structure
    if (!Array.isArray(questions)) {
      throw new Error('Invalid response format: expected array');
    }

    return questions.filter(
      (q) =>
        q.prompt &&
        q.correctAnswer &&
        Array.isArray(q.tags) &&
        ['easy', 'medium', 'hard'].includes(q.difficulty) &&
        ['mcq', 'true_false', 'fill_blank'].includes(q.kind),
    );
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    throw new Error('Failed to generate quiz questions from text');
  }
};
