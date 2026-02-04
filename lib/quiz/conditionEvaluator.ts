import type { Condition, RenderCondition, FormAnswers } from '~/types/intake-form/form';

// Memoization cache to improve performance for large forms
const evaluationCache = new Map<string, boolean>();

/**
 * Generates a cache key for memoization based on condition and answers
 */
function generateCacheKey(renderCondition: RenderCondition, answers: FormAnswers): string {
  const conditionStr = JSON.stringify(renderCondition);
  const answersStr = JSON.stringify(answers);
  return `${conditionStr}:${answersStr}`;
}

/**
 * Evaluates a single condition against the current form answers.
 * @param condition The condition object from the database.
 * @param answers The current state of the form answers.
 * @returns {boolean} True if the condition is met, false otherwise.
 */
function evaluateSingleCondition(condition: Condition, answers: FormAnswers): boolean {
  const answerValue = answers[condition.field];
  if (answerValue === undefined) {
    return false; // Field not answered yet
  }

  switch (condition.operator) {
    case 'equals':
      return answerValue === condition.value;
    case 'notEquals':
      return answerValue !== condition.value;
    case 'greaterThan':
      return Number(answerValue) > Number(condition.value);
    case 'lessThan':
      return Number(answerValue) < Number(condition.value);
    default:
      return false;
  }
}

/**
 * Evaluates the top-level render condition object to determine if a step should be shown.
 * Uses memoization for performance optimization with large forms.
 * @param renderCondition The full condition object from the `form_steps` table.
 * @param answers The current state of the form answers.
 * @returns {boolean} True if the step should be rendered, false otherwise.
 */
export function shouldRenderStep(renderCondition: RenderCondition | null | undefined, answers: FormAnswers): boolean {
  // If there's no condition, the step should always be shown.
  if (!renderCondition || !renderCondition.conditions || renderCondition.conditions.length === 0) {
    return true;
  }

  // Check cache first for performance
  const cacheKey = generateCacheKey(renderCondition, answers);
  if (evaluationCache.has(cacheKey)) {
    return evaluationCache.get(cacheKey)!;
  }

  const results = renderCondition.conditions.map(c => evaluateSingleCondition(c, answers));

  let result: boolean;
  if (renderCondition.logicalOperator === 'AND') {
    // For AND, every single condition must be true.
    result = results.every(result => result === true);
  } else {
    // For OR, at least one condition must be true.
    result = results.some(result => result === true);
  }

  // Cache the result for future use
  evaluationCache.set(cacheKey, result);
  
  return result;
}

/**
 * Clears the evaluation cache. Useful for testing or when you want to force
 * re-evaluation of all conditions.
 */
export function clearEvaluationCache(): void {
  evaluationCache.clear();
}

/**
 * Gets the current cache size for debugging purposes.
 */
export function getCacheSize(): number {
  return evaluationCache.size;
}