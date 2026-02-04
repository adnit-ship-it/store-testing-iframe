<template>
  <div class="min-h-screen bg-gray-50 pt-[83px] lg:pt-[68px]">
    <!-- Loading State -->
    <div
      v-if="isValidating"
      class="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50"
    >
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600">Validating quiz completion...</p>
      </div>
    </div>

    <!-- Validation Failed State -->
    <div
      v-if="!isValidating && !isFormValid"
      class="min-h-screen bg-gray-50 flex items-center justify-center"
    >
      <div class="text-center max-w-md mx-auto px-4">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <div class="text-red-600 mb-4">
            <svg
              class="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-red-800 mb-2">
            Quiz Not Completed
          </h3>
          <p class="text-red-700 mb-4">
            Please complete the intake form quiz before proceeding to checkout.
          </p>
          <button
            @click="navigateTo('/consultation')"
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go to Consultation Form
          </button>
        </div>
      </div>
    </div>

    <!-- Step Content -->
    <div
      v-if="!isValidating && isFormValid"
      class="max-w-[1248px] mx-auto py-8"
    >
      <!-- Step 1: Product Selection -->
      <IntakeFormCheckoutProductSelection
        v-if="currentStep === 0"
        :selectedProduct="selectedProduct"
        :selectedPlan="selectedPlan"
        :isSubmitting="isSubmitting"
        :formAnswers="formAnswers"
        :products="products"
        @select-product="handleProductSelected"
        @select-plan="handlePlanSelected"
      />

      <!-- Step 2: Payment -->
      <IntakeFormCheckoutPaymentStep
        v-if="currentStep === 1"
        :selectedProduct="selectedProduct"
        :selectedPlan="selectedPlan"
        :formAnswers="formAnswers"
        :paymentData="paymentData"
        :isStripeLoaded="isStripeLoaded"
        :isSubmitting="isSubmitting"
        @payment-update="handlePaymentUpdate"
        @contact-update="handleContactUpdate"
      />
    </div>

    <!-- Navigation -->
    <IntakeFormCheckoutNavigation
      v-if="!isValidating && isFormValid"
      :isBackDisabled="false"
      :isNextDisabled="!canGoNext"
      :isSubmitting="isSubmitting"
      :nextText="navigationButtonText"
      @next="nextStep"
      @back="previousStep"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from "vue";
import type { Product } from "~/types/intake-form/checkout";
import { getDefaultQuizId } from "~/lib/config/quiz";
import { useFormPersistence } from "~/composables/intake-form/useFormPersistence";
import { useStripe } from "~/composables/intake-form/useStripe";
import { useCRMStore } from "~/stores/crmStore";
import { usePagesStore } from "~/stores/pagesStore";

const pagesStore = usePagesStore();
const common = computed(() => pagesStore.pages?.common);

// State
const currentStep = ref(0);
const selectedProduct = ref<Product | null>(null);
const selectedPlan = ref<"monthly" | "semiannually">("monthly");
const isSubmitting = ref(false);
const formAnswers = ref<any>({});
const paymentData = ref<
  { stripeSetupId: string | null; shippingAddress: any | null } | undefined
>(undefined);
const isStripeLoaded = ref(false);
const isFormValid = ref(false);
const isValidating = ref(true);

// CRM Store
const crmStore = useCRMStore();

