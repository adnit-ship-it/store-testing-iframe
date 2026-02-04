import type { QuizConfig } from "~/types/intake-form/form";
import { allStepsMaster, contactFormSteps, nadPlusFormSteps, sermorelinSteps, vitaminB12Steps, sexualHealthSteps, glutathioneSteps, hyperpigmentationSteps, antiAgingSteps, acneSteps, hairLossSteps } from "./formSteps";
import { loadQuizzesFromJson, getQuizBySlugFromJson } from "~/utils/intake-form/transformQuizJson";
import { validateQuizJson } from "~/utils/intake-form/validateQuizJson";
import type { QuizJsonQuiz } from "~/types/intake-form/quizJson";

// GLP-1 Weight Loss Intake Form Configuration
export const glp1WeightLossQuiz: QuizConfig = {
  id: "glp1-weight-loss",
  name: "GLP-1 Weight Loss Intake Form",
  description:
    "Comprehensive medical intake form for GLP-1 weight loss medication",
  version: "1.0.0",
  progressSteps: [
    {
      id: "start",
      name: "Start",
      description: "Basic information and eligibility",
      color: "#A75809",
    },
    {
      id: "preliminary",
      name: "Preliminary",
      description: "Motivation and medication history",
      color: "#A75809",
    },
    {
      id: "health",
      name: "Health",
      description: "Medical conditions and safety",
      color: "#A75809",
    },
    {
      id: "details",
      name: "Details",
      description: "Personal information and history",
      color: "#A75809",
    },
    {
      id: "eligibility",
      name: "Eligibility",
      description: "Final review and contact information",
      color: "#A75809",
    },
  ],
  stepProgressMapping: [
    // Start section
    { stepId: "heightWeight", progressStepId: "start" },
    { stepId: "goalWeight", progressStepId: "start" },
    { stepId: "triedInPast", progressStepId: "start" },
    { stepId: "gender", progressStepId: "start" },
    { stepId: "pregnancy", progressStepId: "start" },

    // Preliminary section
    { stepId: "marketing1", progressStepId: "preliminary" },
    { stepId: "marketing2", progressStepId: "preliminary" },
    { stepId: "marketing3", progressStepId: "preliminary" },
    { stepId: "motivation", progressStepId: "preliminary" },
    { stepId: "medication", progressStepId: "preliminary" },
    { stepId: "pace", progressStepId: "preliminary" },
    { stepId: "perfect", progressStepId: "preliminary" },

    // Health section
    { stepId: "marketing4", progressStepId: "health" },
    { stepId: "marketing5", progressStepId: "health" },
    { stepId: "healthConditions1", progressStepId: "health" },
    { stepId: "healthConditions2", progressStepId: "health" },

    // Details section
    { stepId: "surgicalHistory", progressStepId: "details" },
    { stepId: "marketing6", progressStepId: "details" },
    { stepId: "currentMedications", progressStepId: "details" },
    { stepId: "motivationLevel", progressStepId: "details" },

    // Eligibility section
    { stepId: "dob", progressStepId: "eligibility" },
    { stepId: "personalInfo", progressStepId: "eligibility" },
    { stepId: "contactInfo", progressStepId: "eligibility" },
  ],
  steps: [...allStepsMaster, ...contactFormSteps],
  metadata: {
    category: "medical",
    estimatedTime: "15-20 minutes",
    targetAudience: "Adults seeking weight loss medication",
    compliance: ["HIPAA", "FDA guidelines"],
  },
};

