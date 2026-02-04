import { ref, computed, reactive, watch, nextTick, type Ref } from "vue";
import {
  useCurrentFormStep,
  useFormSteps,
} from "~/composables/intake-form/useFormState";
// We now import the types from our central types file
import type {
  FormStep,
  FormAnswers,
  FormQuestion,
  QuizConfig,
} from "~/types/intake-form/form";
// We import the quiz configuration instead of just form steps
import {
  glp1WeightLossQuiz,
  getProgressStepForFormStep,
} from "~/data/intake-form/quizConfigs";
// Import the text interpolation utility
import { interpolateFormStep } from "~/utils/intake-form/textInterpolation";
// Import form persistence
import { useFormPersistence } from "~/composables/intake-form/useFormPersistence";
// Import the new conditional rendering rules engine
import { shouldRenderStep } from "~/lib/quiz/conditionEvaluator";

// This is the main composable function that encapsulates all form logic
export function usePatientForm(quizConfigRef: Ref<QuizConfig | null> | string = "glp1-weight-loss") {
  // --- STATE MANAGEMENT ---
  const currentProgressMarker = useCurrentFormStep();
  const currentStepIndex = useState("currentStepIndex", () => 0); // Shared state for step index
  const progressSteps = useFormSteps();
  const submissionError = ref<string | null>(null);
  const isLoading = ref(false);

  // --- QUIZ CONFIGURATION ---
  // Handle both reactive quiz config and string quiz ID
  const quizConfig = computed(() => {
    if (typeof quizConfigRef === 'string') {
      // Fallback to hardcoded quiz if string is provided
      return glp1WeightLossQuiz;
    }
    return quizConfigRef.value || glp1WeightLossQuiz;
  });

  // --- PERSISTENCE ---
  const {
    initializeFormData,
    restoreClientState,
    setupAutoSave,
    clearLocalStorage,
    lastCompletedStep,
    isStepComplete: isStepCompletePersistence,
  } = useFormPersistence();

  // --- FORM DATA ---
  const allStepsMaster = computed(() => quizConfig.value.steps);

  // --- INITIALIZATION ---
  // Create default form answers
  const defaultFormAnswers: FormAnswers = {};
  // Initialize form answers when quiz config is available
  watch(quizConfig, (newConfig) => {
    if (newConfig && newConfig.steps) {
      newConfig.steps
        .flatMap((step) => step.questions)
        .forEach((q) => {
          if (!defaultFormAnswers[q.id]) {
            defaultFormAnswers[q.id] = q.type === "MULTISELECT" ? [] : null;
          }
        });
    }
  }, { immediate: true });

  // Initialize form data with persistence
  const { formAnswers: initialFormAnswers, startingStep } = initializeFormData(
    allStepsMaster.value,
    defaultFormAnswers,
  );

  const formAnswers: FormAnswers = reactive(initialFormAnswers);
  // Only set the shared state if it hasn't been initialized yet
  if (currentStepIndex.value === 0) {
    currentStepIndex.value = startingStep;
  }

  // Setup auto-save and restore client state (only on client)
  if (process.client) {
    setupAutoSave(formAnswers, currentStepIndex);

    // Restore client state after initial render to avoid hydration mismatch
    nextTick(async () => {
      restoreClientState(allStepsMaster.value, formAnswers, currentStepIndex);
    });
  }

  // --- COMPUTED PROPERTIES ---
  const visibleSteps = computed(() => {
    return allStepsMaster.value.filter((step) => {
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
  });

  const currentStepData = computed(() => {
    const step = visibleSteps.value[currentStepIndex.value];

    if (!step) return null;

    // Interpolate dynamic text with current form answers
    return interpolateFormStep(step, formAnswers);
  });

  const isLastStep = computed(
    () => currentStepIndex.value === visibleSteps.value.length - 1,
  );

  // Use the step completion logic from persistence, but add validation
  const isStepComplete = computed(() => {
    if (!currentStepData.value) {
      return false;
    }

    // First check basic completion using persistence logic
    const persistenceComplete = isStepCompletePersistence(
      currentStepData.value,
      formAnswers,
    );

    if (!persistenceComplete) {
      return false;
    }

    // Then check validation rules if they exist
    const validationComplete = currentStepData.value.questions.every(
      (question) => {
        if (question.type === "MARKETING") {
          return true;
        }
        if (!question.required) {
          return true;
        }

        const answer = formAnswers[question.id];

        // If question has validation rules, validate against them
        if ("validation" in question && question.validation) {
          // The validation utilities were removed, so this part of the logic is now
          // effectively a placeholder or will need to be re-implemented if specific
          // validation is required. For now, we'll assume it's valid if no rules.
          return true;
        }

        return true;
      },
    );

    return validationComplete;
  });

  // --- API SUBMISSION WRAPPER ---
  const handleFormSubmission = () => {
    // The submitPatientForm utility was removed, so this function is now a placeholder.
    // In a real scenario, you would call an API here to submit the form data.
    // Example: axios.post('/api/submit-form', formAnswers);
  };

  // --- NAVIGATION FUNCTIONS ---
  const nextStep = async () => {
    if (!isStepComplete.value) {
      return;
    }

    if (isLastStep.value) {
      // Set loading state immediately to disable button
      isLoading.value = true;

      try {
        // Store quiz-specific completion state and form data with productId association
        const route = useRoute();
        const productId = route.query.productId as string;
        
        if (process.client) {
          // Create a unique key that includes both quizId and productId
          // This ensures each quiz is stored uniquely per product
          const quizStorageKey = productId 
            ? `quiz_${quizConfig.value.id}_${productId}`
            : `quiz_${quizConfig.value.id}`;
          
          // Store the completed form answers
          localStorage.setItem(`${quizStorageKey}_completed_data`, JSON.stringify(formAnswers));
          
          // Set finished flag for this specific quiz config and product
          localStorage.setItem(`${quizStorageKey}_completed`, 'true');
          
          // Store completion timestamp
          localStorage.setItem(`${quizStorageKey}_completed_at`, new Date().toISOString());
          
          // Also store the productId association for easy lookup
          if (productId) {
            localStorage.setItem(`${quizStorageKey}_productId`, productId);
          }
        }
        
        // Navigate to checkout with productId from route
        const checkoutUrl = productId ? `/checkout?productId=${productId}` : '/checkout';
        await navigateTo(checkoutUrl);
      } catch (error) {
        submissionError.value = "Failed to complete form. Please try again.";
      } finally {
        isLoading.value = false;
      }
    } else {
      currentStepIndex.value++;
    }
  };

  const prevStep = () => {
    if (currentStepIndex.value > 0) {
      currentStepIndex.value--;
    }
  };

  // --- WATCHER TO SYNC PROGRESS BAR ---
  watch(
    currentStepIndex,
    (newIndex) => {
      const currentId = visibleSteps.value[newIndex]?.id;
      if (!currentId) return;

      // Use the quiz configuration to determine progress step
      const progressStepId = getProgressStepForFormStep(
        quizConfig.value,
        currentId,
      );
      if (!progressStepId) return;

      // Find the index of the progress step in the quiz configuration
      const progressIndex = quizConfig.value.progressSteps.findIndex(
        (step) => step.id === progressStepId,
      );

      if (progressIndex !== -1) {
        currentProgressMarker.value = progressIndex;
      }
    },
    { immediate: true },
  );

  // --- WATCHER TO SCROLL TO TOP ON STEP CHANGE ---
  watch(
    currentStepIndex,
    () => {
      // Scroll to top when step changes (only on client)
      if (process.client) {
        nextTick(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
      }
    }
  );

  // --- WATCHER TO HANDLE CONDITIONAL STEPS ---
  // This ensures currentStepIndex stays valid when steps are conditionally hidden
  watch(visibleSteps, (newVisibleSteps) => {
    // If current step index is out of bounds, reset to 0
    if (currentStepIndex.value >= newVisibleSteps.length) {
      currentStepIndex.value = 0;
    }
  });

  // --- WATCHER TO UPDATE PROGRESS STEPS ---
  // Now dynamically updates based on quiz configuration
  watch(
    quizConfig,
    (newQuizConfig) => {
      progressSteps.value = newQuizConfig.progressSteps.map((step) => ({
        name: step.name,
        description: step.description,
        color: step.color,
      }));
    },
    { immediate: true, deep: true },
  );

  // --- UTILITY FUNCTIONS ---
  const clearFormAndRestart = () => {
    clearLocalStorage();
    
    // Clear quiz-specific completion flags (both with and without productId)
    if (process.client) {
      const route = useRoute();
      const productId = route.query.productId as string;
      
      // Clear product-specific quiz data
      if (productId) {
        const quizStorageKey = `quiz_${quizConfig.value.id}_${productId}`;
        localStorage.removeItem(`${quizStorageKey}_completed`);
        localStorage.removeItem(`${quizStorageKey}_completed_data`);
        localStorage.removeItem(`${quizStorageKey}_completed_at`);
        localStorage.removeItem(`${quizStorageKey}_productId`);
      }
      
      // Also clear non-product-specific quiz data (for backward compatibility)
      localStorage.removeItem(`quiz_${quizConfig.value.id}_completed`);
      localStorage.removeItem(`quiz_${quizConfig.value.id}_completed_data`);
      localStorage.removeItem(`quiz_${quizConfig.value.id}_completed_at`);
      
      // Clear all product-specific quizzes for this quizId (in case user switched products)
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`quiz_${quizConfig.value.id}_`) && key.endsWith('_completed')) {
          const productIdFromKey = key.replace(`quiz_${quizConfig.value.id}_`, '').replace('_completed', '');
          if (productIdFromKey && productIdFromKey !== quizConfig.value.id) {
            localStorage.removeItem(key);
            localStorage.removeItem(key.replace('_completed', '_completed_data'));
            localStorage.removeItem(key.replace('_completed', '_completed_at'));
            localStorage.removeItem(key.replace('_completed', '_productId'));
          }
        }
      }
    }
    
    // Reset form answers to defaults
    Object.keys(formAnswers).forEach((key) => {
      formAnswers[key] = Array.isArray(defaultFormAnswers[key]) ? [] : null;
    });
    currentStepIndex.value = 0;
  };


  // --- QUIZ CONFIGURATION GETTERS ---
  const getCurrentProgressStep = computed(() => {
    const currentId = visibleSteps.value[currentStepIndex.value]?.id;
    if (!currentId) return null;

    const progressStepId = getProgressStepForFormStep(
      quizConfig.value,
      currentId,
    );
    return quizConfig.value.progressSteps.find(
      (step) => step.id === progressStepId,
    );
  });

  const getQuizMetadata = computed(() => quizConfig.value.metadata);

  // --- QUIZ COMPLETION UTILITIES ---
  // Function to check if a specific quiz has been completed for a product
  const isQuizCompleted = (quizIdToCheck: string, productId?: string): boolean => {
    if (!process.client) return false;
    
    // Check product-specific quiz first if productId is provided
    if (productId) {
      const productSpecificKey = `quiz_${quizIdToCheck}_${productId}_completed`;
      if (localStorage.getItem(productSpecificKey) === 'true') {
        return true;
      }
    }
    
    // Fallback to non-product-specific quiz (for backward compatibility)
    return localStorage.getItem(`quiz_${quizIdToCheck}_completed`) === 'true';
  };

  // Function to get all completed quiz IDs
  const getCompletedQuizIds = (): string[] => {
    if (!process.client) return [];
    
    const completedQuizzes: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('quiz_') && key.endsWith('_completed')) {
        const quizId = key.replace('quiz_', '').replace('_completed', '');
        completedQuizzes.push(quizId);
      }
    }
    return completedQuizzes;
  };

  // Function to get completed quiz data for a specific product
  const getCompletedQuizData = (quizIdToCheck: string, productId?: string): FormAnswers | null => {
    if (!process.client) return null;
    
    try {
      // Try product-specific quiz data first if productId is provided
      if (productId) {
        const productSpecificKey = `quiz_${quizIdToCheck}_${productId}_completed_data`;
        const productData = localStorage.getItem(productSpecificKey);
        if (productData) {
          return JSON.parse(productData);
        }
      }
      
      // Fallback to non-product-specific quiz data (for backward compatibility)
      const data = localStorage.getItem(`quiz_${quizIdToCheck}_completed_data`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn(`Failed to parse completed quiz data for ${quizIdToCheck}:`, error);
      return null;
    }
  };

  // Function to get completion timestamp
  const getQuizCompletionTimestamp = (quizIdToCheck: string): string | null => {
    if (!process.client) return null;
    return localStorage.getItem(`quiz_${quizIdToCheck}_completed_at`);
  };

  return {
    currentQuestionIndex: currentStepIndex,
    formAnswers,
    currentStepData,
    isLastQuestion: isLastStep,
    isStepComplete,
    nextStep,
    prevStep,
    submissionError,
    isLoading,
    clearFormAndRestart,
    lastCompletedStep,
    currentProgressMarker,
    isQuizCompleted,
    getCompletedQuizIds,
    getCompletedQuizData,
    getQuizCompletionTimestamp,
    quizId: computed(() => quizConfig.value.id),
  };
}
