import type { FormQuestion } from "~/types/intake-form/form";

// Import all the form input components
import FormInputsTextInput from "~/components/intake-form/inputs/TextInput.vue";
import FormInputsTextarea from "~/components/intake-form/inputs/Textarea.vue";
import FormInputsDropdown from "~/components/intake-form/inputs/Dropdown.vue";
import FormInputsSelect from "~/components/intake-form/inputs/Select.vue";
import FormInputsCheckbox from "~/components/intake-form/inputs/Checkbox.vue";
import FormInputsMarketing from "~/components/intake-form/inputs/Marketing.vue";
import FormInputsBeforeAfter from "~/components/intake-form/inputs/BeforeAfter.vue";
import FormInputsFileInput from "~/components/intake-form/inputs/FileInput.vue";
import FormInputsYesNoButtons from "~/components/intake-form/inputs/YesNoButtons.vue";
import FormInputsMedicalReview from "~/components/intake-form/inputs/MedicalReview.vue";
import FormInputsPerfect from "~/components/intake-form/inputs/Perfect.vue";
import FormInputsWeightSummary from "~/components/intake-form/WeightSummaryDisplay.vue";

// Component mapping registry
const componentMap: Record<string, any> = {
  text: FormInputsTextInput,
  textarea: FormInputsTextarea,
  number: FormInputsTextInput,
  email: FormInputsTextInput,
  tel: FormInputsTextInput,
  DROPDOWN: FormInputsDropdown,
  SINGLESELECT: FormInputsSelect,
  MULTISELECT: FormInputsSelect,
  CHECKBOX: FormInputsCheckbox,
  MARKETING: FormInputsMarketing,
  BEFORE_AFTER: FormInputsBeforeAfter,
  FILE_INPUT: FormInputsFileInput,
  YESNO: FormInputsYesNoButtons,
  MEDICAL_REVIEW: FormInputsMedicalReview,
  PERFECT: FormInputsPerfect,
  WEIGHT_SUMMARY: FormInputsWeightSummary,
};

/**
 * Determines which component to use for a given question
 * @param question - The form question to get a component for
 * @returns The Vue component to render
 */
export function getComponentForQuestion(question: FormQuestion) {
  // Check if this is a Yes/No question (SINGLESELECT with Yes/No options)
  if (
    question.type === "SINGLESELECT" &&
    question.options &&
    question.options.length === 2 &&
    question.options.includes("Yes") &&
    question.options.includes("No")
  ) {
    return FormInputsYesNoButtons;
  }

  // Default to the regular component mapping
  return (
    componentMap[question.type] || componentMap["text"] || FormInputsTextInput
  );
}

/**
 * Registers a new component type
 * @param type - The question type
 * @param component - The Vue component to use
 */
export function registerComponent(type: string, component: any) {
  componentMap[type] = component;
}

/**
 * Gets all registered component types
 * @returns Array of registered component types
 */
export function getRegisteredTypes(): string[] {
  return Object.keys(componentMap);
}