export const nadPlusQuiz: QuizConfig = {
  id: "nad-plus",
  name: "NAD+ Intake Form",
  description: "Complete medical intake form for NAD+ (nicotinamide adenine dinucleotide) therapy",
  version: "1.0.0",
  progressSteps: [
    {
      id: "start",
      name: "Start",
      description: "Weight loss goals and past initiatives",
      color: "#3B82F6",
    },
    {
      id: "preliminary",
      name: "Preliminary",
      description: "BMI, age, and GLP-1 medication status",
      color: "#3B82F6",
    },
    {
      id: "health",
      name: "Health",
      description: "Health screening and medical history",
      color: "#3B82F6",
    },
    {
      id: "details",
      name: "Details",
      description: "Current medications and surgical history",
      color: "#3B82F6",
    },
    {
      id: "eligibility",
      name: "Eligibility",
      description: "ID upload, consultation type, and consent",
      color: "#3B82F6",
    },
  ],
  stepProgressMapping: [
    // NAD+ Intake Form - 19 questions organized into 5 logical sections
    // Goals & History section - 3 questions
    { stepId: "physicalActivity", progressStepId: "start" },
    { stepId: "reproductiveStatus", progressStepId: "start" },
    { stepId: "medicalConditionsNad", progressStepId: "start" },

    // Basic Information section - 7 questions  
    { stepId: "heightWeight", progressStepId: "preliminary" },
    { stepId: "gender", progressStepId: "preliminary" },
    { stepId: "liverFunction", progressStepId: "preliminary" },
    { stepId: "heartFunction", progressStepId: "preliminary" },
    { stepId: "smokingStatus", progressStepId: "preliminary" },
    { stepId: "familyHistory", progressStepId: "preliminary" },
    { stepId: "primaryCareProvider", progressStepId: "preliminary" },
    { stepId: "healthCheckup", progressStepId: "preliminary" },

    // Health section - 3 questions
    { stepId: "checkupRecommendation", progressStepId: "health" },
    { stepId: "allergiesNad", progressStepId: "health" },
    { stepId: "interestInNad", progressStepId: "health" },

    // Details section - 4 questions
    { stepId: "previousNadExperience", progressStepId: "details" },
    { stepId: "nadExperienceDetails", progressStepId: "details" },
    { stepId: "selfInjectionComfort", progressStepId: "details" },
    { stepId: "alternativeAdministration", progressStepId: "details" },

    // Final Steps section - 3 questions
    { stepId: "additionalInfo", progressStepId: "eligibility" },
    // Contact form steps
    { stepId: "dob", progressStepId: "eligibility" },
    { stepId: "personalInfo", progressStepId: "eligibility" },
    { stepId: "idUploadUniversal", progressStepId: "eligibility" },
  ],
  steps: [...nadPlusFormSteps, ...contactFormSteps],
  metadata: {
    category: "NAD+ Therapy",
    estimatedTime: "15-20 minutes",
    targetAudience: "Adults interested in NAD+ therapy for wellness and anti-aging",
    compliance: ["HIPAA Compliant", "Medical Intake Form"],
  },
};

export const sermorelinQuiz: QuizConfig = {
  id: "sermorelin",
  name: "Sermorelin Intake Form",
  description: "Complete medical intake form for Sermorelin therapy",
  version: "1.0.0",
  progressSteps: [
    {
      id: "start",
      name: "Start",
      description: "Basic information and reproductive status",
      color: "#10B981",
    },
    {
      id: "preliminary",
      name: "Preliminary",
      description: "Benefits and medical screening",
      color: "#10B981",
    },
    {
      id: "health",
      name: "Health",
      description: "Medical conditions and medications",
      color: "#10B981",
    },
    {
      id: "eligibility",
      name: "Eligibility",
      description: "Additional info and ID upload",
      color: "#10B981",
    },
  ],
  stepProgressMapping: [
    // Sermorelin Intake Form - 9 questions organized into 4 logical sections
    // Start section - 1 question
    { stepId: "reproductiveStatus", progressStepId: "start" },
    { stepId: "desiredBenefits", progressStepId: "start" },
    { stepId: "medicalContraindications", progressStepId: "start" },

    // Preliminary section - 4 questions
    { stepId: "heightWeight", progressStepId: "preliminary" },
    { stepId: "gender", progressStepId: "preliminary" },

    // Health section - 3 questions
    { stepId: "currentMedicalConditions", progressStepId: "health" },
    { stepId: "currentMedications", progressStepId: "health" },
    { stepId: "allergies", progressStepId: "health" },

    // Eligibility section - 1 question
    { stepId: "additionalInfo", progressStepId: "eligibility" },
    // Contact form steps
    { stepId: "shipToMexico", progressStepId: "eligibility" },
    { stepId: "dob", progressStepId: "eligibility" },
    { stepId: "personalInfo", progressStepId: "eligibility" },
    { stepId: "idUploadUniversal", progressStepId: "eligibility" },
  ],
  steps: [...sermorelinSteps, ...contactFormSteps],
  metadata: {
    category: "Sermorelin Therapy",
    estimatedTime: "10-15 minutes",
    targetAudience: "Adults interested in Sermorelin therapy for anti-aging and wellness",
    compliance: ["HIPAA Compliant", "Medical Intake Form"],
  },
};

