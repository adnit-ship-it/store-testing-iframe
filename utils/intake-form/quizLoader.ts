import type { QuizConfig } from '~/types/intake-form/form';
import { loadQuizzesFromJson, getQuizBySlugFromJson } from './transformQuizJson';
import { 
  glp1WeightLossQuiz,
  nadPlusQuiz,
  sermorelinQuiz,
  vitaminB12Quiz,
  sexualHealthQuiz,
  glutathioneQuiz,
  hyperpigmentationQuiz,
  antiAgingQuiz,
  acneQuiz,
  hairLossQuiz
} from '~/data/intake-form/quizConfigs';

/**
 * Centralized quiz loading utility with fallback chain:
 * 1. Try JSON quizzes
 * 2. Fallback to hardcoded quizzes
 * 3. Return undefined if not found
 */

// Cache for loaded JSON quizzes
let jsonQuizzesCache: QuizConfig[] | null = null;
let jsonQuizzesLoadAttempted = false;

/**
 * Loads all quizzes with caching
 */
export function loadAllQuizzes(): QuizConfig[] {
  // Try JSON first
  if (!jsonQuizzesLoadAttempted) {
    jsonQuizzesLoadAttempted = true;
    try {
      jsonQuizzesCache = loadQuizzesFromJson();
    } catch (error) {
      if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
        console.warn('Failed to load quizzes from JSON, using hardcoded quizzes:', error);
      }
      jsonQuizzesCache = [];
    }
  }

  // Hardcoded quizzes array
  const hardcodedQuizzes: QuizConfig[] = [
    glp1WeightLossQuiz,
    nadPlusQuiz,
    sermorelinQuiz,
    vitaminB12Quiz,
    sexualHealthQuiz,
    glutathioneQuiz,
    hyperpigmentationQuiz,
    antiAgingQuiz,
    acneQuiz,
    hairLossQuiz
  ];

  // Merge JSON and hardcoded quizzes (JSON takes precedence)
  const jsonMap = new Map((jsonQuizzesCache || []).map(q => [q.id, q]));
  const hardcodedMap = new Map(hardcodedQuizzes.map(q => [q.id, q]));

  // Start with JSON quizzes
  const result: QuizConfig[] = [...(jsonQuizzesCache || [])];

  // Add hardcoded quizzes that aren't in JSON
  hardcodedMap.forEach((quiz, id) => {
    if (!jsonMap.has(id)) {
      result.push(quiz);
    }
  });

  return result;
}

/**
 * Gets a quiz by ID with fallback chain
 */
export function getQuizById(quizId: string): QuizConfig | undefined {
  // Try JSON first
  const jsonQuiz = getQuizBySlugFromJson(quizId);
  if (jsonQuiz) {
    return jsonQuiz;
  }

  // Fallback to hardcoded quizzes
  const hardcodedQuizzes: QuizConfig[] = [
    glp1WeightLossQuiz,
    nadPlusQuiz,
    sermorelinQuiz,
    vitaminB12Quiz,
    sexualHealthQuiz,
    glutathioneQuiz,
    hyperpigmentationQuiz,
    antiAgingQuiz,
    acneQuiz,
    hairLossQuiz
  ];
  
  return hardcodedQuizzes.find(q => q.id === quizId);
}

/**
 * Clears the quiz cache (useful for testing or hot reloading)
 */
export function clearQuizCache(): void {
  jsonQuizzesCache = null;
  jsonQuizzesLoadAttempted = false;
}

/**
 * Gets all available quiz IDs
 */
export function getAvailableQuizIds(): string[] {
  const quizzes = loadAllQuizzes();
  return quizzes.map(q => q.id);
}
