
import { GoogleGenAI, Type } from "@google/genai";
import { QuizSettings, QuizData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getClassLevelGuidance = (level: string) => {
  switch (level) {
    case 'P1': return "P1 (Ages 6-7): Focus on simple single-digit addition and subtraction. Numbers up to 20. Example: 5 + 3, 9 - 2.";
    case 'P2': return "P2 (Ages 7-8): Two-digit addition/subtraction without carrying/borrowing. Introduce single-digit multiplication basics (2, 5, 10 times tables). Example: 12 + 5, 28 - 11, 3 * 5.";
    case 'P3': return "P3 (Ages 8-9): Two-digit addition/subtraction with carrying/borrowing. Expand multiplication (up to 10x10) and introduce simple division. Example: 37 + 45, 52 - 28, 7 * 8, 24 / 4.";
    case 'P4': return "P4 (Ages 9-10): Multi-digit addition/subtraction. Two-digit by one-digit multiplication. More complex division. Example: 345 + 189, 45 * 3, 125 / 5.";
    case 'P5': return "P5 (Ages 10-11): Multi-digit multiplication (e.g., 2-digit by 2-digit). Long division. Introduction to order of operations (BODMAS/PEMDAS) with two operations. Example: 123 * 24, 456 / 12, 5 + 3 * 2.";
    case 'P6': return "P6 (Ages 11-12): Complex multi-digit multiplication and division. Order of operations with multiple steps. Introduction to decimals in problems is acceptable. Example: 582 * 47, 2456 / 18, (10 + 5) * 3 - 2.";
    default: return "General arithmetic for elementary school children.";
  }
};

export const generateQuiz = async (settings: QuizSettings): Promise<QuizData> => {
  const { level, operations, numQuestions } = settings;

  const prompt = `
    You are an intelligent and friendly arithmetic tutor for children aged 6-12.
    Your task is to generate a set of math problems based on the following criteria.

    - Class Level: ${level}
    - Age/Complexity Guidance: ${getClassLevelGuidance(level)}
    - Operation(s) to include: ${operations.join(', ')}
    - Number of Exercises: ${numQuestions}

    Instructions for generation:
    1.  Create ${numQuestions} unique math problems that match the specified class level and operations.
    2.  The "expression" should be a string that can be displayed to the child (e.g., "8 + 5", "5 * (3 + 2)").
    3.  Calculate the single, final correct answer for each expression.
    4.  The "instructions" field should contain a short, encouraging message for the student.
    5.  Return the entire output in the specified JSON format. The difficulty must be strictly appropriate for the class level. Do not include problems that are too simple or too complex for the specified level.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      questions: {
        type: Type.ARRAY,
        description: 'A list of quiz questions.',
        items: {
          type: Type.OBJECT,
          properties: {
            question_number: {
              type: Type.INTEGER,
              description: 'The sequential number of the question.',
            },
            expression: {
              type: Type.STRING,
              description: 'The mathematical expression as a string.',
            },
            correct_answer: {
              type: Type.NUMBER,
              description: 'The correct numerical answer.',
            },
          },
          required: ['question_number', 'expression', 'correct_answer'],
        },
      },
      instructions: {
        type: Type.STRING,
        description: 'A friendly instruction message for the student.',
      },
    },
    required: ['questions', 'instructions'],
  };
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 1, // Higher temperature for more varied questions
      },
    });

    const jsonText = response.text.trim();
    const quizData: QuizData = JSON.parse(jsonText);
    
    if (!quizData.questions || quizData.questions.length === 0) {
      throw new Error("AI returned no questions. Please try again.");
    }
    
    return quizData;

  } catch (error) {
    console.error("Error generating quiz from Gemini API:", error);
    throw new Error("Failed to generate the quiz. The AI might be busy, please try again in a moment.");
  }
};
