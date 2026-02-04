import type { RenderCondition } from './form';

/**
 * TypeScript interfaces for the JSON quiz structure
 * These match the structure of data/quiz.json
 */

export interface ConditionJson {
  field: string;
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan';
  value: any;
}

export interface RenderConditionJson {
  conditions: ConditionJson[];
  logicalOperator: 'AND' | 'OR';
}

export interface QuestionOptionJson {
  id: string;
  question_id: string;
  value: string | number;
  label: string;
  option_order: number;
}

export interface QuestionJson {
  id: string;
  slug: string;
  type: string; // Will be converted to lowercase in transformer
  question?: string;
  display_question?: string;
  displayQuestion?: string; // Support both snake_case and camelCase
  required: boolean;
  is_required?: boolean; // Support both formats
  placeholder?: string | null;
  api_type: string;
  apiType?: string; // Support both formats
  validation?: string[] | null;
  question_order: number;
  form_step_id?: string; // Legacy field, not used in new structure
  
  // Common fields
  dynamicText?: string;
  icon?: string;
  
  // Type-specific fields for SELECT types
  options?: QuestionOptionJson[];
  display_as_row?: boolean;
  displayAsRow?: boolean;
  option_images?: string[];
  optionImages?: string[];
  
  // Type-specific fields for MARKETING
  image?: string;
  display_statistics?: boolean;
  displayStatistics?: boolean;
  
  // Type-specific fields for BEFORE_AFTER
  before_image?: string;
  beforeImage?: string;
  after_image?: string;
  afterImage?: string;
  quote?: string;
  
  // Type-specific fields for MEDICAL_REVIEW
  calculatedValues?: {
    bmi?: string;
    currentWeight?: string;
    weeksToGoal?: string;
  };
  candidateStatement?: string;
  
  // Type-specific fields for PERFECT
  heading1?: string;
  dynamicSubtext?: string;
  subtext?: string;
}

export interface FormStepJson {
  id: string;
  slug: string;
  title?: string;
  heading1?: string;
  heading2?: string;
  subtext?: string | null;
  progressStepId: string; // Links to progress step slug
  order: number;
  renderCondition?: RenderConditionJson | null;
  showTrustBadges?: boolean;
  headingsInline?: boolean;
  questions: QuestionJson[];
  
  // Dynamic text fields
  dynamicTitle?: string;
  dynamicHeading1?: string;
  dynamicHeading2?: string;
  dynamicSubtext?: string;
  
  // Display value configuration (for calculated fields like BMI)
  displayValue?: {
    condition?: {
      field: string;
      operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan';
      value: any;
    }[];
    calculate?: {
      type: 'bmi' | 'weeksToGoal' | 'custom';
      fields?: string[];
      formula?: string;
    };
    template?: string;
  };
  
  // Legacy fields (not used in new structure but may exist)
  config?: any;
  is_template_step?: boolean;
  render_condition?: RenderConditionJson | null; // Support both formats
  step_order?: number; // Legacy, use order instead
}

export interface ProgressStepJson {
  id: string;
  slug: string;
  name: string;
  description: string;
  color: string;
  order: number;
  
  // Legacy fields (not used in new structure but may exist)
  quiz_id?: string;
  step_order?: number; // Legacy, use order instead
}

export interface QuizJsonQuiz {
  id: string;
  slug: string;
  name: string;
  description: string;
  version: string;
  metadata: {
    category: string;
    estimatedTime: string;
    targetAudience: string;
    compliance: string[];
  };
  productBundleIds?: string[];
  progressSteps: ProgressStepJson[];
  formSteps: FormStepJson[];
  
  // Legacy fields (not used in new structure but may exist)
  created_at?: string;
  organization_id?: string;
  product_bundle_ids?: string[]; // Support both formats
  quizFormStepMapping?: any[]; // Not used in new structure
  stepProgressMapping?: any[]; // Not used in new structure
}

export interface TemplateJson {
  id: string;
  slug: string;
  title: string;
  heading1?: string;
  subtext?: string;
  config?: any;
  is_template_step: boolean;
  render_condition?: RenderConditionJson | null;
  questions: QuestionJson[];
}

export interface QuizJson {
  quizzes: QuizJsonQuiz[];
  templates?: TemplateJson[];
  metadata?: {
    version: string;
    lastUpdated: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