export const vitaminB12Quiz: QuizConfig = {
  id: "vitamin-b12",
  name: "Injectable Vitamin B12 Intake Form",
  description: "Complete medical intake form for Injectable Vitamin B12 therapy",
  version: "1.0.0",
  progressSteps: [
    {
      id: "start",
      name: "Start",
      description: "Basic information and B12 deficiency status",
      color: "#8B5CF6",
    },
    {
      id: "preliminary",
      name: "Preliminary",
      description: "Medical conditions and safety screening",
      color: "#8B5CF6",
    },
    {
      id: "health",
      name: "Health",
      description: "Medical conditions and medications",
      color: "#8B5CF6",
    },
    {
      id: "eligibility",
      name: "Eligibility",
      description: "Additional info, consultation type, and ID upload",
      color: "#8B5CF6",
    },
  ],
  stepProgressMapping: [
    // Injectable Vitamin B12 Intake Form - 9 questions organized into 4 logical sections
    // Start section - 1 question
    { stepId: "b12DeficiencyDiagnosis", progressStepId: "start" },

    // Preliminary section - 3 questions
    { stepId: "gender", progressStepId: "preliminary" },
    { stepId: "heightWeight", progressStepId: "preliminary" },
    { stepId: "medicalConditionsB12", progressStepId: "preliminary" },
    { stepId: "currentMedicalConditionsB12", progressStepId: "preliminary" },

    // Health section - 3 questions
    { stepId: "currentMedicationsB12", progressStepId: "health" },
    { stepId: "allergiesB12", progressStepId: "health" },
    { stepId: "additionalInfoB12", progressStepId: "health" },

    // Eligibility section - 1 question
    { stepId: "consultationTypeB12", progressStepId: "eligibility" },
    // Contact form steps
    { stepId: "shipToMexico", progressStepId: "eligibility" },
    { stepId: "dob", progressStepId: "eligibility" },
    { stepId: "personalInfo", progressStepId: "eligibility" },
    { stepId: "idUploadUniversal", progressStepId: "eligibility" },
  ],
  steps: [...vitaminB12Steps, ...contactFormSteps],
  metadata: {
    category: "Vitamin B12 Therapy",
    estimatedTime: "8-12 minutes",
    targetAudience: "Adults seeking Injectable Vitamin B12 therapy for deficiency or wellness",
    compliance: ["HIPAA Compliant", "Medical Intake Form"],
  },
};

