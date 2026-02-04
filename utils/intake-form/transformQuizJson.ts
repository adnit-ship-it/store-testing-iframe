import type { QuizConfig, FormStep, FormQuestion, ProgressStep, StepProgressMapping, RenderCondition, DisplayValue, FormAnswers } from '~/types/intake-form/form';
import type { QuizJsonQuiz, FormStepJson, QuestionJson, ProgressStepJson, RenderConditionJson, QuizJson } from '~/types/intake-form/quizJson';

// Static import - Nuxt will handle this at build time (same pattern as products.ts)
// @ts-ignore - JSON import type may not be fully recognized
import quizJsonRaw from '~/data/quiz.json';

// Cache for processed data
let quizJsonData: QuizJson | null = null;

// Initialize quiz data from static import
function initializeQuizData(): QuizJson | null {
  if (quizJsonData !== null) {
    return quizJsonData;
  }

  try {
    // Handle both default export and direct object
    quizJsonData = (quizJsonRaw as any).default || quizJsonRaw;
    return quizJsonData;
  } catch (error) {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      console.warn('Could not load quiz.json:', error);
    }
    return null;
  }
}

// Initialize immediately
quizJsonData = initializeQuizData();

// Async version for compatibility
async function loadQuizJsonDataAsync(): Promise<QuizJson | null> {
  if (quizJsonData !== null) {
    return quizJsonData;
  }
  return initializeQuizData();
}

/**
 * Transforms a JSON quiz structure to QuizConfig format
 */
export function transformQuizJsonToQuizConfig(jsonQuiz: QuizJsonQuiz): QuizConfig {
  // Transform progress steps (sort by order, use slug as id)
  const progressSteps: ProgressStep[] = jsonQuiz.progressSteps
    .sort((a, b) => (a.order || a.step_order || 0) - (b.order || b.step_order || 0))
    .map(step => ({
      id: step.slug,
      name: step.name,
      description: step.description,
      color: step.color || "#A75809"
    }));

  // Get progress step slugs for validation
  const progressStepSlugs = new Set(progressSteps.map(ps => ps.id));

  // Transform form steps (sort by order, use slug as id)
  const formSteps: FormStep[] = jsonQuiz.formSteps
    .sort((a, b) => (a.order || a.step_order || 0) - (b.order || b.step_order || 0))
    .map(stepJson => transformFormStep(stepJson, progressStepSlugs));

  // Build stepProgressMapping from form steps' progressStepId
  const stepProgressMapping: StepProgressMapping[] = formSteps
    .map(step => {
      // Find the progressStepId from the original JSON
      const formStepJson = jsonQuiz.formSteps.find(fs => fs.slug === step.id);
      if (!formStepJson || !formStepJson.progressStepId) {
        return null;
      }
      
      // Validate that the progress step exists
      if (!progressStepSlugs.has(formStepJson.progressStepId)) {
        console.warn(`Form step "${step.id}" references invalid progress step "${formStepJson.progressStepId}"`);
        return null;
      }

      return {
        stepId: step.id,
        progressStepId: formStepJson.progressStepId
      };
    })
    .filter((mapping): mapping is StepProgressMapping => mapping !== null);

  return {
    id: jsonQuiz.slug,
    name: jsonQuiz.name,
    description: jsonQuiz.description,
    version: jsonQuiz.version,
    progressSteps,
    stepProgressMapping,
    steps: formSteps,
    metadata: jsonQuiz.metadata
  };
}

/**
 * Transforms a JSON form step to FormStep format
 */
function transformFormStep(stepJson: FormStepJson, progressStepSlugs: Set<string>): FormStep {
  // Handle renderCondition (support both camelCase and snake_case)
  let renderCondition: RenderCondition | undefined = undefined;
  const renderConditionJson = stepJson.renderCondition || stepJson.render_condition;
  
  if (renderConditionJson && typeof renderConditionJson === 'object') {
    renderCondition = transformRenderCondition(renderConditionJson);
  }

  // Validate progressStepId exists
  const progressStepId = stepJson.progressStepId;
  if (progressStepId && !progressStepSlugs.has(progressStepId)) {
    console.warn(`Form step "${stepJson.slug}" references invalid progress step "${progressStepId}"`);
  }

  // Transform displayValue if present
  const displayValue = transformDisplayValue(stepJson.displayValue);

  return {
    id: stepJson.slug, // Use slug as ID
    title: stepJson.title,
    heading1: stepJson.heading1,
    heading2: stepJson.heading2,
    subtext: stepJson.subtext || undefined,
    questionSubtext: stepJson.subtext || undefined, // Alias for compatibility
    renderCondition: renderCondition,
    showTrustBadges: stepJson.showTrustBadges,
    headingsInline: stepJson.headingsInline,
    // Dynamic text fields
    dynamicTitle: stepJson.dynamicTitle,
    dynamicHeading1: stepJson.dynamicHeading1,
    dynamicHeading2: stepJson.dynamicHeading2,
    dynamicSubtext: stepJson.dynamicSubtext,
    // Display value (for calculated fields like BMI)
    displayValue: displayValue,
    questions: stepJson.questions
      .sort((a, b) => (a.question_order || 0) - (b.question_order || 0))
      .map(q => transformQuestion(q))
  };
}

