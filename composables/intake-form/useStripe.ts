import { ref, computed } from "vue";
import { loadStripe } from "@stripe/stripe-js";

// Singleton pattern to ensure all components access the same instance
let stripeInstance = ref<any>(null);
let elementsInstance = ref<any>(null);
let clientSecretInstance = ref<string | null>(null);
let isLoadingInstance = ref(false);
let errorInstance = ref<string | null>(null);
let isReadyInstance = ref(false);
let isInitializingInstance = ref(false);

export const useStripe = () => {
  // Use computed properties that automatically update when singletons change
  const stripe = computed(() => stripeInstance.value);
  const elements = computed(() => elementsInstance.value);
  const clientSecret = computed(() => clientSecretInstance.value);
  const isLoading = computed(() => isLoadingInstance.value);
  const error = computed(() => errorInstance.value);
  const isReady = computed(() => isReadyInstance.value);

  const initializeStripe = async (forceRefresh = false) => {
    // Prevent multiple simultaneous initializations
    if (isInitializingInstance.value) {
      return;
    }

    // If already initialized and not forcing refresh, return early
    if (!forceRefresh && isReadyInstance.value && elementsInstance.value) {
      return;
    }

    try {
      isInitializingInstance.value = true;
      isLoadingInstance.value = true;
      errorInstance.value = null;
      isReadyInstance.value = false;

      // Clean up existing elements if forcing refresh
      if (forceRefresh && elementsInstance.value) {
        try {
          const addressElement = elementsInstance.value.getElement("address");
          const paymentElement = elementsInstance.value.getElement("payment");
          if (addressElement) addressElement.destroy();
          if (paymentElement) paymentElement.destroy();
        } catch (error) {
          // Silent cleanup error
        }
      }

      // Load Stripe
      const config = useRuntimeConfig();

      // Check if publishable key is available
      if (!config.public.stripePublishableKey) {
        throw new Error(
          "Stripe publishable key is not configured. Please check your environment variables.",
        );
      }

      stripeInstance.value = await loadStripe(
        config.public.stripePublishableKey,
      );

      if (!stripeInstance.value) {
        throw new Error("Failed to load Stripe");
      }

      // Create SetupIntent on server
      const response = await $fetch<{ clientSecret: string }>(
        "/api/create-setup-intent",
        {
          method: "POST",
        },
      );

      clientSecretInstance.value = response.clientSecret;

      // Create Elements
      elementsInstance.value = stripeInstance.value.elements({
        clientSecret: clientSecretInstance.value,
      });

      // Mark as ready
      isReadyInstance.value = true;
      isLoadingInstance.value = false;
      isInitializingInstance.value = false;
    } catch (err: any) {
      errorInstance.value = "Failed to initialize payment system";
      isLoadingInstance.value = false;
      isReadyInstance.value = false;
      isInitializingInstance.value = false;
    }
  };

  const confirmSetup = async (elements?: any) => {
    if (!stripeInstance.value) {
      errorInstance.value = "Payment system not initialized";
      return null;
    }

    // Use provided elements or fall back to global elements
    const elementsToUse = elements || elementsInstance.value;
    if (!elementsToUse) {
      errorInstance.value = "Payment elements not available";
      return null;
    }

    try {
      isLoadingInstance.value = true;
      errorInstance.value = null;

      const result = await stripeInstance.value.confirmSetup({
        elements: elementsToUse,
        redirect: "if_required",
        confirmParams: {
          return_url: window.location.origin + "/welcome",
        },
      });

      isLoadingInstance.value = false;
      return result;
    } catch (err: any) {
      console.error("Error confirming setup:", err);
      errorInstance.value = "Payment setup failed";
      isLoadingInstance.value = false;
      return null;
    }
  };

  const refreshSetupIntent = async () => {
    await initializeStripe(true);
  };

  const cleanup = () => {
    if (elementsInstance.value) {
      try {
        // Get all elements and destroy them
        const addressElement = elementsInstance.value.getElement("address");
        const paymentElement = elementsInstance.value.getElement("payment");

        if (addressElement) {
          addressElement.destroy();
        }
        if (paymentElement) {
          paymentElement.destroy();
        }
      } catch (error) {
        // Silent cleanup error
      }
    }

    // Reset all instances
    elementsInstance.value = null;
    clientSecretInstance.value = null;
    isReadyInstance.value = false;
    isLoadingInstance.value = false;
    errorInstance.value = null;
    isInitializingInstance.value = false;
  };

  return {
    stripe,
    elements,
    clientSecret,
    isLoading,
    error,
    isReady,
    initializeStripe,
    refreshSetupIntent,
    confirmSetup,
    cleanup,
  };
};