export const sexualHealthQuiz: QuizConfig = {
  id: "sexual-health",
  name: "Sexual Health Intake Form",
  description: "Complete medical intake form for Sexual Health therapy",
  version: "1.0.0",
  progressSteps: [
    {
      id: "assessment",
      name: "Assessment",
      description: "ED symptoms and satisfaction assessment",
      color: "#8B5CF6",
    },
    {
      id: "medical-history",
      name: "Medical History",
      description: "Medical conditions and medication history",
      color: "#8B5CF6",
    },
    {
      id: "safety-screening",
      name: "Safety Screening",
      description: "Heart conditions, medications, and contraindications",
      color: "#8B5CF6",
    },
    {
      id: "treatment-selection",
      name: "Treatment Selection",
      description: "Education, preferences, and treatment options",
      color: "#8B5CF6",
    },
    {
      id: "contact-info",
      name: "Contact Info",
      description: "Personal information and contact details",
      color: "#8B5CF6",
    },
  ],
  stepProgressMapping: [
    // Sexual Health Intake Form - 23 questions organized into 5 logical sections
    
    // Assessment section - 7 questions (ED symptoms and satisfaction)
    { stepId: "confidenceRating", progressStepId: "assessment" },
    { stepId: "erectionFrequency", progressStepId: "assessment" },
    { stepId: "erectionDuration", progressStepId: "assessment" },
    { stepId: "erectionDifficulty", progressStepId: "assessment" },
    { stepId: "intercourseSatisfaction", progressStepId: "assessment" },
    { stepId: "edOnset", progressStepId: "assessment" },
    { stepId: "sexLifeSatisfaction", progressStepId: "assessment" },

    // Medical History section - 4 questions
    { stepId: "edMedicationHistory", progressStepId: "medical-history" },
    { stepId: "previousMedications", progressStepId: "medical-history" },
    { stepId: "bloodPressureHistory", progressStepId: "medical-history" },
    { stepId: "currentMedicalConditions", progressStepId: "medical-history" },

    // Safety Screening section - 6 questions
    { stepId: "heartConditions", progressStepId: "safety-screening" },
    { stepId: "symptoms", progressStepId: "safety-screening" },
    { stepId: "medicalConditions", progressStepId: "safety-screening" },
    { stepId: "recreationalDrugs", progressStepId: "safety-screening" },
    { stepId: "contraindicatedMedications", progressStepId: "safety-screening" },
    { stepId: "currentMedications", progressStepId: "safety-screening" },

    // Treatment Selection section - 6 questions
    { stepId: "allergies", progressStepId: "treatment-selection" },
    { stepId: "additionalInfo", progressStepId: "treatment-selection" },
    { stepId: "providerMessage", progressStepId: "treatment-selection" },
    { stepId: "edEducation", progressStepId: "treatment-selection" },
    { stepId: "treatmentPreferences", progressStepId: "treatment-selection" },
    { stepId: "treatmentOption", progressStepId: "treatment-selection" },

    // Contact Info section - 4 questions
    { stepId: "dob", progressStepId: "contact-info" },
    { stepId: "personalInfo", progressStepId: "contact-info" },
    { stepId: "contactInfo", progressStepId: "contact-info" },
  ],
  steps: [...sexualHealthSteps, ...contactFormSteps],
  metadata: {
    category: "Sexual Health Therapy",
    estimatedTime: "12-15 minutes",
    targetAudience: "Men seeking ED treatment and sexual health therapy",
    compliance: ["HIPAA Compliant", "Medical Intake Form"],
  },
};

export const glutathioneQuiz: QuizConfig = {
  id: "glutathione",
  name: "Glutathione Intake Form",
  description: "Complete medical intake form for Glutathione therapy",
  version: "1.0.0",
  progressSteps: [
    {
      id: "basic-info",
      name: "Basic Info",
      description: "Age, BMI calculation, and reproductive status",
      color: "#10B981",
    },
    {
      id: "health-assessment",
      name: "Health Assessment",
      description: "Medical conditions and glutathione interest",
      color: "#10B981",
    },
    {
      id: "medical-details",
      name: "Medical Details",
      description: "Current conditions, medications, and allergies",
      color: "#10B981",
    },
    {
      id: "final-steps",
      name: "Final Steps",
      description: "Additional information and ID upload",
      color: "#10B981",
    },
  ],
  stepProgressMapping: [
    // Glutathione Intake Form - 10 questions organized into 4 logical sections
    
    // Basic Info section - 3 questions
    { stepId: "age", progressStepId: "basic-info" },
    { stepId: "heightWeight", progressStepId: "basic-info" },
    { stepId: "reproductiveStatus", progressStepId: "basic-info" },

    // Health Assessment section - 2 questions
    { stepId: "medicalConditions", progressStepId: "health-assessment" },
    { stepId: "glutathioneInterest", progressStepId: "health-assessment" },

    // Medical Details section - 3 questions
    { stepId: "currentMedicalConditions", progressStepId: "medical-details" },
    { stepId: "currentMedications", progressStepId: "medical-details" },
    { stepId: "allergies", progressStepId: "medical-details" },

    // Final Steps section - 5 questions (2 glutathione + 3 contact form)
    { stepId: "additionalInfo", progressStepId: "final-steps" },
    { stepId: "idUpload", progressStepId: "final-steps" },
    { stepId: "dob", progressStepId: "final-steps" },
    { stepId: "personalInfo", progressStepId: "final-steps" },
    { stepId: "contactInfo", progressStepId: "final-steps" },
  ],
  steps: [...glutathioneSteps, ...contactFormSteps],
  metadata: {
    category: "Glutathione Therapy",
    estimatedTime: "8-12 minutes",
    targetAudience: "Adults seeking glutathione supplementation for wellness and anti-aging",
    compliance: ["HIPAA Compliant", "Medical Intake Form"],
  },
};

