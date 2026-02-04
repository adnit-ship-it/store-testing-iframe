import type { FormAnswers } from "~/types/intake-form/form";

export interface CalculatedValues {
  bmi: string;
  currentWeight: string;
  goalWeight: string;
  weeksToGoal: string;
}

export interface PaceValues {
  weeklyLossRange: string;
  timeToGoal: string;
}

// Constants for pace calculations - Realistic for GLP-1 medications
const LOWER_PERCENT_LOSS = 0.15; // 16% - typical GLP-1 weight loss
const UPPER_PERCENT_LOSS = 0.2; // 22% - upper range for GLP-1 medications
const WEEKS_IN_YEAR = 52;

export function calculatePaceValues(
  currentWeight: number,
  goalWeight: number,
): PaceValues {
  // Calculate total expected loss over a year
  const lowerBoundTotalLoss = currentWeight * LOWER_PERCENT_LOSS;
  const upperBoundTotalLoss = currentWeight * UPPER_PERCENT_LOSS;

  // Convert to weekly range
  const lowerBoundWeeklyLoss = lowerBoundTotalLoss / WEEKS_IN_YEAR;
  const upperBoundWeeklyLoss = upperBoundTotalLoss / WEEKS_IN_YEAR;

  // Calculate time to goal
  const totalWeightToLose = currentWeight - goalWeight;
  const averageWeeklyLoss = (lowerBoundWeeklyLoss + upperBoundWeeklyLoss) / 2;
  const timeInWeeks = totalWeightToLose / averageWeeklyLoss;

  return {
    weeklyLossRange: `${lowerBoundWeeklyLoss.toFixed(
      2,
    )} to ${upperBoundWeeklyLoss.toFixed(2)}`,
    timeToGoal: Math.round(timeInWeeks).toString(),
  };
}

// Example: calculatePaceValues(220, 155) returns:
// { weeklyLossRange: "0.55 to 0.76", timeToGoal: "99" }

export function calculateMedicalValues(
  formAnswers: FormAnswers,
): CalculatedValues {
  // Extract values from form answers
  const feet = formAnswers.feet;
  const inches = formAnswers.inches;
  const currentWeight = formAnswers.weight;
  const goalWeight = formAnswers.goalWeight;

  // Calculate height in inches
  const heightInInches = feet * 12 + inches;
  const heightInMeters = heightInInches * 0.0254;

  // Calculate weight in kg
  const weightInKg = currentWeight * 0.453592;

  // Calculate BMI: weight (kg) / height (m)²
  const bmi = weightInKg / (heightInMeters * heightInMeters);

  // Calculate weight loss needed
  const weightLossNeeded = currentWeight - goalWeight;

  // Calculate weeks to goal (assuming 3.83-5.1 lbs per week, using average of 4.465)
  const weeksToGoal = weightLossNeeded / 4.465;

  return {
    bmi: bmi.toFixed(2),
    currentWeight: `${currentWeight}LBS`,
    goalWeight: `${goalWeight}LBS WITHIN ${weeksToGoal.toFixed(2)} WEEKS`,
    weeksToGoal: weeksToGoal.toFixed(2),
  };
}
