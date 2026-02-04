import type { FormStep } from "~/types/intake-form/form";

// --- FORM STRUCTURE DATA ---
// This is the master list of all steps in the form.
export const allStepsMaster: FormStep[] = [
  {
    id: "heightWeight",
    title: "What is your height and weight? We'll calculate your BMI automatically",
    heading1: "BMI Calculation",
    displayValue: {
      condition: (answers: any) => answers.feet && answers.inches && answers.weight,
      calculate: (answers: any) => {
        const heightInInches = (answers.feet * 12) + answers.inches;
        const heightInMeters = heightInInches * 0.0254;
        const weightInKg = answers.weight * 0.453592;
        const bmi = weightInKg / (heightInMeters * heightInMeters);
        return bmi.toFixed(2);
      },
      template: "BMI: {{value}}"
    },
    questions: [
      {
        id: "feet",
        question: "Feet",
        type: "DROPDOWN",
        required: true,
        options: [1, 2, 3, 4, 5, 6, 7],
        apiType: "TEXT",
      },
      {
        id: "inches",
        question: "Inches",
        type: "DROPDOWN",
        required: true,
        options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        apiType: "TEXT",
      },
      {
        id: "weight",
        question: "Weight (in lbs)",
        type: "number",
        required: true,
        placeholder: "Enter your weight",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "goalWeight",
    title: "What is your goal weight?",
    heading1: "We are in this together. Your goal is our goal.",
    questions: [
      {
        id: "goalWeight",
        type: "number",
        required: true,
        placeholder: "Enter your goal weight",
        apiType: "TEXT",
        validation: ["required"], // Note: Custom validation for goal weight comparison would need to be handled differently in the new system
      },
    ],
  },
  {
    id: "triedInPast",
    heading1: "What weight loss initiatives have you tried in the past?",
    subtext: "Select all that apply.",
    questions: [
      {
        id: "pastInitiatives",
        type: "MULTISELECT",
        options: [
          "Exercise",
          "Dieting",
          "Weight-loss Supplements",
          "Intermittent Fasting",
          "None of these",
        ],
        required: true,
        apiType: "MULTISELECT",
        optionImages: [
          "/assets/images/intake-form/option-icons/triedInPast_option1.svg",
          "/assets/images/intake-form/option-icons/triedInPast_option2.svg",
          "/assets/images/intake-form/option-icons/triedInPast_option3.svg",
          "/assets/images/intake-form/option-icons/triedInPast_option4.svg",
          "/assets/images/intake-form/option-icons/triedInPast_option5.svg",
        ],
      },
    ],
  },
  {
    id: "gender",
    heading1: "Are you male or female?",
    subtext:
      "This helps us understand your body complexity and hormones so we can assess you better.",
    questions: [
      {
        id: "gender",
        type: "SINGLESELECT",
        options: ["Male", "Female"],
        required: true,
        apiType: "SINGLESELECT",
        optionImages: [
          "/assets/images/intake-form/option-icons/gender_option1.svg",
          "/assets/images/intake-form/option-icons/gender_option2.svg",
        ],
      },
    ],
  },
  {
    id: "pregnancy",
    title: "Do any of these apply to you?",
    heading1: "Safety, first.",
    renderCondition: (answers) => answers.gender === "Female",
    questions: [
      {
        id: "pregnancy",
        type: "MULTISELECT",
        options: [
          "Currently or possibly pregnant",
          "Actively trying to become pregnant",
          "Breastfeeding",
          "None of the above",
        ],
        required: false,
        displayAsRow: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "marketing1",
    heading1: "It feels like magic, but it's metabolic science.",
    questions: [
      {
        id: "marketing1",
        type: "MARKETING",
        required: false,
        image: "/assets/images/intake-form/marketing/marketing1.png",
      },
    ],
  },
  {
    id: "marketing2",
    heading1: "What our Patient says",
    questions: [
      {
        id: "marketing2",
        type: "BEFORE_AFTER",
        required: false,
        beforeImage: "/assets/images/intake-form/before-after/before1.png",
        afterImage: "/assets/images/intake-form/before-after/after1.png",
        quote:
          "I lost 45 pounds in 6 months and feel like a completely different person. This medication changed my life!",
      },
    ],
  },
  {
    id: "marketing3",
    heading1: "How will GLP work for you?",
    questions: [
      {
        id: "marketing3",
        type: "MARKETING",
        required: false,
        image: "/assets/images/intake-form/marketing/marketing3.png",
        displayStatistics: true,
      },
    ],
  },
  {
    id: "motivation",
    title: "What is your primary reason for looking into GLP-1 medication?",
    heading1: "Improving your life requires motivation",
    questions: [
      {
        id: "motivation",
        type: "SINGLESELECT",
        options: [
          "Improve health",
          "Feel more confident",
          "Increase energy levels",
          "Other",
        ],
        required: true,
        displayAsRow: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "medication",
    heading1: "Are you currently taking any GLP-1 medications?",
    questions: [
      {
        id: "glp1",
        type: "SINGLESELECT",
        options: ["Yes", "No"],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "pace",
    title: "How is that pace for you?",
    heading1:
      "With medication, you'll lose {{weeklyLossRange}} pounds per week.",
    dynamicSubtext:
      "It will take about {{timeToGoal}} weeks to reach your goal weight of {{goalWeight}}.",
    subtext: "This is an estimate. Individual results may vary.",
    questions: [
      {
        id: "pace",
        type: "SINGLESELECT",
        options: ["That works for me", "I want it faster", "That's too fast"],
        required: true,
        apiType: "SINGLESELECT",
        optionImages: [
          "/assets/images/intake-form/option-icons/pace_option1.svg",
          "/assets/images/intake-form/option-icons/pace_option2.svg",
          "/assets/images/intake-form/option-icons/pace_option3.svg",
        ],
      },
    ],
  },
  {
    id: "perfect",
    questions: [
      {
        id: "perfect",
        type: "PERFECT",
        required: false,
        heading1: "Perfect!",
        dynamicSubtext:
          "Losing {{weight-goalWeight}}lbs is easier than you think - and it doesn't involve restrictive diets.",
        subtext:
          "Now, let's analyze your metabolism and discover how well your body processes macronutrients.",
      },
    ],
  },
  {
    id: "marketing4",
    heading1: "What our Patient says",
    questions: [
      {
        id: "marketing4",
        type: "BEFORE_AFTER",
        required: false,
        beforeImage: "/assets/images/intake-form/before-after/before2.png",
        afterImage: "/assets/images/intake-form/before-after/after2.png",
        quote:
          "After struggling with my weight for years, I finally found something that works. Down 30 pounds and counting!",
      },
    ],
  },
  {
    id: "marketing5",
    heading1: "What our Patient says",
    questions: [
      {
        id: "marketing5",
        type: "BEFORE_AFTER",
        required: false,
        beforeImage: "/assets/images/intake-form/before-after/before3.png",
        afterImage: "/assets/images/intake-form/before-after/after3.png",
        quote:
          "I never thought I could feel this confident again. The weight loss has been incredible and sustainable.",
      },
    ],
  },
  {
    id: "healthConditions1",
    title: "Do any of these apply to you?",
    heading1:
      "GLP-1 is safe, but these health conditions might prevent you from being prescribed.",
    subtext: "Your answers are completely confidential and protected by HIPAA",
    questions: [
      {
        id: "conditions1",
        type: "MULTISELECT",
        options: [
          "None of these ",
          "End-stage kidney disease (on or about to be on dialysis)",
          "End-stage liver disease (cirrhosis)",
          "Current suicidal thoughts and/or prior suicidal attempt",
          "Cancer (active diagnosis, active treatment, or in remission or cancer-free for less than 5 continuous years does not apply to non-melanoma skin cancer that was considered cured via simple excision)",
          "History of organ transplant on anti-rejection medication",
        ],
        required: true,
        displayAsRow: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "healthConditions2",
    title: "Do any of these apply to you?",
    heading1: "A few more health questions",
    questions: [
      {
        id: "conditions2",
        type: "MULTISELECT",
        options: [
          "None of these",
          "Gallbladder disease",
          "Hypertension (high blood pressure) ",
          "Seizures",
          "Glaucoma",
          "Sleep apnea",
          "Type 2 diabetes (not on insulin)",
          "Type 2 diabetes (on insulin)",
          "Type 1 diabetes",
          "Diabetic retinopathy (diabetic eye disease), damage to the optic nerve from trauma or reduced blood flow, or blindness",
        ],
        required: true,
        displayAsRow: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "surgicalHistory",
    heading1: "Have you had prior weight loss surgeries?",
    questions: [
      {
        id: "surgeries",
        type: "SINGLESELECT",
        options: ["Yes", "No"],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "marketing6",
    heading1: "What our Patient says",
    questions: [
      {
        id: "marketing6",
        type: "BEFORE_AFTER",
        required: false,
        beforeImage: "/assets/images/intake-form/before-after/before4.png",
        afterImage: "/assets/images/intake-form/before-after/after4.png",
        quote:
          "This medication gave me my life back. I have more energy, confidence, and I'm finally in control of my health.",
      },
    ],
  },
  {
    id: "currentMedications",
    heading1: "Do you currently take any medications?",
    questions: [
      {
        id: "medication",
        type: "SINGLESELECT",
        options: ["Yes", "No"],
        required: true,
        apiType: "SINGLESELECT",
        image: "/assets/images/intake-form/marketing/marketing7.png",
      },
    ],
  },
  {
    id: "motivationLevel",
    dynamicTitle: "How motivated are you to reach {{goalWeight}}lbs?",
    heading1: "Let's better understand your current state of mind.",
    questions: [
      {
        id: "motivationLevel",
        type: "SINGLESELECT",
        options: ["I'm ready", "I'm feeling hopeful", "I'm cautious"],
        required: true,
        apiType: "SINGLESELECT",
        optionImages: [
          "/assets/images/intake-form/option-icons/motivationLevel_option1.svg",
          "/assets/images/intake-form/option-icons/motivationLevel_option2.svg",
          "/assets/images/intake-form/option-icons/motivationLevel_option3.svg",
        ],
      },
    ],
  },
];


export const nadPlusFormSteps: FormStep[] = [
  // Question 1: Physical Activity Level
  {
    id: "physicalActivity",
    title: "How physically active are you?",
    questions: [
      {
        id: "physicalActivity",
        question: "Physical Activity Level",
        displayQuestion: "Understanding your activity level helps us assess your needs",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "Sedentary",
          "Somewhat Active",
          "Active but not athletic",
          "Athletic",
          "Competitive/Biohacker"
        ],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },

  // Question 2: Reproductive Status
  {
    id: "reproductiveStatus",
    title: "Which of the following apply to your reproductive status?",
    questions: [
      {
        id: "reproductiveStatus",
        type: "SINGLESELECT",
        displayAsRow: true,
        displayQuestion: "This information helps us ensure safe treatment",
        question: "Reproductive Status",
        options: [
          "I am not currently pregnant or breastfeeding",
          "I am currently pregnant or breastfeeding",
          "I plan to become pregnant or breastfeed within next 6 months",
          "I am currently going through menopause",
          "I had a hysterectomy or am post-menopause"
        ],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },

  // Question 3: Medical Conditions
  {
    id: "medicalConditionsNad",
    title: "Do you have any one of the following Medical Conditions?",
    questions: [
      {
        id: "medicalConditionsNad",
        type: "MULTISELECT",
        displayQuestion: "Select all that apply",
        question: "Medical Conditions",
        options: [
          "Diabetes",
          "Hypertension (High Blood Pressure)",
          "Thyroid condition",
          "Asthma or COPD",
          "Anxiety or depression",
          "HIV OR AIDS",
          "Kidney disease",
          "Cancer",
          "Arrhythmia or irregular heart beat",
          "Vascular disease (stroke, blood clots etc)",
          "Heart Failure",
          "Gallbladder disease",
          "Liver disease",
          "None of the above"
        ],
        required: true,
        displayAsRow: true,
        apiType: "MULTISELECT",
      },
    ],
  },

  // Question 4: BMI Calculation (Height & Weight)
  {
    id: "heightWeight",
    title: "What is your height and weight? We'll calculate your BMI automatically",
    heading1: "BMI Calculation",
    displayValue: {
      condition: (answers: any) => answers.feet && answers.inches && answers.weight,
      calculate: (answers: any) => {
        const heightInInches = (answers.feet * 12) + answers.inches;
        const heightInMeters = heightInInches * 0.0254;
        const weightInKg = answers.weight * 0.453592;
        const bmi = weightInKg / (heightInMeters * heightInMeters);
        return bmi.toFixed(2);
      },
      template: "BMI: {{value}}"
    },
    questions: [
      {
        id: "feet",
        question: "Feet",
        type: "DROPDOWN",
        required: true,
        options: [1, 2, 3, 4, 5, 6, 7],
        apiType: "TEXT",
      },
      {
        id: "inches",
        question: "Inches",
        type: "DROPDOWN",
        required: true,
        options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        apiType: "TEXT",
      },
      {
        id: "weight",
        question: "Weight (in lbs)",
        type: "number",
        required: true,
        placeholder: "Enter your weight",
        apiType: "TEXT",
      },
    ],
  },

  // Question 5: Gender
  {
    id: "gender",
    title: "What is your gender?",
    questions: [
      {
        id: "gender",
        type: "SINGLESELECT",
        displayQuestion: "This helps us provide personalized care",
        question: "Gender",
        options: ["Male", "Female"],
        required: true,
        displayAsRow: true,
        apiType: "SINGLESELECT",
      },
    ],
  },

  // Question 6: Liver Function
  {
    id: "liverFunction",
    title: "Have you ever been told your liver is not working properly?",
    questions: [
      {
        id: "liverFunction",
        question: "Liver Function",
        displayQuestion: "Please provide details if applicable",
        type: "textarea",
        required: true,
        placeholder: "Describe any liver issues or type N/A if none",
        apiType: "TEXT",
      },
    ],
  },

  // Question 5: Heart Function
  {
    id: "heartFunction",
    title: "Have you ever been told your heart is not pumping properly?",
    questions: [
      {
        id: "heartFunction",
        question: "Heart Function",
        displayQuestion: "Please provide details if applicable",
        type: "textarea",
        required: true,
        placeholder: "Describe any heart issues or type N/A if none",
        apiType: "TEXT",
      },
    ],
  },

  // Question 6: Smoking Status
  {
    id: "smokingStatus",
    title: "Do you currently smoke?",
    questions: [
      {
        id: "smokingStatus",
        question: "Smoking Status",
        displayQuestion: "Please provide details if applicable",
        type: "text",
        required: true,
        placeholder: "Describe your smoking status or type N/A if none",
        apiType: "TEXT",
      },
    ],
  },

  // Question 7: Family Medical History
  {
    id: "familyHistory",
    title: "Do any of your immediate family members have a history of the following conditions?",
    questions: [
      {
        id: "familyHistory",
        type: "MULTISELECT",
        question: "Family History",
        displayQuestion: "Check all that apply",
        options: [
          "Cancer",
          "Heart disease",
          "Dementia",
          "Diabetes",
          "High blood pressure",
          "High Cholesterol",
          "None of the above"
        ],
        required: true,
        displayAsRow: true,
        apiType: "MULTISELECT",
      },
    ],
  },

  // Question 8: Primary Care Provider
  {
    id: "primaryCareProvider",
    title: "Do you have a primary care provider?",
    questions: [
      {
        id: "primaryCareProvider",
        question: "Primary Care Provider",
        displayQuestion: "Please provide details if applicable",
        type: "textarea",
        required: true,
        placeholder: "Describe your primary care situation or type N/A if none",
        apiType: "TEXT",
      },
    ],
  },

  // Question 9: Health Check-up
  {
    id: "healthCheckup",
    title: "Have you had a general health check-up or routine physical in the past three years?",
    questions: [
      {
        id: "healthCheckup",
        question: "Health Check-up",
        displayQuestion: "This helps us understand your current health status",
        type: "SINGLESELECT",
        options: ["Yes", "No"],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },


  // Question 11: Allergies
  {
    id: "allergies",
    title: "Please list all of your known allergies",
    questions: [
      {
        id: "allergies",
        question: "Allergies",
        displayQuestion: "Please type N/A if none. This helps us avoid potential reactions",
        type: "textarea",
        required: true,
        placeholder: "List all known allergies, or type N/A",
        apiType: "TEXT",
      },
    ],
  },

  // Question 12: Interest in NAD
  {
    id: "interestInNad",
    title: "Understanding your goals helps us provide better care",
    questions: [
      {
        id: "interestInNad",
        question: "Interest in NAD+",
        displayQuestion: "Why are you interested in NAD+ Injections?",
        type: "textarea",
        required: true,
        placeholder: "Please describe your interest in NAD+ therapy",
        apiType: "TEXT",
      },
    ],
  },

  // Question 13: Previous NAD Experience
  {
    id: "previousNadExperience",
    title: "Have you ever used NAD+ by patch, IV infusion, injection or nasal spray?",
    questions: [
      {
        id: "previousNadExperience",
        question: "Previous NAD+ Experience",
        displayQuestion: "This helps us understand your experience level",
        type: "SINGLESELECT",
        options: ["Yes", "No"],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },

  // Question 14: NAD Experience Details (conditional)
  {
    id: "nadExperienceDetails",
    title: "Please describe and include any reactions, side effects and/or benefits you may have experienced",
    renderCondition: (answers: any) => answers.previousNadExperience === "Yes",
    questions: [
      {
        id: "nadExperienceDetails",
        question: "NAD+ Experience Details",
        displayQuestion: "This helps us understand your previous experience",
        type: "textarea",
        required: true,
        placeholder: "Describe your previous NAD+ experience",
        apiType: "TEXT",
      },
    ],
  },

  // Question 15: Comfort with Self-Injection
  {
    id: "selfInjectionComfort",
    title: "Do you feel comfortable drawing up the NAD+ solution and injecting yourself using an insulin-sized needle and syringe?",
    questions: [
      {
        id: "selfInjectionComfort",
        question: "Self Injection Comfort",
        displayQuestion: "This helps us determine the best administration method",
        type: "SINGLESELECT",
        options: ["Yes", "No"],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },

  // Question 17: Additional Information
  {
    id: "additionalInfo",
    title: "Is there anything else you want to tell your doctor?",
    questions: [
      {
        id: "additionalInfo",
        question: "Additional Information",
        displayQuestion: "Please share any additional information you think is important (optional)",
        type: "textarea",
        required: false,
        placeholder: "Any additional information for your doctor",
        apiType: "TEXT",
      },
    ],
  },
];

export const sermorelinSteps: FormStep[] = [
  // Question 1: Reproductive Status
  {
    id: "reproductiveStatus",
    title: "Are you pregnant, planning to become pregnant, or breastfeeding?",
    questions: [
      {
        id: "reproductiveStatus",
        question: "Reproductive Status",
        displayQuestion: "This information helps us ensure safe treatment",
        type: "SINGLESELECT",
        options: [
          "Currently pregnant",
          "Planning to become pregnant within the next 6 months",
          "Breastfeeding",
          "None of the above"
        ],
        displayAsRow: true,
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },

  // Question 2: Desired Benefits
  {
    id: "desiredBenefits",
    title: "What benefits are you seeking?",
    questions: [
      {
        id: "desiredBenefits",
        type: "MULTISELECT",
        question: "Desired Benefits",
        displayQuestion: "Please check all that apply. This helps us understand your goals",
        options: [
          "Muscle gain",
          "Fat loss",
          "Improved healing",
          "Memory/cognitive benefits",
          "Better sleep",
          "General anti-aging",
          "Other"
        ],
        required: true,
        displayAsRow: true,
        apiType: "MULTISELECT",
      },
    ],
  },

  // Question 3: Medical Contraindications
  {
    id: "medicalContraindications",
    title: "Do any of the following apply to you?",
    questions: [
      {
        id: "medicalContraindications",
        type: "MULTISELECT",
        question: "Medical Contraindications",
        displayQuestion: "Please select all that apply. This helps us assess safety",
        options: [
          "Active cancer diagnosis",
          "Disease of the pituitary gland",
          "Untreated hypothyroidism",
          "Uncontrolled diabetes",
          "Intracranial lesion/tumor",
          "Heart failure",
          "None of the above"
        ],
        required: true,
        displayAsRow: true,
        apiType: "MULTISELECT",
      },
    ],
  },

  // Question 4: BMI Calculation (Height & Weight)
  {
    id: "heightWeight",
    title: "What is your height and weight? We'll calculate your BMI automatically",
    heading1: "BMI Calculation",
    displayValue: {
      condition: (answers: any) => answers.feet && answers.inches && answers.weight,
      calculate: (answers: any) => {
        const heightInInches = (answers.feet * 12) + answers.inches;
        const heightInMeters = heightInInches * 0.0254;
        const weightInKg = answers.weight * 0.453592;
        const bmi = weightInKg / (heightInMeters * heightInMeters);
        return bmi.toFixed(2);
      },
      template: "BMI: {{value}}"
    },
    questions: [
      {
        id: "feet",
        question: "Feet",
        type: "DROPDOWN",
        required: true,
        options: [1, 2, 3, 4, 5, 6, 7],
        apiType: "TEXT",
      },
      {
        id: "inches",
        question: "Inches",
        type: "DROPDOWN",
        required: true,
        options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        apiType: "TEXT",
      },
      {
        id: "weight",
        question: "Weight (in lbs)",
        type: "number",
        required: true,
        placeholder: "Enter your weight",
        apiType: "TEXT",
      },
    ],
  },


  // Question 5: Gender
  {
    id: "gender",
    title: "What is your gender?",
    questions: [
      {
        id: "gender",
        type: "SINGLESELECT",
        question: "Gender",
        displayQuestion: "This helps us provide personalized care",
        options: ["Male", "Female"],
        required: true,
        apiType: "SINGLESELECT",
        displayAsRow: true,
      },
    ],
  },

  // Question 6: Current Medical Conditions
  {
    id: "currentMedicalConditions",
    title: "Please list all current medical conditions",
    questions: [
      {
        id: "currentMedicalConditions",
        question: "Current Medical Conditions",
        displayQuestion: "Please type N/A if none. This helps us understand your health profile",
        type: "textarea",
        required: true,
        placeholder: "List current medical conditions, or type N/A ",
        apiType: "TEXT",
      },
    ],
  },

  // Question 5: Current Medications
  {
    id: "currentMedications",
    title: "Please list all your current medications",
    questions: [
      {
        id: "currentMedications",
        type: "textarea",
        question: "Current Medications",
        displayQuestion: "Please include dosages. Type N/A if none.",
        required: true,
        placeholder: "List medications with dosages, or type N/A",
        apiType: "TEXT",
      },
    ],
  },

  // Question 6: Allergies
  {
    id: "allergies",
    title: "Please list all of your known allergies",
    questions: [
      {
        id: "allergies",
        question: "Allergies",
        displayQuestion: "Please type N/A if none. This helps us avoid potential reactions",
        type: "textarea",
        required: true,
        placeholder: "List all known allergies, or type N/A if none",
        apiType: "TEXT",
      },
    ],
  },

  // Question 7: Additional Information
  {
    id: "additionalInfo",
    title: "Is there anything else you want to tell your doctor?",
    questions: [
      {
        id: "additionalInfo",
        question: "Additional Information",
        displayQuestion: "Please share any additional information you think is important (optional)",
        type: "textarea",
        required: false,
        placeholder: "Any additional information for your doctor (optional)",
        apiType: "TEXT",
      },
    ],
  },
];

export const vitaminB12Steps: FormStep[] = [
  // Question 1: B12 Deficiency Diagnosis
  {
    id: "b12DeficiencyDiagnosis",
    title: "Have you been diagnosed with vitamin B12 deficiency by a physician or other healthcare professional?",
    questions: [
      {
        id: "b12DeficiencyDiagnosis",
        question: "B12 Deficiency Diagnosis",
        displayQuestion: "This helps us understand your current medical status",
        type: "SINGLESELECT",
        options: ["Yes", "No"],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },

  // Question 2: Medical Conditions
  {
    id: "medicalConditions",
    title: "Do you have any of the following conditions?",
    questions: [
      {
        id: "medicalConditions",
        question: "Medical Conditions",
        displayQuestion: "Please check all that apply",
        type: "MULTISELECT",
        options: [
          "Leber's optic neuropathy",
          "Polycythemia Vera",
          "Gout",
          "Low potassium levels",
          "Anemia for any reason other than low vitamin B12",
          "Any other blood disorder",
          "None of the above"
        ],
        required: true,
        displayAsRow: true,
        apiType: "MULTISELECT",
      },
    ],
  },

  // Question 3: BMI Calculation (Height & Weight)
  {
    id: "heightWeight",
    title: "What is your height and weight? We'll calculate your BMI automatically",
    heading1: "BMI Calculation",
    displayValue: {
      condition: (answers: any) => answers.feet && answers.inches && answers.weight,
      calculate: (answers: any) => {
        const heightInInches = (answers.feet * 12) + answers.inches;
        const heightInMeters = heightInInches * 0.0254;
        const weightInKg = answers.weight * 0.453592;
        const bmi = weightInKg / (heightInMeters * heightInMeters);
        return bmi.toFixed(2);
      },
      template: "BMI: {{value}}"
    },
    questions: [
      {
        id: "feet",
        question: "Feet",
        type: "DROPDOWN",
        required: true,
        options: [1, 2, 3, 4, 5, 6, 7],
        apiType: "TEXT",
      },
      {
        id: "inches",
        question: "Inches",
        type: "DROPDOWN",
        required: true,
        options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        apiType: "TEXT",
      },
      {
        id: "weight",
        question: "Weight (in lbs)",
        type: "number",
        required: true,
        placeholder: "Enter your weight",
        apiType: "TEXT",
      },
    ],
  },
  // Question 4: Gender
  {
    id: "gender",
    title: "What is your gender?",
    questions: [
      {
        id: "gender",
        type: "SINGLESELECT",
        question: "Gender",
        displayQuestion: "This helps us provide personalized care",
        options: ["Male", "Female"],
        required: true,
        apiType: "SINGLESELECT",
        displayAsRow: true,
      },
    ],
  },

  // Question 5: Current Medical Conditions
  {
    id: "currentMedicalConditions",
    title: "Please list all current medical conditions",
    questions: [
      {
        id: "currentMedicalConditions",
        question: "Current Medical Conditions",
        displayQuestion: "Please type N/A if none",
        type: "textarea",
        required: true,
        placeholder: "List current medical conditions, or type N/A",
        apiType: "TEXT",
      },
    ],
  },

  // Question 4: Current Medications
  {
    id: "currentMedications",
    title: "Please list all your current medications, including prescription, over-the-counter, or supplements.",
    questions: [
      {
        id: "currentMedications",
        question: "Current Medications",
        displayQuestion: "Please include dosages. Type N/A if none.",
        type: "textarea",
        required: true,
        placeholder: "List medications with dosages, or type N/A",
        apiType: "TEXT",
      },
    ],
  },

  // Question 5: Allergies
  {
    id: "allergies",
    title: "Please list all of your known allergies",
    questions: [
      {
        id: "allergies",
        question: "Allergies",
        displayQuestion: "Please type N/A if none",
        type: "textarea",
        required: true,
        placeholder: "List all known allergies, or type N/A if none",
        apiType: "TEXT",
      },
    ],
  },

  // Question 6: Additional Information
  {
    id: "additionalInfo",
    title: "Is there anything else you want to tell your doctor?",
    questions: [
      {
        id: "additionalInfo",
        question: "Additional Information",
        displayQuestion: "Please share any additional information you think is important (optional)",
        type: "textarea",
        required: false,
        placeholder: "Any additional information for your doctor",
        apiType: "TEXT",
      },
    ],
  },

  // Question 7: Consultation Type
  {
    id: "consultationType",
    title: "Choose your preferred consultation method. Email/Text is fastest, Phone/Video has a consultation fee.",
    heading2: "Email/Text is fastest",
    questions: [
      {
        id: "consultationType",
        type: "SINGLESELECT",
        displayAsRow: true,
        question: "$80 consultation fee will apply only if your prescription is approved and you choose not to proceed with treatment. The consultation is free if you move forward with purchasing your prescription. If you prefer to speak with your provider prior to approval, please select Phone or Video Consultation.",

        options: [
          "Email and Text Message (Fastest Option)",
          "Video",
          "Phone Call"
        ],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
];

export const sexualHealthSteps: FormStep[] = [
  {
    id: "confidenceRating",
    title: "How do you rate your confidence that you could get and keep an erection?",
    questions: [
      {
        id: "confidenceRating",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "Very Low",
          "Low",
          "Moderate",
          "High",
          "Very High"
        ],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "erectionFrequency",
    title: "When you have erections with sexual stimulation, how often are your erections hard enough for penetration?",
    questions: [
      {
        id: "erectionFrequency",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "Almost never or never",
          "A few times (less than half the time)",
          "Sometimes (about half the time)",
          "Most times (more than half the time)",
          "Almost always or always"
        ],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "erectionDuration",
    title: "How often were you able to maintain your erection for a long enough period to satisfy yourself and your partner?",
    questions: [
      {
        id: "erectionDuration",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "Almost never or never",
          "A few times (less than half the time)",
          "Sometimes (about half the time)",
          "Most times (more than half the time)",
          "Almost always or always"
        ],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "erectionDifficulty",
    title: "During sexual intercourse, how difficult was it to maintain your erection to completion of intercourse?",
    questions: [
      {
        id: "erectionDifficulty",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "Extremely difficult",
          "Very difficult",
          "Difficult",
          "Slightly difficult",
          "Not difficult"
        ],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "intercourseSatisfaction",
    title: "When you attempted sexual intercourse, how often was it satisfactory to you?",
    questions: [
      {
        id: "intercourseSatisfaction",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "Almost never or never",
          "A few times (less than half the time)",
          "Sometimes (about half the time)",
          "Most times (more than half the time)",
          "Almost always or always"
        ],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "edOnset",
    title: "How did your ED begin?",
    questions: [
      {
        id: "edOnset",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "Gradually, but has worsened over time",
          "Suddenly, but not with a new partner",
          "Suddenly, with a new partner",
          "I don't know how it began"
        ],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "sexLifeSatisfaction",
    title: "How satisfied have you been with your overall sex life?",
    questions: [
      {
        id: "sexLifeSatisfaction",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "Not at all",
          "A little bit",
          "Somewhat",
          "Quite a bit",
          "Very"
        ],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "edMedicationHistory",
    title: "Have you tried ED medication before?",
    questions: [
      {
        id: "edMedicationHistory",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: ["Yes", "No"],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "previousMedications",
    title: "If yes, please list medication(s) previously tried:",
    renderCondition: (answers) => answers.edMedicationHistory === "Yes",
    questions: [
      {
        id: "previousMedications",
        type: "textarea",
        required: false,
        placeholder: "List previously tried ED medications",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "bloodPressureHistory",
    title: "Have you ever been diagnosed with or treated for high or low blood pressure?",
    questions: [
      {
        id: "bloodPressureHistory",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "No",
          "Yes, for high blood pressure",
          "Yes, for low blood pressure",
          "I'm not sure"
        ],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "heartConditions",
    title: "Have you ever been diagnosed with any of these heart conditions?",
    questions: [
      {
        id: "heartConditions",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Arrhythmia",
          "Coronary artery disease (narrowing of the heart vessels)",
          "Coronary bypass surgery",
          "Heart attack",
          "Idiopathic Hypertrophic Subaortic Stenosis (aka hypertrophic obstructive cardiomyopathy)",
          "Long QT Syndrome",
          "Any congenital or developmental heart problems",
          "Pulmonary HTN (a rare condition that refers to the blood vessels to the lungs and isn't the same as high blood pressure)",
          "Heart failure",
          "None of these"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "symptoms",
    title: "Do you experience any of these symptoms? (Please check off all that apply)",
    questions: [
      {
        id: "symptoms",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Chest pain when climbing stairs or walking",
          "Chest pain during sexual activity",
          "Sudden loss of vision due to loss of blood flow to your eye (aka anterior ischemic optic neuropathy)",
          "Unexplained fainting or dizziness",
          "Cramping or pain in the calves or legs with exercise (aka claudication)",
          "None of these"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "medicalConditions",
    title: "Have you ever been diagnosed with or experienced the following?",
    questions: [
      {
        id: "medicalConditions",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Organ transplant",
          "Kidney failure, disease, or dialysis",
          "Liver disease",
          "Retinitis Pigmentosa, a genetic condition that typically causes gradual changes to your vision",
          "Nonarteritic anterior ischemic optic neuropathy (NAION)",
          "Diabetes",
          "Told not to have sex for any reason",
          "Sickle Cell Anemia",
          "Stroke",
          "Peyronie's disease or pain with erections",
          "Foreskin that's too tight",
          "Active stomach, intestinal, or bowel ulcers or bleeding",
          "Bleeding disorder (causing you to bleed more easily than is normal)",
          "Multiple sclerosis, paralysis, or spinal cord injury",
          "Clotting disorder (you form clots more easily than is normal)",
          "None of the above"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "recreationalDrugs",
    title: "Have you used any of these recreational drugs in the last 6 months?",
    questions: [
      {
        id: "recreationalDrugs",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Crystal meth (methamphetamines or amphetamines)",
          "Poppers or Rush",
          "Amyl Nitrate or Butyl Nitrate",
          "Cocaine",
          "Molly (MDMA, ecstasy)",
          "No, I haven't used these recreational drugs in the last 6 months"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "currentMedicalConditions",
    title: "Please list all current medical conditions. Please type N/A if none.",
    questions: [
      {
        id: "currentMedicalConditions",
        type: "textarea",
        required: true,
        placeholder: "List current medical conditions, or type N/A",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "contraindicatedMedications",
    title: "Do you currently use or have prescriptions for any of these medications?",
    questions: [
      {
        id: "contraindicatedMedications",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Any medication containing nitrates",
          "Any ALPHA blocker, NOT beta blocker (like Flomax, Cardura, and Minipress)",
          "Nitroglycerin in any form (spray, tablet, patch, or ointment)",
          "Supplements that boost nitric oxide (like L-arginine, L-citrulline, beet root powder/extract/juice concentrate)",
          "Monoket (isosorbide mononitrate), Bidil, or Isordil (isorbide dinitrate), which are commonly prescribed to prevent chest pain caused by heart disease)",
          "Antiretrovirals or any treatment for HIV",
          "Adempas (riociguat)",
          "None of the above"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "currentMedications",
    title: "Please list all prescription or over-the-counter medications and supplements you are currently taking. Please type N/A if none",
    questions: [
      {
        id: "currentMedications",
        type: "textarea",
        required: true,
        placeholder: "List medications with dosages, or type N/A",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "allergies",
    title: "Please list allergies to prescription or over-the-counter medicines, herbs, vitamins, supplements, food, dyes, or anything else. Please type N/A if none",
    questions: [
      {
        id: "allergies",
        type: "textarea",
        required: true,
        placeholder: "List all known allergies, or type N/A",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "additionalInfo",
    title: "Is there anything else you'd like your provider to know?",
    questions: [
      {
        id: "additionalInfo",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: ["Yes", "No"],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "providerMessage",
    title: "Please leave your message to your doctor here.",
    renderCondition: (answers) => answers.additionalInfo === "Yes",
    questions: [
      {
        id: "providerMessage",
        type: "textarea",
        required: false,
        placeholder: "Your message to your doctor",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "edEducation",
    heading1: "ED can be a sign of other undiagnosed medical issues, like heart problems.",
    heading2: "Smoking, marijuana use, obesity, depression, and low testosterone can all play a role in erectile function (and dysfunction).",
    subtext: "In addition to seeking ED treatment, we recommend you speak with your primary care provider to rule out other underlying conditions.",
    headingsInline: true,
    questions: [
      {
        id: "edEducation",
        type: "MARKETING",
        required: false,
      },
    ],
  },
  // {
  //   id: "treatmentPreferences",
  //   heading1: "Let's talk about treatment preferences.",
  //   heading2: "",
  //   subtext: "",
  //   questions: [
  //     {
  //       id: "treatmentPreferences",
  //       type: "MARKETING",
  //       required: false,
  //     },
  //   ],
  // },
  // {
  //   id: "treatmentOption",
  //   title: "Which treatment option best fits your needs?",
  //   subtext: "",
  //   questions: [
  //     {
  //       id: "treatmentOption",
  //       type: "SINGLESELECT",
  //       question: "If you have any preferences, we want to take those into account. Your provider will still review everything and make sure you're getting the best treatment for you.",
  //       displayAsRow: true,
  //       options: [
  //         "Sildenafil",
  //         "Tadalafil"
  //       ],
  //       required: true,
  //       apiType: "SINGLESELECT",
  //     },
  //   ],
  // },
];

export const glutathioneSteps: FormStep[] = [
  {
    id: "heightWeight",
    title: "What is your height and weight?",
    heading1: "BMI Calculation",
    displayValue: {
      condition: (answers: any) => answers.feet && answers.inches && answers.weight,
      calculate: (answers: any) => {
        const heightInInches = (answers.feet * 12) + answers.inches;
        const heightInMeters = heightInInches * 0.0254;
        const weightInKg = answers.weight * 0.453592;
        const bmi = weightInKg / (heightInMeters * heightInMeters);
        return bmi.toFixed(2);
      },
      template: "BMI: {{value}}"
    },
    questions: [
      {
        id: "feet",
        question: "Feet",
        type: "DROPDOWN",
        required: true,
        options: [1, 2, 3, 4, 5, 6, 7],
        apiType: "TEXT",
      },
      {
        id: "inches",
        question: "Inches",
        type: "DROPDOWN",
        required: true,
        options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        apiType: "TEXT",
      },
      {
        id: "weight",
        question: "Weight (in lbs)",
        type: "number",
        required: true,
        placeholder: "Enter your weight",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "reproductiveStatus",
    title: "Which of the following apply to your reproductive status?",
    questions: [
      {
        id: "reproductiveStatus",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "I am not currently pregnant nor breastfeeding",
          "I am currently pregnant or breastfeeding",
          "I plan to become pregnant or breastfeed within the next 6 months",
          "I am currently going through menopause",
          "I had a hysterectomy or am post-menopausal"
        ],
        required: false,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "medicalConditions",
    title: "Do you have any one of the following Medical Conditions? (Check all that apply)",
    questions: [
      {
        id: "medicalConditions",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Chronic kidney disease",
          "Asthma",
          "Zinc deficiency",
          "None of the above"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "glutathioneInterest",
    title: "Why are you interested in glutathione supplementation?",
    questions: [
      {
        id: "glutathioneInterest",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "To help with a chronic disease",
          "For energy support",
          "For aging support",
          "Other"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "currentMedicalConditions",
    title: "Please list all current medical conditions. Please type N/A if none.",
    questions: [
      {
        id: "currentMedicalConditions",
        type: "textarea",
        required: true,
        placeholder: "List current medical conditions, or type N/A",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "currentMedications",
    title: "Please list all your current medications, including prescription, over-the-counter, and supplements, including dosages. Please type N/A if none.",
    questions: [
      {
        id: "currentMedications",
        type: "textarea",
        required: true,
        placeholder: "List medications with dosages, or type N/A",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "allergies",
    title: "Please list allergies to prescription or over-the-counter medicines, herbs, vitamins, supplements, food, dyes, or anything else. Please type N/A if none.",
    questions: [
      {
        id: "allergies",
        type: "textarea",
        required: true,
        placeholder: "List all known allergies, or type N/A",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "additionalInfo",
    title: "Is there anything else you want to tell your doctor?",
    questions: [
      {
        id: "additionalInfo",
        type: "textarea",
        required: true,
        placeholder: "Any additional information for your doctor",
        apiType: "TEXT",
      },
    ],
  },
];

export const hyperpigmentationSteps: FormStep[] = [
  {
    id: "hyperpigmentationConcerns",
    title: "Which of the following applies to you? Please select all that apply.",
    questions: [
      {
        id: "hyperpigmentationConcerns",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "I have dark spots on my face that bother me",
          "I have dark patches of skin that bother me",
          "I have dark acne scars that bother me",
          "Other"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "skinGoals",
    title: "What other goals do you have for your skin? Select all that apply.",
    questions: [
      {
        id: "skinGoals",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Reducing fine lines and wrinkles",
          "Improving skin texture (finer, smoother skin)",
          "Treating/reducing acne breakouts",
          "Treating rosacea",
          "Treating eczema",
          "Other",
          "None of these"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "skinType",
    title: "Please select how dry/oily your skin is.",
    questions: [
      {
        id: "skinType",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "Very dry",
          "Somewhat dry",
          "Combination skin type",
          "Somewhat oily",
          "Oily"
        ],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "skinSensitivity",
    title: "How sensitive is your skin?",
    questions: [
      {
        id: "skinSensitivity",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "My skin is easily irritated",
          "My skin can get irritated at times",
          "My skin is rarely irritated",
          "I'm not sure"
        ],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "tretinoinUsage",
    title: "Are you currently using tretinoin, retin-A, or other retinol product?",
    questions: [
      {
        id: "tretinoinUsage",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: ["Yes", "No"],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "tretinoinStrength",
    title: "What strength tretinoin or retin-A are you using?",
    renderCondition: (answers) => answers.tretinoinUsage === "Yes",
    questions: [
      {
        id: "tretinoinStrength",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "~0.025%",
          "~0.05%",
          "~0.08%",
          "~0.1%",
          "I'm using a different retinol product",
          "I'm not sure"
        ],
        required: false,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "skinConditions",
    title: "Do you have any of the following skin conditions? Please select all that apply.",
    questions: [
      {
        id: "skinConditions",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Acne",
          "Rosacea",
          "Eczema or atopic dermatitis",
          "Skin cancer",
          "None of these"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "currentMedicalConditions",
    title: "Please list all current medical conditions. Please type N/A if none.",
    questions: [
      {
        id: "currentMedicalConditions",
        type: "textarea",
        required: true,
        placeholder: "List current medical conditions, or type N/A",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "topicalAllergies",
    title: "Are you allergic or sensitive to any of the following topical products? Please select all that apply.",
    questions: [
      {
        id: "topicalAllergies",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Hydroquinone",
          "Triamcinolone",
          "Tretinoin",
          "Kojic Acid",
          "Azelaic Acid",
          "Green Tea (EGCG)",
          "Resveratrol",
          "Ascorbic Acid (Vitamin C)",
          "Hydrocortisone",
          "Other",
          "None of the above"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "allergies",
    title: "Please list allergies to prescription or over-the-counter medicines, herbs, vitamins, supplements, food, dyes, or anything else. Please type N/A if none.",
    questions: [
      {
        id: "allergies",
        type: "textarea",
        required: true,
        placeholder: "List all known allergies, or type N/A",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "currentMedications",
    title: "Please list any prescription or over the counter medications or supplements you are taking. Please type N/A if none.",
    questions: [
      {
        id: "currentMedications",
        type: "textarea",
        required: true,
        placeholder: "List medications with dosages, or type N/A",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "skincareProducts",
    title: "Which of the following do you use. Please select all that apply.",
    questions: [
      {
        id: "skincareProducts",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Sunscreen",
          "Moisturizer",
          "Cleanser",
          "Makeup",
          "Other",
          "None of these"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "skincareRoutine",
    title: "Please list all skincare products you are using. Please type N/A if none.",
    questions: [
      {
        id: "skincareRoutine",
        type: "textarea",
        required: true,
        placeholder: "List all skincare products you are using, or type N/A",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "additionalInfo",
    title: "Is there anything else you want to tell your doctor?",
    questions: [
      {
        id: "additionalInfo",
        type: "textarea",
        required: true,
        placeholder: "Any additional information for your doctor",
        apiType: "TEXT",
      },
    ],
  },
];

export const antiAgingSteps: FormStep[] = [
  {
    id: "antiAgingGoals",
    title: "What anti-aging goals do you have for your skin? Please select all that apply.",
    questions: [
      {
        id: "antiAgingGoals",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Reducing fine lines and wrinkles",
          "Improving skin texture (finer, smoother skin)",
          "Improving plumpness/firmness",
          "Reducing dark spots and uneven skin tone",
          "Reducing facial hair/hirsutism",
          "Other"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "otherSkinGoals",
    title: "What other goals do you have for your skin? Select all that apply.",
    questions: [
      {
        id: "otherSkinGoals",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Treating/reducing acne breakouts",
          "Treating rosacea",
          "Treating eczema",
          "Other"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "skinType",
    title: "Please select how dry/oily your skin is.",
    questions: [
      {
        id: "skinType",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "Very dry",
          "Somewhat dry",
          "Combination skin type",
          "Somewhat oily",
          "Oily"
        ],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "skinSensitivity",
    title: "How sensitive is your skin?",
    questions: [
      {
        id: "skinSensitivity",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "My skin is easily irritated",
          "My skin can get irritated at times",
          "My skin is rarely irritated",
          "I'm not sure"
        ],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "tretinoinUsage",
    title: "Are you currently using tretinoin, retin-A, or other retinol product?",
    questions: [
      {
        id: "tretinoinUsage",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: ["Yes", "No"],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "tretinoinStrength",
    title: "What strength tretinoin or retin-A are you using?",
    renderCondition: (answers) => answers.tretinoinUsage === "Yes",
    questions: [
      {
        id: "tretinoinStrength",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "~0.025%",
          "~0.05%",
          "~0.08%",
          "~0.1%",
          "I'm using a different retinol product",
          "I'm not sure"
        ],
        required: false,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "skinConditions",
    title: "Do you have any of the following skin conditions? Please select all that apply.",
    questions: [
      {
        id: "skinConditions",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Acne",
          "Rosacea",
          "Eczema or atopic dermatitis",
          "Skin cancer",
          "Other",
          "None of these"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "currentMedicalConditions",
    title: "Please list all current medical conditions. Please type N/A if none.",
    questions: [
      {
        id: "currentMedicalConditions",
        type: "textarea",
        required: true,
        placeholder: "List current medical conditions, or type N/A",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "topicalAllergies",
    title: "Are you allergic or sensitive to any of the following topical products? Please select all that apply.",
    questions: [
      {
        id: "topicalAllergies",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Tretinoin",
          "Niacinamide",
          "GHK-Cu",
          "Caffeine",
          "Estriol",
          "Ascorbic Acid (Vitamin C)",
          "Alpha Lipoic Acid",
          "Finasteride",
          "Resveratrol",
          "None of the above"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "allergies",
    title: "Please list allergies to prescription or over-the-counter medicines, herbs, vitamins, supplements, food, dyes, or anything else. Please type N/A if none.",
    questions: [
      {
        id: "allergies",
        type: "textarea",
        required: true,
        placeholder: "List all known allergies, or type N/A",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "currentMedications",
    title: "Please list any prescription or over the counter medications or supplements you are taking. Please type N/A if none.",
    questions: [
      {
        id: "currentMedications",
        type: "textarea",
        required: true,
        placeholder: "List medications with dosages, or type N/A",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "skincareProducts",
    title: "Which of the following do you use. Please select all that apply.",
    questions: [
      {
        id: "skincareProducts",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Sunscreen",
          "Moisturizer",
          "Cleanser",
          "Makeup",
          "Other",
          "None of these"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "skincareRoutine",
    title: "Please list all skincare products you are using. Please type N/A if none.",
    questions: [
      {
        id: "skincareRoutine",
        type: "textarea",
        required: true,
        placeholder: "List all skincare products you are using, or type N/A",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "additionalInfo",
    title: "Is there anything else you want to tell your doctor?",
    questions: [
      {
        id: "additionalInfo",
        type: "textarea",
        required: true,
        placeholder: "Any additional information for your doctor",
        apiType: "TEXT",
      },
    ],
  },
];

export const acneSteps: FormStep[] = [
  {
    id: "acneType",
    title: "How would you describe your acne?",
    questions: [
      {
        id: "acneType",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Mild",
          "Moderate",
          "Severe",
          "Cystic",
          "Inflamed",
          "Other"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "otherSkinGoals",
    title: "What other goals do you have for your skin? Select all that apply.",
    questions: [
      {
        id: "otherSkinGoals",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Reducing fine lines and wrinkles",
          "Improving skin texture (finer, smoother skin)",
          "Reducing dark spots—more even skin tone",
          "Improving plumpness/firmness",
          "Treating rosacea",
          "Treating eczema",
          "Other"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "skinType",
    title: "Please select how dry/oily your skin is.",
    questions: [
      {
        id: "skinType",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "Very dry",
          "Somewhat dry",
          "Combination skin type",
          "Somewhat oily",
          "Oily"
        ],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "skinSensitivity",
    title: "How sensitive is your skin?",
    questions: [
      {
        id: "skinSensitivity",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "My skin is easily irritated",
          "My skin can get irritated at times",
          "My skin is rarely irritated",
          "I'm not sure"
        ],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "tretinoinUsage",
    title: "Are you currently using tretinoin, retin-A, or other retinol product?",
    questions: [
      {
        id: "tretinoinUsage",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: ["Yes", "No"],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "tretinoinStrength",
    title: "What strength tretinoin or retin-A are you using?",
    renderCondition: (answers) => answers.tretinoinUsage === "Yes",
    questions: [
      {
        id: "tretinoinStrength",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "~0.025%",
          "~0.05%",
          "~0.08%",
          "~0.1%",
          "I'm using a different retinol product",
          "I'm not sure"
        ],
        required: false,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "skinConditions",
    title: "Do you have any of the following skin conditions? Please select all that apply.",
    questions: [
      {
        id: "skinConditions",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Rosacea",
          "Eczema or atopic dermatitis",
          "Skin cancer",
          "Other",
          "None of these"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "currentMedicalConditions",
    title: "Please list all current medical conditions. Please type N/A if none.",
    questions: [
      {
        id: "currentMedicalConditions",
        type: "textarea",
        required: true,
        placeholder: "List current medical conditions, or type N/A",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "topicalAllergies",
    title: "Are you allergic or sensitive to any of the following topical products? Please select all that apply.",
    questions: [
      {
        id: "topicalAllergies",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Tretinoin",
          "Niacinamide",
          "Benzoyl Peroxide",
          "Azelaic Acid",
          "Clindamycin",
          "Dapsone",
          "Spironolactone",
          "Other",
          "None of the above"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "allergies",
    title: "Please list allergies to prescription or over-the-counter medicines, herbs, vitamins, supplements, food, dyes, or anything else. Please type N/A if none.",
    questions: [
      {
        id: "allergies",
        type: "textarea",
        required: true,
        placeholder: "List all known allergies, or type N/A",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "currentMedications",
    title: "Please list any prescription or over the counter medications or supplements you are taking. Please type N/A if none.",
    questions: [
      {
        id: "currentMedications",
        type: "textarea",
        required: true,
        placeholder: "List medications with dosages, or type N/A",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "skincareProducts",
    title: "Which of the following do you use. Please select all that apply.",
    questions: [
      {
        id: "skincareProducts",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Sunscreen",
          "Moisturizer",
          "Cleanser",
          "Makeup",
          "Other",
          "None of these"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "skincareRoutine",
    title: "Please list all skincare products you are using. Please type N/A if none.",
    questions: [
      {
        id: "skincareRoutine",
        type: "textarea",
        required: true,
        placeholder: "List all skincare products you are using, or type N/A",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "additionalInfo",
    title: "Is there anything else you want to tell your doctor?",
    questions: [
      {
        id: "additionalInfo",
        type: "textarea",
        required: true,
        placeholder: "Any additional information for your doctor",
        apiType: "TEXT",
      },
    ],
  },
];

export const hairLossSteps: FormStep[] = [
  {
    id: "hairSatisfaction",
    title: "How satisfied are you with your hair overall?",
    questions: [
      {
        id: "hairSatisfaction",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "Not at all",
          "A little bit",
          "Somewhat",
          "Quite a bit",
          "Very"
        ],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "hairGoals",
    title: "What are your top-priority goals for hair loss treatment?",
    questions: [
      {
        id: "hairGoals",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "I want to prevent further hair loss",
          "I want to regrow hair",
          "I want fuller, thicker-looking hair",
          "I have a full head of hair I'd like to maintain"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "hairLossLocation",
    title: "Where are you noticing hair loss or thinning?",
    questions: [
      {
        id: "hairLossLocation",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "Both hairline and crown",
          "Receding hairline (along my forehead or temples)",
          "Thinning crown (top of my head)",
          "Overall thinning",
          "Random golf-ball size bald patches scattered all over scalp",
          "Nowhere yet, but I'd like to prevent future hair loss"
        ],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "previousTreatment",
    title: "Have you ever treated your hair loss with medication?",
    questions: [
      {
        id: "previousTreatment",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: ["Yes", "No"],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "previousTreatmentDetails",
    title: "What treatments did you receive?",
    renderCondition: (answers) => answers.previousTreatment === "Yes",
    questions: [
      {
        id: "previousTreatmentTypes",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Oral minoxidil",
          "Topical minoxidil or Rogaine",
          "Oral Finasteride or Propecia",
          "Topical finasteride",
          "Steroid injections in the scalp",
          "Other"
        ],
        required: false,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "treatmentExperience",
    title: "Please tell us more about your treatment experience (effectiveness, side effects, etc.).",
    renderCondition: (answers) => answers.previousTreatment === "Yes",
    questions: [
      {
        id: "treatmentExperience",
        type: "textarea",
        required: false,
        placeholder: "Describe your treatment experience",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "hairLossSymptoms",
    title: "Have you noticed any of the following?",
    questions: [
      {
        id: "hairLossSymptoms",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Redness or rashes on scalp",
          "Pain, soreness, burning, and/or tingling in areas of hair loss",
          "Recurrent pus bumps or open sores on scalp",
          "Partial or complete loss of eyebrows or eyelashes",
          "Loss of body hair",
          "None of the above"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "bloodPressureHistory",
    title: "Have you ever been diagnosed with or treated for high or low blood pressure?",
    questions: [
      {
        id: "bloodPressureHistory",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: [
          "No",
          "Yes, I have been diagnosed or treated for high blood pressure",
          "Yes, I have been diagnosed or treated for low blood pressure",
          "I'm not sure"
        ],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "medicalConditionsHair",
    title: "Do you have, or have you ever had, any of the following conditions?",
    questions: [
      {
        id: "medicalConditionsHair",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Heart failure",
          "Pericarditis",
          "Benign Prostatic Hyperplasia",
          "Repeated chest pain or tightness, also called angina",
          "Arrhythmia or abnormal heart rhythm",
          "Coronary artery disease, or narrowing of the heart vessels",
          "Coronary bypass surgery",
          "Heart attack",
          "Stroke",
          "Pheochromocytoma (adrenal gland tumor)",
          "Pulmonary hypertension",
          "Prostate cancer",
          "Kidney disease",
          "Liver disease",
          "Erectile Dysfunction",
          "Anxiety",
          "Depression",
          "Eczema",
          "None of the above"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "currentMedicationsHair",
    title: "Please list any prescription medications, over-the-counter medications, vitamins, dietary supplements, and topical creams you are currently taking or using, including dosages. Please type N/A if none.",
    questions: [
      {
        id: "currentMedicationsHair",
        type: "textarea",
        required: true,
        placeholder: "List medications with dosages, or type N/A",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "hairMedicationAllergies",
    title: "Are you allergic to any of the following? Please select all that apply.",
    questions: [
      {
        id: "hairMedicationAllergies",
        type: "MULTISELECT",
        displayAsRow: true,
        options: [
          "Finasteride (oral or topical)",
          "Minoxidil (oral or topical)",
          "Ketoconazole (oral or topical)",
          "Latanoprost",
          "None of the above"
        ],
        required: true,
        apiType: "MULTISELECT",
      },
    ],
  },
  {
    id: "allergiesHair",
    title: "Please list all of your known allergies. Please type N/A if none.",
    questions: [
      {
        id: "allergiesHair",
        type: "textarea",
        required: true,
        placeholder: "List all known allergies, or type N/A",
        apiType: "TEXT",
      },
    ],
  },
  {
    id: "additionalInfoHair",
    title: "Is there anything else you want your doctor to know about your condition or health?",
    questions: [
      {
        id: "additionalInfoHair",
        type: "SINGLESELECT",
        displayAsRow: true,
        options: ["Yes", "No"],
        required: true,
        apiType: "SINGLESELECT",
      },
    ],
  },
  {
    id: "doctorMessageHair",
    title: "Please leave your message to your doctor here.",
    renderCondition: (answers) => answers.additionalInfoHair === "Yes",
    questions: [
      {
        id: "doctorMessageHair",
        type: "textarea",
        required: false,
        placeholder: "Your message to your doctor",
        apiType: "TEXT",
      },
    ],
  },
];

export const contactFormSteps: FormStep[] = [
  {
    id: "dob",
    title: "What is your date of birth?",
    questions: [
      {
        id: "dobMonth",
        question: "Month",
        type: "DROPDOWN",
        required: true,
        options: Array.from({ length: 12 }, (_, i) => i + 1),
        optionLabels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        apiType: "DATE",
      },
      {
        id: "dobDay",
        question: "Day",
        type: "DROPDOWN",
        required: true,
        options: Array.from({ length: 31 }, (_, i) => i + 1),
        apiType: "DATE",
      },
      {
        id: "dobYear",
        question: "Year",
        type: "DROPDOWN",
        required: true,
        options: Array.from({ length: 90 }, (_, i) => 2010 - i),
        apiType: "DATE",
      },
    ],
  },
  {
    id: "idUploadUniversal",
    title: "Please upload a government issued form of ID: Driver's License, Passport, etc",
    questionSubtext: "Be sure that your full name and photo are easily visible",
    questions: [
      {
        id: "firstName",
        question: "First Name",
        type: "text",
        required: true,
        placeholder: "Enter your first name",
        apiType: "TEXT",
        validation: ["required"],
      },
      {
        id: "lastName",
        question: "Last Name",
        type: "text",
        required: true,
        placeholder: "Enter your last name",
        apiType: "TEXT",
        validation: ["required"],
      },
      // {
      //   id: "idUploadUniversal",
      //   type: "FILE_INPUT",
      //   question: "id",
      //   displayQuestion: " ",
      //   required: true,
      //   apiType: "FILE",
      // },
    ],
  },
  {
    id: "personalInfo",
    heading1: "Let's get your contact details",
    heading2: "to complete your intake form",
    questions: [
      {
        id: "email",
        question: "Email Address",
        type: "email",
        required: true,
        placeholder: "you@example.com",
        apiType: "TEXT",
        icon: "/assets/images/intake-form/icons/email-icon.svg",
        validation: ["required", "email"],
      },
      {
        id: "phone",
        question: "Phone Number",
        type: "tel",
        required: true,
        placeholder: "123-456-7890",
        apiType: "TEXT",
        icon: "/assets/images/intake-form/icons/phone-icon.svg",
        validation: ["required", "phone"],
      },
      {
        id: "consent",
        type: "CHECKBOX",
        required: true,
        options: ["I confirm that I am the patient completing this intake form and have reviewed all questions carefully. I attest that my answers are true, accurate, and complete to the best of my knowledge. I understand the importance of providing my doctor with complete and accurate health information for my care."],
        apiType: "SINGLESELECT",
      },
    ],
  },
];