export const hyperpigmentationQuiz: QuizConfig = {
  id: "hyperpigmentation",
  name: "Skin Hyperpigmentation Intake Form",
  description: "Complete medical intake form for Skin Hyperpigmentation treatment",
  version: "1.0.0",
  progressSteps: [
    {
      id: "skin-assessment",
      name: "Skin Assessment",
      description: "Age, concerns, goals, and skin type assessment",
      color: "#F59E0B",
    },
    {
      id: "skin-conditions",
      name: "Skin Conditions",
      description: "Current skin conditions and treatment history",
      color: "#F59E0B",
    },
    {
      id: "medical-history",
      name: "Medical History",
      description: "Medical conditions, medications, and allergies",
      color: "#F59E0B",
    },
    {
      id: "skincare-routine",
      name: "Skincare Routine",
      description: "Current skincare products and routine",
      color: "#F59E0B",
    },
    {
      id: "final-steps",
      name: "Final Steps",
      description: "Additional information and ID upload",
      color: "#F59E0B",
    },
  ],
  stepProgressMapping: [
    // Skin Hyperpigmentation Intake Form - 16 questions organized into 5 logical sections
    
    // Skin Assessment section - 5 questions
    { stepId: "age", progressStepId: "skin-assessment" },
    { stepId: "hyperpigmentationConcerns", progressStepId: "skin-assessment" },
    { stepId: "skinGoals", progressStepId: "skin-assessment" },
    { stepId: "skinType", progressStepId: "skin-assessment" },
    { stepId: "skinSensitivity", progressStepId: "skin-assessment" },

    // Skin Conditions section - 3 questions
    { stepId: "tretinoinUsage", progressStepId: "skin-conditions" },
    { stepId: "tretinoinStrength", progressStepId: "skin-conditions" },
    { stepId: "skinConditions", progressStepId: "skin-conditions" },

    // Medical History section - 4 questions
    { stepId: "currentMedicalConditions", progressStepId: "medical-history" },
    { stepId: "topicalAllergies", progressStepId: "medical-history" },
    { stepId: "allergies", progressStepId: "medical-history" },
    { stepId: "currentMedications", progressStepId: "medical-history" },

    // Skincare Routine section - 2 questions
    { stepId: "skincareProducts", progressStepId: "skincare-routine" },
    { stepId: "skincareRoutine", progressStepId: "skincare-routine" },

    // Final Steps section - 5 questions (2 hyperpigmentation + 3 contact form)
    { stepId: "additionalInfo", progressStepId: "final-steps" },
    { stepId: "idUpload", progressStepId: "final-steps" },
    { stepId: "dob", progressStepId: "final-steps" },
    { stepId: "personalInfo", progressStepId: "final-steps" },
    { stepId: "contactInfo", progressStepId: "final-steps" },
  ],
  steps: [...hyperpigmentationSteps, ...contactFormSteps],
  metadata: {
    category: "Skin Hyperpigmentation Treatment",
    estimatedTime: "10-15 minutes",
    targetAudience: "Adults seeking treatment for skin hyperpigmentation and dark spots",
    compliance: ["HIPAA Compliant", "Medical Intake Form"],
  },
};

