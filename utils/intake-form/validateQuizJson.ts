import type { QuizJsonQuiz, FormStepJson, ProgressStepJson, QuestionJson, ValidationResult } from '~/types/intake-form/quizJson';

/**
 * Validates a quiz JSON structure
 */
export function validateQuizJson(quiz: QuizJsonQuiz): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate quiz-level fields
  if (!quiz.slug || !quiz.id) {
    errors.push('Quiz must have both id and slug');
  }

  if (quiz.slug && !isValidSlug(quiz.slug)) {
    errors.push(`Quiz slug "${quiz.slug}" is not URL-safe`);
  }

  // Validate progress steps
  const progressStepErrors = validateProgressSteps(quiz.progressSteps);
  errors.push(...progressStepErrors);

  // Validate form steps
  const progressStepSlugs = quiz.progressSteps.map(ps => ps.slug);
  const formStepErrors = validateFormSteps(quiz.formSteps, progressStepSlugs);
  errors.push(...formStepErrors);

  // Check for duplicate form step slugs
  const formStepSlugs = quiz.formSteps.map(fs => fs.slug);
  const duplicateFormSteps = findDuplicates(formStepSlugs);
  if (duplicateFormSteps.length > 0) {
    errors.push(`Duplicate form step slugs: ${duplicateFormSteps.join(', ')}`);
  }

  // Check for duplicate question slugs within steps
  quiz.formSteps.forEach((step, stepIndex) => {
    const questionSlugs = step.questions.map(q => q.slug);
    const duplicateQuestions = findDuplicates(questionSlugs);
    if (duplicateQuestions.length > 0) {
      errors.push(`Duplicate question slugs in step "${step.slug}": ${duplicateQuestions.join(', ')}`);
    }
  });

  // Validate that all form steps have valid progressStepId
  quiz.formSteps.forEach(step => {
    if (!step.progressStepId) {
      errors.push(`Form step "${step.slug}" is missing progressStepId`);
    } else if (!progressStepSlugs.includes(step.progressStepId)) {
      errors.push(`Form step "${step.slug}" references invalid progress step "${step.progressStepId}"`);
    }
  });

  // Validate metadata
  if (!quiz.metadata) {
    warnings.push('Quiz is missing metadata');
  } else {
    if (!quiz.metadata.category) warnings.push('Quiz metadata missing category');
    if (!quiz.metadata.estimatedTime) warnings.push('Quiz metadata missing estimatedTime');
    if (!quiz.metadata.targetAudience) warnings.push('Quiz metadata missing targetAudience');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates progress steps
 */
export function validateProgressSteps(steps: ProgressStepJson[]): string[] {
  const errors: string[] = [];

  if (!steps || steps.length === 0) {
    errors.push('Quiz must have at least one progress step');
    return errors;
  }

  // Check for duplicate slugs
  const slugs = steps.map(s => s.slug);
  const duplicates = findDuplicates(slugs);
  if (duplicates.length > 0) {
    errors.push(`Duplicate progress step slugs: ${duplicates.join(', ')}`);
  }

  // Check for duplicate IDs
  const ids = steps.map(s => s.id);
  const duplicateIds = findDuplicates(ids);
  if (duplicateIds.length > 0) {
    errors.push(`Duplicate progress step IDs: ${duplicateIds.join(', ')}`);
  }

  // Validate each step
  steps.forEach((step, index) => {
    if (!step.slug) {
      errors.push(`Progress step at index ${index} is missing slug`);
    } else if (!isValidSlug(step.slug)) {
      errors.push(`Progress step slug "${step.slug}" is not URL-safe`);
    }

    if (!step.name) {
      errors.push(`Progress step "${step.slug || index}" is missing name`);
    }

    if (!step.color || !isValidColor(step.color)) {
      errors.push(`Progress step "${step.slug || index}" has invalid color`);
    }

    if (step.order === undefined && step.step_order === undefined) {
      errors.push(`Progress step "${step.slug || index}" is missing order`);
    }
  });

  // Check order sequence
  const orders = steps.map(s => s.order ?? s.step_order ?? 0).sort((a, b) => a - b);
  for (let i = 0; i < orders.length; i++) {
    if (orders[i] !== i + 1) {
      errors.push(`Progress step order sequence is not sequential (expected ${i + 1}, found ${orders[i]})`);
      break;
    }
  }

  return errors;
}

/**
 * Validates form steps
 */
export function validateFormSteps(steps: FormStepJson[], progressStepSlugs: string[]): string[] {
  const errors: string[] = [];

  if (!steps || steps.length === 0) {
    errors.push('Quiz must have at least one form step');
    return errors;
  }

  // Check for duplicate slugs
  const slugs = steps.map(s => s.slug);
  const duplicates = findDuplicates(slugs);
  if (duplicates.length > 0) {
    errors.push(`Duplicate form step slugs: ${duplicates.join(', ')}`);
  }

  // Validate each step
  steps.forEach((step, stepIndex) => {
    if (!step.slug) {
      errors.push(`Form step at index ${stepIndex} is missing slug`);
    } else if (!isValidSlug(step.slug)) {
      errors.push(`Form step slug "${step.slug}" is not URL-safe`);
    }

    if (!step.progressStepId) {
      errors.push(`Form step "${step.slug || stepIndex}" is missing progressStepId`);
    } else if (!progressStepSlugs.includes(step.progressStepId)) {
      errors.push(`Form step "${step.slug || stepIndex}" references invalid progress step "${step.progressStepId}"`);
    }

    if (step.order === undefined && step.step_order === undefined) {
      errors.push(`Form step "${step.slug || stepIndex}" is missing order`);
    }

    // Validate questions
    if (!step.questions || step.questions.length === 0) {
      errors.push(`Form step "${step.slug || stepIndex}" has no questions`);
    } else {
      step.questions.forEach((question, qIndex) => {
        const questionErrors = validateQuestion(question, step.slug || stepIndex);
        errors.push(...questionErrors.map(err => `Form step "${step.slug || stepIndex}", question ${qIndex + 1}: ${err}`));
      });
    }
  });

  return errors;
}

/**
 * Validates a question
 */
function validateQuestion(question: QuestionJson, stepContext: string | number): string[] {
  const errors: string[] = [];

  if (!question.slug) {
    errors.push('Question is missing slug');
  } else if (!isValidSlug(question.slug)) {
    errors.push(`Question slug "${question.slug}" is not URL-safe`);
  }

  if (!question.type) {
    errors.push('Question is missing type');
  }

  // Validate type-specific requirements
  const type = (question.type || '').toUpperCase();
  if (['SINGLESELECT', 'MULTISELECT', 'CHECKBOX', 'DROPDOWN'].includes(type)) {
    if (!question.options || question.options.length === 0) {
      errors.push(`Question type "${type}" requires options`);
    } else {
      question.options.forEach((option, optIndex) => {
        if (!option.value) {
          errors.push(`Option ${optIndex + 1} is missing value`);
        }
        if (!option.label) {
          errors.push(`Option ${optIndex + 1} is missing label`);
        }
      });
    }
  }

  if (type === 'MARKETING' && !question.image) {
    errors.push('MARKETING question type requires image');
  }

  if (type === 'BEFORE_AFTER') {
    if (!question.before_image && !question.beforeImage) {
      errors.push('BEFORE_AFTER question type requires beforeImage');
    }
    if (!question.after_image && !question.afterImage) {
      errors.push('BEFORE_AFTER question type requires afterImage');
    }
  }

  return errors;
}

/**
 * Finds duplicate values in an array
 */
function findDuplicates<T>(array: T[]): T[] {
  const seen = new Set<T>();
  const duplicates = new Set<T>();
  
  array.forEach(item => {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  });
  
  return Array.from(duplicates);
}

/**
 * Validates that a slug is URL-safe
 */
function isValidSlug(slug: string): boolean {
  // Slug should be lowercase, alphanumeric, hyphens, and underscores only
  return /^[a-z0-9_-]+$/.test(slug);
}

/**
 * Validates that a color is a valid hex color
 */
function isValidColor(color: string): boolean {
  // Accept hex colors (#RRGGBB or #RGB)
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color);
}