// Computed
// Transform CRM products to match Product interface
const products = computed(() => {
  const apiProducts = crmStore.getProductBundles;
  const route = useRoute();
  const productId = route.query.productId as string;
  
  let allProducts = [];
  
  if (apiProducts && apiProducts.length > 0) {
    allProducts = apiProducts.map((bundle) => ({
      id: bundle.id,
      // Store linkName as the monthly bundle ID for matching
      monthlyBundleId: bundle.productBundleIds?.monthly || bundle.linkName || bundle.id,
      name: bundle.name || 'Product',
      description: bundle.description || 'Product description',
      img: bundle.imageUrl || '/assets/images/products/default.png',
      prices: {
        monthly: bundle.price || 299,
        semiannually: Math.round((bundle.price || 299) * 0.8) // 20% discount for semiannual
      },
      // Store quizId for filtering products by quiz
      quizId: bundle.quizId || 
              bundle.formVersion?.forms?.[0]?.slug || 
              bundle.formVersion?.forms?.[0]?.id ||
              getDefaultQuizId() // Default to weight-loss quiz if not specified
    }));
  } else {
    // Fallback products if no CRM data
    // These are weight-loss products, so they use the default quiz
    const defaultQuizId = getDefaultQuizId();
    allProducts = [
      {
        id: "mounjaro-injection",
        name: "Mounjaro Injection",
        description: "Weekly GLP-1 medication for weight management",
        img: "/assets/images/products/mounjaro-injection.png",
        prices: { monthly: 299, semiannually: 239 },
        quizId: defaultQuizId
      },
      {
        id: "ozempic-injection", 
        name: "Ozempic Injection",
        description: "Weekly GLP-1 medication for weight management",
        img: "/assets/images/products/ozempic-injection.png",
        prices: { monthly: 249, semiannually: 199 },
        quizId: defaultQuizId
      },
      {
        id: "methylcobalamin-injection",
        name: "Methylcobalamin Injection", 
        description: "Vitamin B12 supplement injection",
        img: "/assets/images/products/methylcobalamin-injection.png",
        prices: { monthly: 89, semiannually: 71 },
        quizId: defaultQuizId
      }
    ];
  }
  
  // If productId is specified in URL, filter to show only that product
  // Match by monthlyBundleId (linkName) or id
  if (productId) {
    const filteredProduct = allProducts.find(p => 
      (p as any).monthlyBundleId === productId || p.id === productId
    );
    return filteredProduct ? [filteredProduct] : allProducts;
  }
  
  // If no productId, filter products by completed quiz
  // This shows only products associated with the quiz the user completed
  if (process.client) {
    // Find the completed quiz ID (for default quiz when no productId)
    let completedQuizId: string | null = null;
    
    // Check for non-product-specific quiz completion (default quiz)
    const defaultQuizId = getDefaultQuizId();
    const defaultQuizKey = `quiz_${defaultQuizId}_completed`;
    if (localStorage.getItem(defaultQuizKey) === 'true') {
      completedQuizId = defaultQuizId;
    } else {
      // Look for any completed quiz without productId
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('quiz_') && key.endsWith('_completed')) {
          // Skip product-specific keys (they have format quiz_${quizId}_${productId}_completed)
          const parts = key.split('_');
          if (parts.length === 3) { // quiz_${quizId}_completed (no productId)
            const isCompleted = localStorage.getItem(key) === 'true';
            if (isCompleted) {
              completedQuizId = parts[1]; // Extract quizId
              break;
            }
          }
        }
      }
    }
    
    // Filter products by quizId if we found a completed quiz
    if (completedQuizId) {
      const filteredByQuiz = allProducts.filter(p => 
        (p as any).quizId === completedQuizId
      );
      // Return filtered products if any match, otherwise return all (fallback)
      return filteredByQuiz.length > 0 ? filteredByQuiz : allProducts;
    }
  }
  
  // Return all products if no productId and no quiz filtering
  return allProducts;
});
const canGoNext = computed(() => {
  if (currentStep.value === 0) return selectedProduct.value !== null;
  if (currentStep.value === 1) {
    // Check if payment is complete
    const hasPayment =
      paymentData.value?.stripeSetupId && paymentData.value?.shippingAddress;
    return hasPayment;
  }
  return false;
});

const canGoBack = computed(() => true); // Always allow back button, redirect logic is handled in previousStep

// Computed property for navigation button text
const navigationButtonText = computed(() => {
  const common = pagesStore.pages?.common
  if (currentStep.value === 0) return common?.buttons?.next || "Next";
  if (currentStep.value === 1) return common?.buttons?.submitToProvider || "Submit to Provider";
  return common?.buttons?.next || "Next";
});

// Methods
const handleProductSelected = (product: Product) => {
  selectedProduct.value = product;
};

const handlePlanSelected = (plan: "monthly" | "semiannually") => {
  selectedPlan.value = plan;
};

const handlePaymentUpdate = (
  data:
    | { stripeSetupId: string | null; shippingAddress: any | null }
    | null
    | undefined,
) => {
  paymentData.value = data || undefined;
};

const handleContactUpdate = (data: {
  promoCode: string;
}) => {
  // Update form answers with promo code
  formAnswers.value = {
    ...formAnswers.value,
    promoCode: data.promoCode,
  };
};