export const antiAgingQuiz: QuizConfig = {
  id: "anti-aging",
  name: "Skin Anti-Aging Intake Form",
  description: "Complete medical intake form for Skin Anti-Aging treatment",
  version: "1.0.0",
  progressSteps: [
    {
      id: "goals-assessment",
      name: "Goals Assessment",
      description: "Anti-aging goals and skin assessment",
      color: "#8B5CF6",
    },
    {
      id: "skin-conditions",
      name: "Skin Conditions",
      description: "Current skin conditions and treatment history",
      color: "#8B5CF6",
    },
    {
      id: "medical-history",
      name: "Medical History",
      description: "Medical conditions, medications, and allergies",
      color: "#8B5CF6",
    },
    {
      id: "skincare-routine",
      name: "Skincare Routine",
      description: "Current skincare products and routine",
      color: "#8B5CF6",
    },
    {
      id: "final-steps",
      name: "Final Steps",
      description: "Additional information and ID upload",
      color: "#8B5CF6",
    },
  ],
  stepProgressMapping: [
    // Skin Anti-Aging Intake Form - 15 questions organized into 5 logical sections
    
    // Goals Assessment section - 4 questions
    { stepId: "antiAgingGoals", progressStepId: "goals-assessment" },
    { stepId: "otherSkinGoals", progressStepId: "goals-assessment" },
    { stepId: "skinType", progressStepId: "goals-assessment" },
    { stepId: "skinSensitivity", progressStepId: "goals-assessment" },

    // Skin Conditions section - 3 questions
    { stepId: "tretinoinUsage", progressStepId: "skin-conditions" },
    { stepId: "tretinoinStrength", progressStepId: "skin-conditions" },
    { stepId: "skinConditions", progressStepId: "skin-conditions" },

    // Medical History section - 4 questions
    { stepId: "currentMedicalConditions", progressStepId: "medical-history" },
    { stepId: "topicalAllergies", progressStepId: "medical-history" },
    { stepId: "allergies", progressStepId: "medical-history" },
    { stepId: "currentMedications", progressStepId: "medical-history" },

    // Skincare Routine section - 2 questions
    { stepId: "skincareProducts", progressStepId: "skincare-routine" },
    { stepId: "skincareRoutine", progressStepId: "skincare-routine" },

    // Final Steps section - 5 questions (2 anti-aging + 3 contact form)
    { stepId: "additionalInfo", progressStepId: "final-steps" },
    { stepId: "idUpload", progressStepId: "final-steps" },
    { stepId: "dob", progressStepId: "final-steps" },
    { stepId: "personalInfo", progressStepId: "final-steps" },
    { stepId: "contactInfo", progressStepId: "final-steps" },
  ],
  steps: [...antiAgingSteps, ...contactFormSteps],
  metadata: {
    category: "Skin Anti-Aging Treatment",
    estimatedTime: "10-15 minutes",
    targetAudience: "Adults seeking anti-aging skin treatments and skincare solutions",
    compliance: ["HIPAA Compliant", "Medical Intake Form"],
  },
};