/**
 * Transforms a JSON render condition to RenderCondition format
 */
function transformRenderCondition(conditionJson: RenderConditionJson): RenderCondition {
  return {
    conditions: conditionJson.conditions.map(c => ({
      field: c.field,
      operator: c.operator,
      value: c.value
    })),
    logicalOperator: conditionJson.logicalOperator
  };
}

/**
 * Transforms a JSON displayValue structure to function-based DisplayValue format
 */
function transformDisplayValue(displayValueJson: FormStepJson['displayValue']): DisplayValue | undefined {
  if (!displayValueJson) return undefined;

  // Convert condition array to function (AND logic - all conditions must pass)
  const conditionFn = (answers: FormAnswers): boolean => {
    if (!displayValueJson.condition || displayValueJson.condition.length === 0) {
      return true;
    }
    
    return displayValueJson.condition.every(c => {
      const fieldValue = answers[c.field];
      switch (c.operator) {
        case 'notEquals':
          return fieldValue != null && fieldValue !== '' && fieldValue !== c.value;
        case 'equals':
          return fieldValue === c.value;
        case 'greaterThan':
          return Number(fieldValue) > Number(c.value);
        case 'lessThan':
          return Number(fieldValue) < Number(c.value);
        default:
          return true;
      }
    });
  };

  // Convert calculate config to function
  const calculateFn = (answers: FormAnswers): string | number => {
    if (!displayValueJson.calculate) {
      return '';
    }

    const calc = displayValueJson.calculate;

    if (calc.type === 'bmi' && calc.fields && calc.fields.length >= 3) {
      const [feet, inches, weight] = calc.fields.map(f => answers[f]);
      
      // Check if all required values are present
      if (feet == null || inches == null || weight == null) {
        return '';
      }

      // BMI calculation: weight (kg) / height (m)^2
      const heightInInches = Number(feet) * 12 + Number(inches);
      const heightInMeters = heightInInches * 0.0254;
      const weightInKg = Number(weight) * 0.453592;
      const bmi = weightInKg / (heightInMeters * heightInMeters);
      return bmi.toFixed(2);
    }

    if (calc.type === 'weeksToGoal' && calc.fields && calc.fields.length >= 2) {
      // Future implementation for weeks to goal calculation
      // This would require current weight and goal weight
      return '';
    }

    if (calc.type === 'custom' && calc.formula) {
      // Future implementation for custom formula evaluation
      return '';
    }

    return '';
  };

  return {
    condition: conditionFn,
    calculate: calculateFn,
    template: displayValueJson.template || '{{value}}'
  };
}

/**
 * Transforms a JSON question to FormQuestion format
 */
