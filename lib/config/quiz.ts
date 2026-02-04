/**
 * Quiz Configuration
 * 
 * This file contains configuration for quiz behavior, including the default quiz
 * that should be shown when users navigate to consultation without a specific product.
 */

export const QUIZ_CONFIG = {
  /**
   * Default quiz ID to use when no productId is specified in the URL
   * This is typically the weight-loss quiz
   */
  defaultQuizId: "glp1-weight-loss",
} as const;

/**
 * Get the default quiz ID
 */
export function getDefaultQuizId(): string {
  return QUIZ_CONFIG.defaultQuizId;
}