export const acneQuiz: QuizConfig = {
  id: "acne",
  name: "Acne Intake Form",
  description: "Complete medical intake form for Acne treatment",
  version: "1.0.0",
  progressSteps: [
    {
      id: "acne-assessment",
      name: "Acne Assessment",
      description: "Acne type, skin goals, and skin characteristics",
      color: "#EF4444",
    },
    {
      id: "skin-conditions",
      name: "Skin Conditions",
      description: "Current skin conditions and treatment history",
      color: "#EF4444",
    },
    {
      id: "medical-history",
      name: "Medical History",
      description: "Medical conditions, medications, and allergies",
      color: "#EF4444",
    },
    {
      id: "skincare-routine",
      name: "Skincare Routine",
      description: "Current skincare products and routine",
      color: "#EF4444",
    },
    {
      id: "final-steps",
      name: "Final Steps",
      description: "Additional information and ID upload",
      color: "#EF4444",
    },
  ],
  stepProgressMapping: [
    // Acne Intake Form - 15 questions organized into 5 logical sections
    
    // Acne Assessment section - 4 questions
    { stepId: "acneType", progressStepId: "acne-assessment" },
    { stepId: "otherSkinGoals", progressStepId: "acne-assessment" },
    { stepId: "skinType", progressStepId: "acne-assessment" },
    { stepId: "skinSensitivity", progressStepId: "acne-assessment" },

    // Skin Conditions section - 3 questions
    { stepId: "tretinoinUsage", progressStepId: "skin-conditions" },
    { stepId: "tretinoinStrength", progressStepId: "skin-conditions" },
    { stepId: "skinConditions", progressStepId: "skin-conditions" },

    // Medical History section - 4 questions
    { stepId: "currentMedicalConditions", progressStepId: "medical-history" },
    { stepId: "topicalAllergies", progressStepId: "medical-history" },
    { stepId: "allergies", progressStepId: "medical-history" },
    { stepId: "currentMedications", progressStepId: "medical-history" },

    // Skincare Routine section - 2 questions
    { stepId: "skincareProducts", progressStepId: "skincare-routine" },
    { stepId: "skincareRoutine", progressStepId: "skincare-routine" },

    // Final Steps section - 5 questions (2 acne + 3 contact form)
    { stepId: "additionalInfo", progressStepId: "final-steps" },
    { stepId: "idUpload", progressStepId: "final-steps" },
    { stepId: "dob", progressStepId: "final-steps" },
    { stepId: "personalInfo", progressStepId: "final-steps" },
    { stepId: "contactInfo", progressStepId: "final-steps" },
  ],
  steps: [...acneSteps, ...contactFormSteps],
  metadata: {
    category: "Acne Treatment",
    estimatedTime: "10-15 minutes",
    targetAudience: "Adults seeking acne treatment and skincare solutions",
    compliance: ["HIPAA Compliant", "Medical Intake Form"],
  },
};

export const hairLossQuiz: QuizConfig = {
  id: "hair-loss",
  name: "Hair Growth Treatment Intake Form",
  description: "Comprehensive questionnaire for patients seeking hair growth treatments including Finasteride, Minoxidil, and Tretinoin",
  version: "1.0.0",
  progressSteps: [
    {
      id: "hair-assessment",
      name: "Hair Assessment",
      description: "Hair satisfaction, goals, and loss location",
      color: "#D97706",
    },
    {
      id: "treatment-history",
      name: "Treatment History",
      description: "Previous treatments and experiences",
      color: "#D97706",
    },
    {
      id: "symptoms-medical",
      name: "Symptoms & Medical",
      description: "Symptoms and medical conditions",
      color: "#D97706",
    },
    {
      id: "medications-allergies",
      name: "Medications & Allergies",
      description: "Current medications and allergies",
      color: "#D97706",
    },
    {
      id: "final-steps",
      name: "Final Steps",
      description: "Additional information and contact details",
      color: "#D97706",
    },
  ],
  stepProgressMapping: [
    // Hair Loss Intake Form - 14 questions organized into 5 logical sections
    
    // Hair Assessment section - 3 questions
    { stepId: "hairSatisfaction", progressStepId: "hair-assessment" },
    { stepId: "hairGoals", progressStepId: "hair-assessment" },
    { stepId: "hairLossLocation", progressStepId: "hair-assessment" },

    // Treatment History section - 4 questions
    { stepId: "previousTreatment", progressStepId: "treatment-history" },
    { stepId: "previousTreatmentDetails", progressStepId: "treatment-history" },
    { stepId: "treatmentExperience", progressStepId: "treatment-history" },
    { stepId: "hairLossSymptoms", progressStepId: "treatment-history" },

    // Symptoms & Medical section - 2 questions
    { stepId: "bloodPressureHistory", progressStepId: "symptoms-medical" },
    { stepId: "medicalConditionsHair", progressStepId: "symptoms-medical" },

    // Medications & Allergies section - 3 questions
    { stepId: "currentMedicationsHair", progressStepId: "medications-allergies" },
    { stepId: "hairMedicationAllergies", progressStepId: "medications-allergies" },
    { stepId: "allergiesHair", progressStepId: "medications-allergies" },

    // Final Steps section - 4 questions (2 hair loss + 2 contact form)
    { stepId: "additionalInfoHair", progressStepId: "final-steps" },
    { stepId: "doctorMessageHair", progressStepId: "final-steps" },
    { stepId: "dob", progressStepId: "final-steps" },
    { stepId: "personalInfo", progressStepId: "final-steps" },
  ],
  steps: [...hairLossSteps, ...contactFormSteps],
  metadata: {
    category: "Hair Loss Treatment",
    estimatedTime: "10-15 minutes",
    targetAudience: "Adults seeking hair growth treatments including Finasteride, Minoxidil, and Tretinoin",
    compliance: ["HIPAA Compliant", "Medical Intake Form"],
  },
};