function transformQuestion(qJson: QuestionJson): FormQuestion {
  // Normalize field names (support both camelCase and snake_case)
  const required = qJson.required ?? qJson.is_required ?? false;
  const displayQuestion = qJson.displayQuestion ?? qJson.display_question;
  const apiType = (qJson.apiType ?? qJson.api_type) as any;
  const validation = qJson.validation || undefined;
  const placeholder = qJson.placeholder || undefined;
  
  // Convert type to lowercase for consistency
  const type = (qJson.type || '').toLowerCase();

  const baseQuestion = {
    id: qJson.slug, // Use slug as ID
    question: qJson.question,
    displayQuestion: displayQuestion,
    required: required,
    type: type as any,
    placeholder: placeholder,
    apiType: apiType,
    validation: validation,
    dynamicText: qJson.dynamicText
  };

  // Handle type-specific fields
  switch (type.toUpperCase()) {
    case 'SINGLESELECT':
    case 'MULTISELECT':
    case 'CHECKBOX': {
      const options = qJson.options || [];
      const optionValues = options
        .sort((a, b) => (a.option_order || 0) - (b.option_order || 0))
        .map(opt => opt.value);
      const optionLabels = options.map(opt => opt.label || String(opt.value));
      const displayAsRow = qJson.displayAsRow ?? qJson.display_as_row ?? true;
      const image = qJson.image;
      const optionImages = qJson.optionImages ?? qJson.option_images;

      return {
        ...baseQuestion,
        type: type.toUpperCase() as 'SINGLESELECT' | 'MULTISELECT' | 'CHECKBOX',
        options: optionValues as string[],
        optionLabels: optionLabels,
        displayAsRow: displayAsRow,
        image: image,
        optionImages: optionImages // Include optionImages array
      } as FormQuestion;
    }

    case 'MARKETING': {
      return {
        ...baseQuestion,
        type: 'MARKETING' as const,
        image: qJson.image,
        displayStatistics: qJson.displayStatistics ?? qJson.display_statistics
      } as FormQuestion;
    }

    case 'BEFORE_AFTER': {
      return {
        ...baseQuestion,
        type: 'BEFORE_AFTER' as const,
        beforeImage: qJson.beforeImage ?? qJson.before_image,
        afterImage: qJson.afterImage ?? qJson.after_image,
        quote: qJson.quote
      } as FormQuestion;
    }

    case 'FILE_INPUT': {
      return {
        ...baseQuestion,
        type: 'FILE_INPUT' as const,
        apiType: 'FILE' as const
      } as FormQuestion;
    }

    case 'DROPDOWN': {
      const options = qJson.options || [];
      const optionValues = options
        .sort((a, b) => (a.option_order || 0) - (b.option_order || 0))
        .map(opt => opt.value);
      const optionLabels = options.map(opt => opt.label || String(opt.value));

      return {
        ...baseQuestion,
        type: 'DROPDOWN' as const,
        options: optionValues as (string | number)[],
        optionLabels: optionLabels
      } as FormQuestion;
    }

    case 'MEDICAL_REVIEW': {
      return {
        ...baseQuestion,
        type: 'MEDICAL_REVIEW' as const,
        calculatedValues: qJson.calculatedValues,
        candidateStatement: qJson.candidateStatement || ''
      } as FormQuestion;
    }

    case 'PERFECT': {
      return {
        ...baseQuestion,
        type: 'PERFECT' as const,
        heading1: qJson.heading1,
        dynamicSubtext: qJson.dynamicSubtext,
        subtext: qJson.subtext
      } as FormQuestion;
    }

    case 'WEIGHT_SUMMARY': {
      return {
        ...baseQuestion,
        type: 'WEIGHT_SUMMARY' as const
      } as FormQuestion;
    }

    default: {
      // For text, textarea, number, email, tel types
      return {
        ...baseQuestion,
        icon: qJson.icon // Add icon support for text types
      } as FormQuestion;
    }
  }
}

/**
 * Loads and transforms all quizzes from quiz.json
 * Uses static import that Nuxt handles at build time
 */
export function loadQuizzesFromJson(): QuizConfig[] {
  try {
    const data = initializeQuizData();
    if (!data) {
      return [];
    }
    return transformQuizzesFromData(data);
  } catch (error) {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      console.error('Error loading quiz.json:', error);
    }
    return [];
  }
}

/**
 * Async version for loading quizzes - for compatibility
 */
export async function loadQuizzesFromJsonAsync(): Promise<QuizConfig[]> {
  const data = await loadQuizJsonDataAsync();
  if (!data) {
    return [];
  }
  return transformQuizzesFromData(data);
}

/**
 * Transforms quizzes from JSON data
 */
function transformQuizzesFromData(data: QuizJson): QuizConfig[] {
  if (!data || !data.quizzes || !Array.isArray(data.quizzes)) {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      console.warn('quiz.json does not contain a valid quizzes array');
    }
    return [];
  }

  return data.quizzes.map((quiz: QuizJsonQuiz) => {
    try {
      return transformQuizJsonToQuizConfig(quiz);
    } catch (error) {
      console.error(`Error transforming quiz "${quiz.slug || quiz.id}":`, error);
      return null;
    }
  }).filter((quiz: QuizConfig | null): quiz is QuizConfig => quiz !== null);
}

/**
 * Gets a quiz by slug from JSON (synchronous)
 */
export function getQuizBySlugFromJson(slug: string): QuizConfig | undefined {
  const quizzes = loadQuizzesFromJson();
  return quizzes.find(q => q.id === slug);
}

/**
 * Gets a quiz by slug from JSON (async)
 */
export async function getQuizBySlugFromJsonAsync(slug: string): Promise<QuizConfig | undefined> {
  const quizzes = await loadQuizzesFromJsonAsync();
  return quizzes.find(q => q.id === slug);
}
