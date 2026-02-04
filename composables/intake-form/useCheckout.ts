import { ref, computed, toRef } from "vue";
import type { Product } from "~/types/intake-form/checkout";
import { products } from "~/data/intake-form/products";
import { usePatientForm } from "~/composables/intake-form/usePatientForm";

interface AddressInfo {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export function useCheckout() {
  // --- STATE ---
  const currentStep = ref(1);
  const selectedProduct = ref<Product | null>(null);
  const selectedPlan = ref<"monthly" | "semiannually">("monthly");
  const paymentData = ref<
    | { stripeSetupId: string | null; shippingAddress: AddressInfo | null }
    | null
    | undefined
  >(null);
  const isStripeLoaded = ref(false);
  const isProcessing = ref(false);
  const isSubmitting = ref(false);

  // Get form data from the form state instead of localStorage
  const { formAnswers } = usePatientForm();

  // --- COMPUTED ---
  const canProcessPayment = computed(() => {
    return selectedProduct.value && paymentData.value?.stripeSetupId;
  });

  const currentStepData = computed(() => {
    switch (currentStep.value) {
      case 1:
        return {
          title: "Select Product",
          description: "Choose your medication",
        };
      case 2:
        return { title: "Payment", description: "Complete your payment" };
      default:
        return { title: "", description: "" };
    }
  });

  // --- METHODS ---
  const selectProduct = (product: Product) => {
    if (isSubmitting.value) return;
    selectedProduct.value = product;
  };

  const selectPlan = (plan: "monthly" | "semiannually") => {
    if (isSubmitting.value) return;
    selectedPlan.value = plan;
  };

  const goBack = () => {
    if (isSubmitting.value) return;
    if (currentStep.value > 1) {
      currentStep.value--;
    } else {
      navigateTo("/");
    }
  };

  const prevStep = () => {
    if (isSubmitting.value) return;
    if (currentStep.value > 1) {
      currentStep.value--;
    }
  };

  const nextStep = () => {
    if (isSubmitting.value) return;

    if (currentStep.value === 1 && selectedProduct.value) {
      // Store selected product in localStorage
      if (process.client) {
        localStorage.setItem(
          "selectedProduct",
          JSON.stringify(selectedProduct.value),
        );
      }
      currentStep.value = 2;
    }
  };

  const loadStoredData = () => {
    if (process.client) {
      // Load selected product from localStorage
      const storedProduct = localStorage.getItem("selectedProduct");
      if (storedProduct) {
        selectedProduct.value = JSON.parse(storedProduct);
      }
    }

    // If no product selected, set default product
    if (!selectedProduct.value) {
      selectedProduct.value = products[0] || null;
    }
  };

  const handlePaymentUpdate = (
    data:
      | { stripeSetupId: string | null; shippingAddress: AddressInfo | null }
      | null
      | undefined,
  ) => {
    paymentData.value = data;
  };

  const resetStripeLoaded = () => {
    isStripeLoaded.value = false;
  };

  const setStripeLoaded = (loaded: boolean) => {
    isStripeLoaded.value = loaded;
  };

  const setSubmitting = (submitting: boolean) => {
    isSubmitting.value = submitting;
  };

  const setProcessing = (processing: boolean) => {
    isProcessing.value = processing;
  };

  const resetPaymentState = () => {
    if (paymentData.value) {
      paymentData.value = {
        stripeSetupId: null, // This triggers fresh SetupIntent creation
        shippingAddress: paymentData.value.shippingAddress
      };
    }
  };

  return {
    // State
    currentStep,
    selectedProduct,
    selectedPlan,
    paymentData,
    isStripeLoaded,
    isProcessing,
    isSubmitting,
    formAnswers,

    // Computed
    canProcessPayment,
    currentStepData,

    // Methods
    selectProduct,
    selectPlan,
    goBack,
    prevStep,
    nextStep,
    loadStoredData,
    handlePaymentUpdate,
    resetStripeLoaded,
    setStripeLoaded,
    setSubmitting,
    setProcessing,
    resetPaymentState,
  };
}