// Helper function to collect file IDs from form answers for cleanup
const collectFileIds = (formAnswers: any): string[] => {
  const fileIds: string[] = [];
  
  for (const [key, value] of Object.entries(formAnswers)) {
    if (value && typeof value === 'object' && 'fileId' in value) {
      fileIds.push(value.fileId);
    }
  }
  
  return fileIds;
};

// Reset payment state to get fresh SetupIntent for retry
const resetPaymentState = async () => {
  if (paymentData.value) {
    paymentData.value = {
      stripeSetupId: null, // This triggers fresh SetupIntent creation
      shippingAddress: paymentData.value.shippingAddress
    };
  }
  
  // Force refresh the SetupIntent to get a new one
  await refreshSetupIntent();
};

const nextStep = async () => {
  if (currentStep.value === 0 && canGoNext.value) {
    currentStep.value++;
    // Scroll to top when moving to next step
    if (process.client) {
      nextTick(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  } else if (currentStep.value === 1 && canGoNext.value) {
    // Final step - submit to provider
    const { useToast } = await import("vue-toastification");
    const toast = useToast();
    toast.info("Starting form submission process...");
    await handleFinalSubmission();
  }
};

const handleFinalSubmission = async () => {
  if (!paymentData.value) return;

  try {
    isSubmitting.value = true;

    // If Stripe is not yet confirmed, we need to confirm it first
    if (paymentData.value.stripeSetupId === "ready") {
      // Show toast for payment processing
      const { useToast } = await import("vue-toastification");
      const toast = useToast();
      toast.info("Processing payment... Please wait.");

      // Trigger Stripe confirmation and wait for the result
      const confirmEvent = new CustomEvent("stripe-confirm-setup");
      window.dispatchEvent(confirmEvent);

      // Wait for the actual confirmation result instead of using a timeout
      try {
        await new Promise((resolve, reject) => {
          const successHandler = (event: Event) => {
            const customEvent = event as CustomEvent;
            window.removeEventListener(
              "stripe-confirmation-success",
              successHandler,
            );
            window.removeEventListener(
              "stripe-confirmation-error",
              errorHandler,
            );
            resolve(customEvent.detail.setupIntent);
          };

          const errorHandler = (event: Event) => {
            const customEvent = event as CustomEvent;
            window.removeEventListener(
              "stripe-confirmation-success",
              successHandler,
            );
            window.removeEventListener(
              "stripe-confirmation-error",
              errorHandler,
            );
            reject(
              new Error(
                customEvent.detail.error || "Payment confirmation failed",
              ),
            );
          };

          window.addEventListener(
            "stripe-confirmation-success",
            successHandler,
          );
          window.addEventListener("stripe-confirmation-error", errorHandler);

          // Add a reasonable timeout (15 seconds) for user experience
          setTimeout(() => {
            window.removeEventListener(
              "stripe-confirmation-success",
              successHandler,
            );
            window.removeEventListener(
              "stripe-confirmation-error",
              errorHandler,
            );
            reject(
              new Error("Payment confirmation timed out after 15 seconds"),
            );
          }, 15000);
        });

        toast.success("Payment confirmed successfully!");
      } catch (confirmationError: any) {
        // Reset payment state to get fresh SetupIntent for retry
        await resetPaymentState();
        
        throw new Error(
          `Payment confirmation failed: ${confirmationError.message}`,
        );
      }
    }

    // Show toast for form submission
    const { useToast } = await import("vue-toastification");
    const toast = useToast();
    toast.info("Building form payload and submitting to provider...");

    // Import the buildFormPayload utility and form steps
    const { buildFormPayload } = await import(
      "~/utils/intake-form/buildFormPayload"
    );
    const { allStepsMaster } = await import("~/data/intake-form/formSteps");

    // Build the payment info object
    const paymentInfo = {
      paymentDescription: `${selectedProduct.value?.name} - ${selectedPlan.value} plan`,
      paymentAmount: selectedProduct.value?.prices[selectedPlan.value] || 0,
      promoCode: formAnswers.value?.promoCode || "",
    };

    // Build the complete form payload
    const formPayload = await buildFormPayload(
      allStepsMaster,
      formAnswers.value,
      paymentData.value.stripeSetupId!,
      paymentData.value.shippingAddress!,
      paymentInfo,
      useRuntimeConfig(),
    );

    // Show toast for API submission
    toast.info("Submitting form to provider...");

    // Submit the form to the provider via our API endpoint
    const response = await $fetch<{
      success: boolean;
      data: { caseId: string; formResponseId: string };
    }>("/api/submit-form", {
      method: "POST",
      body: formPayload,
    });

    // Show success toast
    toast.success("Form submitted successfully!");

    // Clean up temporary files after successful submission
    try {
      const fileIds = collectFileIds(formAnswers.value);
      if (fileIds.length > 0) {
        await $fetch("/api/cleanup-files", {
          method: "POST",
          body: { fileIds }
        });
      }
    } catch (cleanupError) {
      // Don't fail the entire process if cleanup fails
    }

    // Redirect to welcome page on success with reference IDs
    await navigateTo({
      path: "/welcome",
      query: {
        caseId: response.data?.caseId,
        formResponseId: response.data?.formResponseId,
      },
    });
  } catch (error: any) {
    // Reset payment state to get fresh SetupIntent for retry
    await resetPaymentState();

    // Show error toast
    const { useToast } = await import("vue-toastification");
    const toast = useToast();

    const errorMessage =
      error.message ||
      "An error occurred while submitting the form. Please try again.";
    toast.error(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
};

const previousStep = () => {
  if (currentStep.value === 0) {
    // If on first step, redirect to consultation with productId
    if (process.client) {
      const route = useRoute();
      const productId = route.query.productId as string;
      const consultationUrl = productId ? `/consultation?productId=${productId}` : '/consultation';
      navigateTo(consultationUrl);
    }
  } else if (canGoBack.value) {
    currentStep.value--;
    // Scroll to top when moving to previous step
    if (process.client) {
      nextTick(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }
};

// Initialize with first product as default
onMounted(async () => {
  // Fetch CRM data if not already loaded
  if (crmStore.getProductBundles.length === 0) {
    await crmStore.fetchCRMData();
  }
  
  // Set default product based on productId from URL or first available
  const route = useRoute();
  const productId = route.query.productId as string;
  
  // Wait for products to be computed
  await nextTick();
  
  if (productId) {
    // Match by monthlyBundleId (linkName) or id
    const product = products.value.find(p => 
      (p as any).monthlyBundleId === productId || p.id === productId
    );
    // Auto-select the product if productId is in URL
    if (product) {
      selectedProduct.value = product;
    } else {
      selectedProduct.value = products.value[0] || null;
    }
  } else {
    selectedProduct.value = products.value[0] || null;
  }
  
  // Validate form completion after product is selected
  // This ensures we check for the quiz associated with the selected product
  await validateFormCompletion();
  
  // Initialize Stripe
  await initializeStripe();
});

// Form validation function
const validateFormCompletion = async () => {
  if (!process.client) return;

  try {
    isValidating.value = true;

    // Get productId from route parameters or selected product
    // Use monthlyBundleId (linkName) if available, otherwise use id
    const route = useRoute();
    const productIdFromQuery = route.query.productId as string;
    const activeProductId = productIdFromQuery || 
      (selectedProduct.value as any)?.monthlyBundleId || 
      selectedProduct.value?.id;

    // If no productId, check for default quiz completion
    // This allows users who completed the default quiz to proceed
    if (!activeProductId) {
      const defaultQuizId = getDefaultQuizId();
      const defaultQuizKey = `quiz_${defaultQuizId}_completed`;
      const isDefaultQuizCompleted = localStorage.getItem(defaultQuizKey) === 'true';
      
      if (isDefaultQuizCompleted) {
        // Default quiz is completed, allow checkout
        const dataKey = `quiz_${defaultQuizId}_completed_data`;
        const data = localStorage.getItem(dataKey);
        if (data) {
          try {
            formAnswers.value = JSON.parse(data);
            isFormValid.value = true;
            isValidating.value = false;
            return;
          } catch (parseError) {
            console.warn('Failed to parse completed quiz data:', parseError);
          }
        }
        // Even without data, allow checkout if quiz is completed
        isFormValid.value = true;
        isValidating.value = false;
        return;
      }
      
      // No product selected and no default quiz completed, redirect to consultation
      await navigateTo('/consultation');
      return;
    }

    // Check for quiz completion associated with the active product
    // We need to find the quiz that was completed for this specific product
    let isProductQuizCompleted = false;
    let completedQuizData = null;
    let completedQuizId = null;
    
    // First, try to find product-specific quiz completion
    // Look for keys like: quiz_${quizId}_${productId}_completed
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('quiz_') && key.endsWith('_completed')) {
        // Check if this is a product-specific quiz completion
        const productSpecificPattern = `_${activeProductId}_completed`;
        if (key.endsWith(productSpecificPattern)) {
          const isCompleted = localStorage.getItem(key) === 'true';
          if (isCompleted) {
            // Extract quizId from key: quiz_${quizId}_${productId}_completed
            const quizId = key.replace('quiz_', '').replace(`_${activeProductId}_completed`, '');
            isProductQuizCompleted = true;
            completedQuizId = quizId;
            
            // Try to get the completed data
            const dataKey = `quiz_${quizId}_${activeProductId}_completed_data`;
            const data = localStorage.getItem(dataKey);
            if (data) {
              try {
                completedQuizData = JSON.parse(data);
                break; // Found the quiz for this product
              } catch (parseError) {
                console.warn('Failed to parse completed quiz data:', parseError);
              }
            }
          }
        }
      }
    }

    // If no product-specific quiz found, check for non-product-specific quiz (backward compatibility)
    if (!isProductQuizCompleted) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('quiz_') && key.endsWith('_completed')) {
          // Skip product-specific keys (they have format quiz_${quizId}_${productId}_completed)
          if (key.includes('_') && key.split('_').length > 3) {
            continue; // This is likely a product-specific key
          }
          
          const quizId = key.replace('quiz_', '').replace('_completed', '');
          const isCompleted = localStorage.getItem(key) === 'true';
          
          if (isCompleted) {
            isProductQuizCompleted = true;
            completedQuizId = quizId;
            
            // Try to get the completed data
            const data = localStorage.getItem(`quiz_${quizId}_completed_data`);
            if (data) {
              try {
                completedQuizData = JSON.parse(data);
                break; // Use the first completed quiz data we find
              } catch (parseError) {
                console.warn('Failed to parse completed quiz data:', parseError);
              }
            }
          }
        }
      }
    }

    if (!isProductQuizCompleted) {
      // No quiz completed for this product, redirect to consultation with productId
      const consultationUrl = activeProductId ? `/consultation?productId=${activeProductId}` : '/consultation';
      await navigateTo(consultationUrl);
      return;
    }

    // Quiz is completed for this product, load the completed form data
    if (completedQuizData) {
      formAnswers.value = completedQuizData;
    } else {
      // Fallback to persistence data if completed data not found
      const { loadFormData } = useFormPersistence();
      const savedFormData = loadFormData();
      if (savedFormData) {
        formAnswers.value = savedFormData;
      }
    }

    isFormValid.value = true;
  } catch (error) {
    console.error('Form validation error:', error);
    const route = useRoute();
    const productId = route.query.productId as string;
    const consultationUrl = productId ? `/consultation?productId=${productId}` : '/consultation';
    await navigateTo(consultationUrl);
  } finally {
    isValidating.value = false;
  }
};

// Watch for selected product changes and re-validate quiz completion
watch(
  selectedProduct,
  async (newProduct) => {
    if (newProduct && !isValidating.value) {
      // Re-validate when product changes to ensure the correct quiz is completed
      await validateFormCompletion();
    }
  },
  { immediate: false }
);

// Watch for route changes to auto-select product when productId changes
watch(
  () => useRoute().query.productId,
  async (productId) => {
    if (productId && products.value.length > 0) {
      const product = products.value.find(p => 
        (p as any).monthlyBundleId === productId || p.id === productId
      );
      if (product) {
        selectedProduct.value = product;
      }
    }
  },
  { immediate: false }
);

// Watch for Stripe loading state using the composable directly
const { isReady: stripeReady, initializeStripe, refreshSetupIntent } = useStripe();
watch(
  () => stripeReady.value,
  (ready) => {
    isStripeLoaded.value = ready;
  },
  { immediate: true },
);

// Watch for step changes to scroll to top
watch(
  currentStep,
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
</script>
