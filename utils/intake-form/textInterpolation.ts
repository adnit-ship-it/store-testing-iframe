import type {
  FormAnswers,
  FormStep,
  FormQuestion,
} from "~/types/intake-form/form";
import { calculatePaceValues } from "~/utils/intake-form/calculations";

/**
 * Safely evaluates a mathematical expression containing only numbers and operators (+, -, *, /)
 * This is a secure alternative to eval() that manually parses and evaluates expressions
 * @param expression - A string containing a mathematical expression (e.g., "150-120", "100+50*2")
 * @returns The numeric result of the evaluation
 * @throws Error if the expression is invalid or contains unsafe characters
 */
function safeEvaluateExpression(expression: string): number {
  // Remove all whitespace
  const cleaned = expression.replace(/\s/g, "");
  
  // Validate: only allow numbers, decimal points, and operators +, -, *, /
  if (!/^[\d+\-*/.()]+$/.test(cleaned)) {
    throw new Error("Expression contains invalid characters");
  }

  // Simple recursive descent parser for basic arithmetic
  // Handles: numbers, +, -, *, /, and parentheses
  let index = 0;

  function parseNumber(): number {
    let numStr = "";
    while (index < cleaned.length && /[\d.]/.test(cleaned[index])) {
      numStr += cleaned[index];
      index++;
    }
    const num = parseFloat(numStr);
    if (isNaN(num)) {
      throw new Error(`Invalid number at position ${index}`);
    }
    return num;
  }

  function parseExpression(): number {
    let result = parseTerm();
    while (index < cleaned.length) {
      const op = cleaned[index];
      if (op === "+") {
        index++;
        result += parseTerm();
      } else if (op === "-") {
        index++;
        result -= parseTerm();
      } else {
        break;
      }
    }
    return result;
  }

  function parseTerm(): number {
    let result = parseFactor();
    while (index < cleaned.length) {
      const op = cleaned[index];
      if (op === "*") {
        index++;
        result *= parseFactor();
      } else if (op === "/") {
        index++;
        const divisor = parseFactor();
        if (divisor === 0) {
          throw new Error("Division by zero");
        }
        result /= divisor;
      } else {
        break;
      }
    }
    return result;
  }

  function parseFactor(): number {
    if (index >= cleaned.length) {
      throw new Error("Unexpected end of expression");
    }

    if (cleaned[index] === "(") {
      index++; // consume '('
      const result = parseExpression();
      if (index >= cleaned.length || cleaned[index] !== ")") {
        throw new Error("Missing closing parenthesis");
      }
      index++; // consume ')'
      return result;
    }

    // Handle unary minus
    if (cleaned[index] === "-") {
      index++;
      return -parseFactor();
    }

    return parseNumber();
  }

  try {
    const result = parseExpression();
    if (index < cleaned.length) {
      throw new Error(`Unexpected character at position ${index}`);
    }
    return result;
  } catch (error) {
    throw new Error(`Failed to evaluate expression: ${error}`);
  }
}

/**
 * Interpolates dynamic text by replacing placeholders with form values
 * @param text - The text containing placeholders like {{goalWeight}} or {{currentWeight-goalWeight}}
 * @param formAnswers - The current form answers object
 * @returns The interpolated text with placeholders replaced
 */
export function interpolateText(
  text: string,
  formAnswers: FormAnswers,
): string {
  if (!text) return text;

  // Replace placeholders like {{goalWeight}} or {{currentWeight-goalWeight}} with actual values
  return text.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
    // Handle special calculated values
    if (
      expression === "weeklyLossRange" ||
      expression === "timeToGoal" ||
      expression === "nrOfWeeks"
    ) {
      const currentWeight = formAnswers.weight;
      const goalWeight = formAnswers.goalWeight;

      if (currentWeight && goalWeight) {
        const paceValues = calculatePaceValues(currentWeight, goalWeight);
        if (expression === "nrOfWeeks") {
          return paceValues.timeToGoal;
        }
        return paceValues[expression as keyof typeof paceValues];
      }
      return match; // Keep placeholder if values missing
    }

    // Check if it's a simple variable or a mathematical expression
    if (
      expression.includes("-") ||
      expression.includes("+") ||
      expression.includes("*") ||
      expression.includes("/")
    ) {
      // Handle mathematical expressions
      try {
        // Replace variables in the expression with their values
        let evaluatedExpression = expression;

        // Find all variable names in the expression
        const variables = expression.match(/\b\w+\b/g) || [];

        for (const variable of variables) {
          const value = formAnswers[variable];
          if (value !== null && value !== undefined) {
            // Replace the variable with its numeric value
            const regex = new RegExp(`\\b${variable}\\b`, "g");
            evaluatedExpression = evaluatedExpression.replace(
              regex,
              value.toString(),
            );
          } else {
            // If any variable is missing, return the original placeholder
            return match;
          }
        }

        // Evaluate the mathematical expression safely
        const result = safeEvaluateExpression(evaluatedExpression);
        return Math.abs(result).toString(); // Return absolute value as string
      } catch (error) {
        // If evaluation fails, return the original placeholder
        return match;
      }
    } else {
      // Handle simple variable replacement
      const value = formAnswers[expression];

      // Handle different value types
      if (value === null || value === undefined) {
        return match; // Keep the placeholder if value doesn't exist
      }

      if (typeof value === "number") {
        return value.toString();
      }

      if (typeof value === "string") {
        return value;
      }

      if (Array.isArray(value)) {
        return value.join(", ");
      }

      // For other types, convert to string
      return String(value);
    }
  });
}

/**
 * Interpolates all dynamic text in a form step
 * @param step - The form step object
 * @param formAnswers - The current form answers
 * @returns A new step object with interpolated text
 */
export function interpolateFormStep(
  step: FormStep,
  formAnswers: FormAnswers,
): FormStep {
  const interpolatedStep = { ...step };

  // Interpolate step-level text
  if (step.title) {
    interpolatedStep.title = interpolateText(step.title, formAnswers);
  }
  if (step.dynamicTitle) {
    interpolatedStep.title = interpolateText(step.dynamicTitle, formAnswers);
  }
  if (step.heading) {
    interpolatedStep.heading = interpolateText(step.heading, formAnswers);
  }
  if (step.dynamicHeading) {
    interpolatedStep.heading = interpolateText(
      step.dynamicHeading,
      formAnswers,
    );
  }
  if (step.subtext) {
    interpolatedStep.subtext = interpolateText(step.subtext, formAnswers);
  }
  if (step.dynamicSubtext) {
    interpolatedStep.subtext = interpolateText(
      step.dynamicSubtext,
      formAnswers,
    );
  }

  // Interpolate question-level text
  if (step.questions) {
    interpolatedStep.questions = step.questions.map(
      (question: FormQuestion) => {
        const interpolatedQuestion = { ...question };

        if ("dynamicText" in question && question.dynamicText) {
          interpolatedQuestion.question = interpolateText(
            question.dynamicText,
            formAnswers,
          );
        }

        // Handle dynamicSubtext for PERFECT questions
        if ("dynamicSubtext" in question && question.dynamicSubtext) {
          (interpolatedQuestion as any).dynamicSubtext = interpolateText(
            question.dynamicSubtext,
            formAnswers,
          );
        }

        return interpolatedQuestion;
      },
    );
  }

  return interpolatedStep;
}
