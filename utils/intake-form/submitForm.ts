import type { FormAnswers, FormStep } from "~/types/intake-form/form";
import { buildFormPayload } from "./buildFormPayload";

/**
 * Test function to build and log the form payload (without submitting)
 */
export async function testFormPayload(
  allStepsMaster: FormStep[],
  formAnswers: FormAnswers,
  stripeSetupId: string = "test_setup_id",
  shippingAddress: {
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } = {
    addressLine1: "123 Test St",
    city: "Test City",
    state: "TS",
    postalCode: "12345",
    country: "US",
  },
) {
  try {
    const config = useRuntimeConfig();

    const payload = await buildFormPayload(
      allStepsMaster,
      formAnswers,
      stripeSetupId,
      shippingAddress,
      undefined, // paymentInfo
      config,
    );

    return payload;
  } catch (error) {
    console.error("Error building form payload:", error);
    throw error;
  }
}
