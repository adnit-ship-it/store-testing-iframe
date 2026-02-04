import { ref, computed, watch, type Ref } from "vue";
import type { FormAnswers, FormStep } from "~/types/intake-form/form";
import { validateFieldWithRules } from "~/utils/intake-form/validation";

const STORAGE_KEY = "medical-intake-form-data";
const STEP_STORAGE_KEY = "medical-intake-form-step";

export function useFormPersistence() {
  // --- STATE ---
  const isInitialized = ref(false);
  const lastCompletedStep = ref<number>(-1);

  // --- UTILITIES ---
  const saveToLocalStorage = (data: any, key: string) => {
    if (!process.client) return;

    try {
      // Check if data is too large for localStorage
      const dataString = JSON.stringify(data);
      const dataSize = new Blob([dataString]).size;
      const maxSize = 2 * 1024 * 1024; // Reduced to 2MB limit
      
      if (dataSize > maxSize) {
        sessionStorage.setItem(key, dataString);
        return;
      }
      
      localStorage.setItem(key, dataString);
    } catch (error) {
      // If localStorage fails, try sessionStorage as fallback
      try {
        const dataString = JSON.stringify(data);
        sessionStorage.setItem(key, dataString);
      } catch (sessionError) {
        // If both fail, try to save a minimal version without file data
        try {
          const minimalData = { ...data };
          // Remove all file data to create a minimal version
          Object.keys(minimalData).forEach(key => {
            if (minimalData[key] && typeof minimalData[key] === 'object' && 'data' in minimalData[key]) {
              minimalData[key] = {
                name: minimalData[key].name,
                contentType: minimalData[key].contentType,
                // Remove the data field completely
              };
            }
          });
          
          const minimalString = JSON.stringify(minimalData);
          localStorage.setItem(key, minimalString);
        } catch (minimalError) {
          // Ignore minimal save errors
        }
      }
    }
  };

  const loadFromLocalStorage = (key: string) => {
    if (!process.client) return null;

    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  };

  const clearLocalStorage = () => {
    if (!process.client) return;

    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STEP_STORAGE_KEY);
    } catch (error) {
      // Ignore clear errors
    }
  };

  // --- FORM DATA PERSISTENCE ---
  const saveFormData = (formAnswers: FormAnswers) => {
    // Create a sanitized version that excludes large file data
    const sanitizedData = sanitizeFormDataForStorage(formAnswers);
    saveToLocalStorage(sanitizedData, STORAGE_KEY);
  };

  const sanitizeFormDataForStorage = (formAnswers: FormAnswers): FormAnswers => {
    const sanitized: FormAnswers = {};
    
    for (const [key, value] of Object.entries(formAnswers)) {
      if (value === null || value === undefined) {
        sanitized[key] = value;
        continue;
      }
      
      // If it's a file object, only store metadata, not the actual file data
      if (value instanceof File) {
        sanitized[key] = {
          name: value.name,
          size: value.size,
          type: value.type,
          lastModified: value.lastModified,
          // Don't store the actual file data
        };
      }
      // If it's a file object with server-side storage (has fileId), only store metadata
      else if (typeof value === 'object' && value !== null && 'fileId' in value && 'name' in value) {
        sanitized[key] = {
          name: value.name,
          contentType: value.contentType,
          fileId: value.fileId,
          // Don't store the actual data - it's on the server
        };
      }
      // If it's a file object with base64 data (legacy), preserve the structure for API submission
      else if (typeof value === 'object' && value !== null && 'data' in value && 'name' in value) {
        sanitized[key] = {
          name: value.name,
          contentType: value.contentType,
          data: value.data, // Keep the actual data for API submission
          compressed: value.compressed || false,
        };
      }
      // For all other data types, store as-is
      else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  };

  const loadFormData = (): FormAnswers | null => {
    return loadFromLocalStorage(STORAGE_KEY);
  };

  // --- STEP PERSISTENCE ---
  const saveCurrentStep = (stepIndex: number) => {
    saveToLocalStorage(stepIndex, STEP_STORAGE_KEY);
  };

  const loadLastStep = (): number => {
    const step = loadFromLocalStorage(STEP_STORAGE_KEY);
    return step !== null ? step : -1;
  };

  // --- STEP COMPLETION LOGIC ---
  const isStepComplete = (
    step: FormStep,
    formAnswers: FormAnswers,
  ): boolean => {
    return step.questions.every((question) => {
      const answer = formAnswers[question.id];

      if (!question.required) {
        return true;
      }

      if (answer === null || answer === undefined || answer === "") {
        return false;
      }

      // For multiselect fields, check if array is empty
      if (question.type === "MULTISELECT") {
        return Array.isArray(answer) && answer.length > 0;
      }

      // For file inputs, check if file exists
      if (question.type === "FILE_INPUT") {
        const hasFile = answer !== null;
        return hasFile;
      }

      // For marketing, before/after, medical review, perfect, and weight summary pages, always consider them complete
      if (
        [
          "MARKETING",
          "BEFORE_AFTER",
          "MEDICAL_REVIEW",
          "PERFECT",
          "WEIGHT_SUMMARY",
        ].includes(question.type)
      ) {
        return true;
      }

      // For fields with validation rules, check if the value is valid
      if (
        "validation" in question &&
        question.validation &&
        question.validation.length > 0
      ) {
        const result = validateFieldWithRules(
          answer,
          question.validation,
          formAnswers,
        );
        return result.isValid;
      }

      return true;
    });
  };

  const getLastCompletedStepIndex = (
    allSteps: FormStep[],
    formAnswers: FormAnswers,
  ): number => {
    for (let i = 0; i < allSteps.length; i++) {
      const step = allSteps[i];
      if (step && !isStepComplete(step, formAnswers)) {
        return i - 1; // Return the last completed step
      }
    }
    return allSteps.length - 1; // All steps completed
  };

  const getNextIncompleteStepIndex = (
    allSteps: FormStep[],
    formAnswers: FormAnswers,
  ): number => {
    for (let i = 0; i < allSteps.length; i++) {
      const step = allSteps[i];
      if (step && !isStepComplete(step, formAnswers)) {
        return i; // Return the first incomplete step
      }
    }
    return allSteps.length - 1; // All steps completed, return last step
  };

  // --- INITIALIZATION ---
  const initializeFormData = (
    allSteps: FormStep[],
    defaultFormAnswers: FormAnswers,
  ): { formAnswers: FormAnswers; startingStep: number } => {
    // Always return default state for consistent server/client rendering
    return { formAnswers: { ...defaultFormAnswers }, startingStep: 0 };
  };

  // --- CLIENT-SIDE STATE RESTORATION ---
  const restoreClientState = (
    allSteps: FormStep[],
    formAnswers: FormAnswers,
    currentStepIndex: Ref<number>,
  ) => {
    if (!process.client) return;

    const savedData = loadFormData();

    if (savedData) {
      // Update form answers with saved data
      Object.assign(formAnswers, savedData);

      // Filter steps based on conditions (same logic as in usePatientForm)
      const visibleSteps = allSteps.filter((step) => {
        if (step.renderCondition) {
          // Check if it's a function (legacy) or data object (new)
          if (typeof step.renderCondition === 'function') {
            // Legacy function-based conditional rendering
            return step.renderCondition(formAnswers);
          } else {
            // New data-driven conditional rendering using rules engine
            return shouldRenderStep(step.renderCondition, formAnswers);
          }
        }
        return true;
      });

      // Determine starting step based on completion status using visible steps
      const lastCompleted = getLastCompletedStepIndex(
        visibleSteps,
        formAnswers,
      );
      const nextIncomplete = getNextIncompleteStepIndex(
        visibleSteps,
        formAnswers,
      );

      currentStepIndex.value =
        lastCompleted === visibleSteps.length - 1
          ? visibleSteps.length - 1
          : nextIncomplete;

      lastCompletedStep.value = lastCompleted;
    } else {
      lastCompletedStep.value = -1;
    }

    isInitialized.value = true;
  };

  // --- AUTO-SAVE ---
  const setupAutoSave = (
    formAnswers: FormAnswers,
    currentStep: Ref<number>,
  ) => {
    if (!process.client) return;

    // Save form data whenever it changes
    watch(
      formAnswers,
      (newData) => {
        saveFormData(newData);
      },
      { deep: true },
    );

    // Save current step whenever it changes
    watch(currentStep, (newStep) => {
      saveCurrentStep(newStep);
    });
  };

  return {
    // State
    isInitialized,
    lastCompletedStep,

    // Core functions
    initializeFormData,
    restoreClientState,
    setupAutoSave,
    saveFormData,
    loadFormData,
    saveCurrentStep,
    loadLastStep,
    clearLocalStorage,
    sanitizeFormDataForStorage,

    // Utility functions
    isStepComplete,
    getLastCompletedStepIndex,
    getNextIncompleteStepIndex,
  };
}