// Hardcoded quiz configurations (fallback)
const hardcodedQuizzes: QuizConfig[] = [
  glp1WeightLossQuiz,
  nadPlusQuiz,
  sermorelinQuiz,
  vitaminB12Quiz,
  sexualHealthQuiz,
  glutathioneQuiz,
  hyperpigmentationQuiz,
  antiAgingQuiz,
  acneQuiz,
  hairLossQuiz,
];

// Cache for loaded JSON quizzes
let jsonQuizzesCache: QuizConfig[] | null = null;
let jsonQuizzesLoadAttempted = false;

/**
 * Loads quizzes from JSON file with caching
 */
function loadQuizzesFromJsonWithCache(): QuizConfig[] {
  if (jsonQuizzesCache !== null) {
    return jsonQuizzesCache;
  }

  if (jsonQuizzesLoadAttempted) {
    return [];
  }

  jsonQuizzesLoadAttempted = true;

  try {
    const quizzes = loadQuizzesFromJson();
    
    // Validate each quiz (in development only)
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      quizzes.forEach(quiz => {
        // We need to reconstruct the JSON structure for validation
        // For now, we'll skip validation in production to avoid performance issues
        // Validation should happen in the admin UI before saving
      });
    }

    jsonQuizzesCache = quizzes;
    return quizzes;
  } catch (error) {
    console.error('Error loading quizzes from JSON:', error);
    jsonQuizzesCache = [];
    return [];
  }
}

/**
 * Gets all available quizzes (JSON + hardcoded, JSON takes precedence)
 */
export function getAvailableQuizzes(): QuizConfig[] {
  const jsonQuizzes = loadQuizzesFromJsonWithCache();
  const hardcodedMap = new Map(hardcodedQuizzes.map(q => [q.id, q]));
  
  // JSON quizzes take precedence, then add hardcoded ones that aren't in JSON
  const result = [...jsonQuizzes];
  jsonQuizzes.forEach(q => hardcodedMap.delete(q.id));
  
  // Add remaining hardcoded quizzes
  hardcodedMap.forEach(q => result.push(q));
  
  return result;
}

// Export all quiz configurations (backward compatibility)
// Use a getter function to ensure lazy loading
let _availableQuizzes: QuizConfig[] | null = null;

export function getAvailableQuizzesList(): QuizConfig[] {
  if (_availableQuizzes === null) {
    _availableQuizzes = getAvailableQuizzes();
  }
  return _availableQuizzes;
}

// Export as const for backward compatibility (lazy-loaded)
export const availableQuizzes: QuizConfig[] = getAvailableQuizzesList();

// Helper function to get quiz by ID (checks JSON first, then hardcoded)
export function getQuizById(quizId: string): QuizConfig | undefined {
  // Try JSON first
  const jsonQuiz = getQuizBySlugFromJson(quizId);
  if (jsonQuiz) {
    return jsonQuiz;
  }
  
  // Fallback to hardcoded quizzes
  return hardcodedQuizzes.find((quiz) => quiz.id === quizId);
}

// Helper function to get progress step for a specific form step
export function getProgressStepForFormStep(
  quizConfig: QuizConfig,
  formStepId: string,
): string | undefined {
  const mapping = quizConfig.stepProgressMapping.find(
    (mapping) => mapping.stepId === formStepId,
  );
  return mapping?.progressStepId;
}

// Helper function to get all form steps for a progress step
export function getFormStepsForProgressStep(
  quizConfig: QuizConfig,
  progressStepId: string,
): string[] {
  return quizConfig.stepProgressMapping
    .filter((mapping) => mapping.progressStepId === progressStepId)
    .map((mapping) => mapping.stepId);
}
