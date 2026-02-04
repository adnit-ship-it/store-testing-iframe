import type { ValidationRule, Question } from "~/types/intake-form/form";

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Email validation regex pattern
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Converts a US phone number to international format (+1XXXXXXXXXX)
 * @param phoneNumber - The phone number to convert (can be in various formats)
 * @returns The phone number in international format or null if invalid
 */
export function convertToInternationalFormat(
  phoneNumber: string | null | undefined,
): string | null {
  if (!phoneNumber) return null;

  // Clean the phone number by removing all non-digit characters
  const cleanPhone = String(phoneNumber).replace(/\D/g, "");

  // Check if it's a valid US phone number (10 digits)
  if (cleanPhone.length !== 10) {
    return null;
  }

  // Convert to international format (+1XXXXXXXXXX)
  return `+1${cleanPhone}`;
}

/**
 * Validates a single value against a validation rule
 */
export function validateField(
  value: any,
  rule: ValidationRule,
  formAnswers?: any,
): ValidationResult {
  // Handle empty values
  const isEmpty = value === null || value === undefined || value === "";

  // Required validation
  if (rule.type === "required") {
    if (isEmpty) {
      return { isValid: false, message: rule.message };
    }
    return { isValid: true };
  }

  // Skip other validations if value is empty (unless required)
  if (isEmpty) {
    return { isValid: true };
  }

  // Email validation
  if (rule.type === "email") {
    if (!EMAIL_REGEX.test(String(value))) {
      return { isValid: false, message: rule.message };
    }
    return { isValid: true };
  }

  // Phone validation
  if (rule.type === "phone") {
    // Clean the phone number by removing all non-digit characters
    const cleanPhone = String(value).replace(/\D/g, "");

    // Check if it's a valid US phone number (10 digits)
    if (cleanPhone.length !== 10) {
      return { isValid: false, message: rule.message };
    }

    return { isValid: true };
  }

  // Min length validation
  if (rule.type === "minLength" && rule.value !== undefined) {
    if (String(value).length < rule.value) {
      return { isValid: false, message: rule.message };
    }
    return { isValid: true };
  }

  // Max length validation
  if (rule.type === "maxLength" && rule.value !== undefined) {
    if (String(value).length > rule.value) {
      return { isValid: false, message: rule.message };
    }
    return { isValid: true };
  }

  // Pattern validation
  if (rule.type === "pattern" && rule.value) {
    const regex = new RegExp(rule.value);
    if (!regex.test(String(value))) {
      return { isValid: false, message: rule.message };
    }
    return { isValid: true };
  }

  // Custom validation
  if (rule.type === "custom" && rule.validator) {
    // Pass both the value and formAnswers to the validator
    const isValid = formAnswers
      ? rule.validator(value, formAnswers)
      : rule.validator(value);
    if (!isValid) {
      return { isValid: false, message: rule.message };
    }
    return { isValid: true };
  }

  return { isValid: true };
}

/**
 * Validates a field against multiple validation rules
 */
export function validateFieldWithRules(
  value: any,
  rules: ValidationRule[],
  formAnswers?: any,
): ValidationResult {
  for (const rule of rules) {
    const result = validateField(value, rule, formAnswers);
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true };
}

/**
 * Predefined validation rules for common use cases
 */
export const ValidationRules = {
  required: (message: string = "This field is required"): ValidationRule => ({
    type: "required",
    message,
  }),

  email: (
    message: string = "Please enter a valid email address",
  ): ValidationRule => ({
    type: "email",
    message,
  }),

  phone: (
    message: string = "Please enter a valid US phone number (e.g., 123-456-7890 or (123) 456-7890)",
  ): ValidationRule => ({
    type: "phone",
    message,
  }),

  minLength: (length: number, message?: string): ValidationRule => ({
    type: "minLength",
    value: length,
    message: message || `Must be at least ${length} characters long`,
  }),

  maxLength: (length: number, message?: string): ValidationRule => ({
    type: "maxLength",
    value: length,
    message: message || `Must be no more than ${length} characters long`,
  }),

  pattern: (regex: string, message: string): ValidationRule => ({
    type: "pattern",
    value: regex,
    message,
  }),

  custom: (
    validator: (value: any) => boolean,
    message: string,
  ): ValidationRule => ({
    type: "custom",
    validator,
    message,
  }),
};

/**
 * The core validation engine for the quiz form.
 * It takes a question object and an answer, and returns an error message if validation fails.
 *
 * @param {Question} question - The question object, containing the `validation` array from the database.
 * @param {any} answer - The current value of the answer for this question.
 * @returns {string | null} - An error message string if validation fails, otherwise `null`.
 */
export function validateAnswer(question: Question, answer: any): string | null {
  // If there are no validation rules, the answer is always valid.
  if (!question.validation || question.validation.length === 0) {
    return null;
  }

  // --- Rule: 'required' ---
  if (question.validation.includes('required')) {
    const isMissing = answer === null || answer === undefined || answer === '' || (Array.isArray(answer) && answer.length === 0);
    if (isMissing) {
      return 'This field is required';
    }
  }

  // --- Rule: 'email' ---
  // Only validate non-empty strings, as 'required' handles the empty case.
  if (question.validation.includes('email') && typeof answer === 'string' && answer.length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(answer)) {
      return 'Please enter a valid email';
    }
  }

  // --- Rule: 'phone' ---
  // Only validate non-empty strings.
  if (question.validation.includes('phone') && typeof answer === 'string' && answer.length > 0) {
    // This is a simple international regex. For production, a library is better.
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    // We'll remove common characters to test against the regex.
    const sanitizedAnswer = answer.replace(/[\s-()]/g, '');
    if (!phoneRegex.test(sanitizedAnswer)) {
      return 'Please enter a valid phone number';
    }
  }

  // If we've made it this far, the answer is valid.
  return null;
}
