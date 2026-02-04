import type { FormAnswers, FormStep } from "~/types/intake-form/form";
import { convertToInternationalFormat } from "~/utils/intake-form/validation";

interface PaymentInfo {
  paymentDescription?: string;
  paymentAmount?: number;
  shippingAddress?: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  stripeSetupId?: string;
  promoCode?: string;
}

interface FormPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob: string;
  gender: string;
  paymentDescription: string;
  paymentAmount: number;
  stripeSetupId: string;
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  formTitle: string;
  formDescription: string;
  questions: any[];
  promoCodes: Record<string, string>;
}

/**
 * Assembles the questions payload array for API submission
 */
export async function buildQuestionsPayload(
  allStepsMaster: FormStep[],
  formAnswers: FormAnswers,
): Promise<any[]> {
  const questionsPayload = [];

  for (const step of allStepsMaster) {
    for (const question of step.questions) {
      // Skip questions that are not meant for the API
      if (
        question.type === "MARKETING" ||
        question.type === "BEFORE_AFTER" ||
        question.type === "MEDICAL_REVIEW" ||
        !("apiType" in question)
      ) {
        continue;
      }

      let answer = formAnswers[question.id];

      // Skip questions with no answer (except for required fields)
      if (answer === null || answer === undefined || answer === "") {
        continue;
      }

      // Create a base object for the question payload.
      const questionPayloadObject: {
        question: string;
        answer: any;
        type: string;
        options?: any[];
        required?: boolean;
      } = {
        question: question.question || `Question ${question.id}`,
        answer: answer,
        type: "apiType" in question ? question.apiType : "TEXT",
      };

      // Handle file conversion to base64 (after determining the type)
      if (questionPayloadObject.type === "FILE" && answer instanceof File) {
        const { convertFileToBase64 } = await import(
          "~/utils/intake-form/convertFile"
        );
        const base64Data = await convertFileToBase64(answer);
        questionPayloadObject.answer = [
          { name: answer.name, contentType: answer.type, data: base64Data },
        ];
      } else if (
        questionPayloadObject.type === "FILE" &&
        typeof answer === "object" &&
        answer.name &&
        answer.contentType &&
        answer.fileId
      ) {
        // Handle server-stored files - fetch data from server
        try {
          const fileResponse = await $fetch(`/api/get-file?fileId=${answer.fileId}`);
          if (fileResponse.success) {
            questionPayloadObject.answer = [
              {
                name: answer.name,
                contentType: fileResponse.contentType,
                data: fileResponse.data,
              },
            ];
          } else {
            throw new Error('Failed to fetch file from server');
          }
        } catch (error) {
          questionPayloadObject.answer = [];
        }
      } else if (
        questionPayloadObject.type === "FILE" &&
        typeof answer === "object" &&
        answer.name &&
        answer.contentType &&
        answer.data
      ) {
        // Handle legacy base64 files
        questionPayloadObject.answer = [
          {
            name: answer.name,
            contentType: answer.contentType,
            data: answer.data,
          },
        ];
      } else if (
        questionPayloadObject.type === "FILE" &&
        (answer === null || answer === undefined || answer === "")
      ) {
        // Handle empty file answers - set as empty array
        questionPayloadObject.answer = [];
      } else if (questionPayloadObject.type === "FILE") {
        // Handle case where file data is stored but missing the actual data content
        // This happens when the file was too large for storage and only metadata was saved
        if (typeof answer === "object" && answer.name && answer.contentType && !answer.data && !answer.fileId) {
          questionPayloadObject.answer = [];
        } else {
          questionPayloadObject.answer = [];
        }
      }

      // Ensure question field is never empty or null
      if (
        !questionPayloadObject.question ||
        questionPayloadObject.question.trim() === ""
      ) {
        questionPayloadObject.question = `Question ${question.id}`;
      }

      // Format answer based on question type
      if (questionPayloadObject.type === "FILE") {
        // File answers are already processed above
      } else if (questionPayloadObject.type === "SINGLESELECT") {
        questionPayloadObject.answer = Array.isArray(answer)
          ? answer[0]
          : answer;
      } else if (questionPayloadObject.type === "MULTISELECT") {
        questionPayloadObject.answer = Array.isArray(answer)
          ? answer
          : [answer];
      } else {
        if (Array.isArray(answer)) {
          questionPayloadObject.answer = answer.map((item: any) =>
            typeof item === "string" ? item : String(item),
          );
        } else {
          questionPayloadObject.answer =
            typeof answer === "string" ? answer : String(answer);
        }
      }

      // Add options if they exist and are valid
      if (
        "options" in question &&
        question.options &&
        Array.isArray(question.options) &&
        question.options.length > 0
      ) {
        questionPayloadObject.options = question.options.map((option) =>
          typeof option === "string" ? option : String(option),
        );
      }

      // Add required flag if specified
      if (question.required) {
        questionPayloadObject.required = true;
      }

      questionsPayload.push(questionPayloadObject);
    }
  }

  return questionsPayload;
}

/**
 * Builds the form payload for API submission
 */
export async function buildFormPayload(
  allStepsMaster: FormStep[],
  formAnswers: FormAnswers,
  finalSetupIntentId: string,
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  },
  paymentInfo?: PaymentInfo,
  config?: any,
): Promise<FormPayload> {
  // Build the questions payload first
  const questionsPayload = await buildQuestionsPayload(
    allStepsMaster,
    formAnswers,
  );

  // Safely construct the date of birth string
  const dob =
    formAnswers.dob ??
    (formAnswers.dobYear && formAnswers.dobMonth && formAnswers.dobDay
      ? `${formAnswers.dobYear}-${String(formAnswers.dobMonth).padStart(2, "0")}-${String(formAnswers.dobDay).padStart(2, "0")}`
      : "");

  const payload = {
    firstName: formAnswers.firstName ?? "",
    lastName: formAnswers.lastName ?? "",
    email: formAnswers.email ?? "",
    phoneNumber:
      convertToInternationalFormat(
        formAnswers.phoneNumber ?? formAnswers.phone ?? "",
      ) ?? "",
    dob,
    gender: formAnswers.gender?.toUpperCase() ?? "",
    paymentDescription: paymentInfo?.paymentDescription ?? "Form Submission",
    paymentAmount: paymentInfo?.paymentAmount ?? 0,
    stripeSetupId: finalSetupIntentId,
    shippingAddress,
    formTitle: config?.public?.formTitle ?? "Form Submission",
    formDescription: config?.public?.formDescription ?? "Form Description",
    questions: questionsPayload,
    promoCodes:
      paymentInfo?.promoCode && paymentInfo.promoCode.trim()
        ? { Promo: paymentInfo.promoCode.trim() }
        : {},
  };

  return payload;
}
