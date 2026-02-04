export interface FormAnswers {
  [key: string]: any;
}

// Conditional rendering types for database-driven rules
export interface Condition {
  field: string;
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan';
  value: any;
}

export interface RenderCondition {
  conditions: Condition[];
  logicalOperator: 'AND' | 'OR';
}

// Validation rule interface (legacy - for backward compatibility)
export interface ValidationRule {
  type:
    | "required"
    | "email"
    | "phone"
    | "minLength"
    | "maxLength"
    | "pattern"
    | "custom";
  message: string;
  value?: any; // For minLength, maxLength, pattern, etc.
  validator?: (value: any, formAnswers?: any) => boolean; // For custom validation with optional formAnswers
}

// New validation interface for Supabase integration
export interface Question {
  id: string;
  validation: string[] | null; // Array of validation rule strings from Supabase
  // ... other properties
}

// A discriminated union for our flexible question/input types.
export type FormQuestion =
  | {
      id: string;
      question?: string;
      displayQuestion?: string;
      required: boolean;
      type: "text" | "textarea" | "number" | "email" | "tel";
      placeholder?: string;
      apiType: "TEXT";
      dynamicText?: string;
      validation?: ValidationRule[] | string[]; // Support both legacy and new validation formats
      icon?: string;
    }
  | {
      id: string;
      question?: string;
      displayQuestion?: string;
      required: boolean;
      type: "DROPDOWN";
      options: (string | number)[] | ((answers: any) => (string | number)[]);
      optionLabels?: string[];
      apiType: "TEXT" | "DATE";
      dynamicText?: string;
      validation?: ValidationRule[] | string[]; // Support both legacy and new validation formats
    }
  | {
      id: string;
      question?: string;
      displayQuestion?: string;
      required: boolean;
      type: "SINGLESELECT" | "MULTISELECT" | "CHECKBOX";
      options: string[];
      displayAsRow?: boolean;
      apiType: "SINGLESELECT" | "MULTISELECT";
      dynamicText?: string;
      validation?: ValidationRule[] | string[]; // Support both legacy and new validation formats
      image?: string; // Optional image to display above the question
      optionImages?: string[]; // Optional array of images for each option
    }
  | {
      id: string;
      question?: string;
      displayQuestion?: string;
      required: boolean;
      type: "MARKETING";
      image?: string;
      dynamicText?: string;
      validation?: ValidationRule[] | string[]; // Support both legacy and new validation formats
      displayStatistics?: boolean;
    }
  | {
      id: string;
      question?: string;
      displayQuestion?: string;
      required: boolean;
      type: "BEFORE_AFTER";
      beforeImage?: string;
      afterImage?: string;
      quote?: string;
      dynamicText?: string;
      validation?: ValidationRule[] | string[]; // Support both legacy and new validation formats
    }
  | {
      id: string;
      question?: string;
      displayQuestion?: string;
      required: boolean;
      type: "FILE_INPUT";
      apiType: "FILE";
      dynamicText?: string;
      validation?: ValidationRule[] | string[]; // Support both legacy and new validation formats
    }
  | {
      id: string;
      question?: string;
      displayQuestion?: string;
      required: boolean;
      type: "MEDICAL_REVIEW";
      calculatedValues?: {
        bmi?: string;
        currentWeight?: string;
      
        weeksToGoal?: string;
      };
      candidateStatement: string;
    }
  | {
      id: string;
      question?: string;
      displayQuestion?: string;
      required: boolean;
      type: "PERFECT";
      heading1?: string;
      dynamicSubtext?: string;
      subtext?: string;
    }
  | {
      id: string;
      question?: string;
      displayQuestion?: string;
      required: boolean;
      type: "WEIGHT_SUMMARY";
    };

// Display value interface for calculated values
export interface DisplayValue {
  condition: (answers: FormAnswers) => boolean;
  calculate: (answers: FormAnswers) => string | number;
  template: string;
}

// Defines the structure of a single step/page in the form.
export interface FormStep {
  id: string; // Unique ID for each step
  title?: string;
  questionSubtext?: string;
  questions: FormQuestion[];
  heading1?: string;
  heading2?: string;
  subtext?: string;
  // Support both function-based (legacy) and data-driven (new) conditional rendering
  renderCondition?: (answers: FormAnswers) => boolean | RenderCondition;
  // Support for dynamic text in titles and headings
  dynamicTitle?: string;
  dynamicHeading1?: string;
  dynamicHeading2?: string;
  dynamicSubtext?: string;
  // Optional field to show trust badges at the bottom
  showTrustBadges?: boolean;
  // Optional field to render headings inline (without line break)
  headingsInline?: boolean;
  // Optional field for displaying calculated values
  displayValue?: DisplayValue;
}

// Progress step interface for the progress bar
export interface ProgressStep {
  id: string;
  name: string;
  description: string;
  color: string;
}

// Step progress mapping interface
export interface StepProgressMapping {
  stepId: string;
  progressStepId: string;
}

// Quiz configuration interface
export interface QuizConfig {
  id: string;
  name: string;
  description: string;
  version: string;
  progressSteps: ProgressStep[];
  stepProgressMapping: StepProgressMapping[];
  steps: FormStep[];
  metadata: {
    category: string;
    estimatedTime: string;
    targetAudience: string;
    compliance: string[];
  };
}
