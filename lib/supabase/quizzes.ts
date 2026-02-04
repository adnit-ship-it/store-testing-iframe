import { createClient } from '~/lib/supabase/client';
import type { FullQuiz } from '~/lib/types/database';
import type { QuizConfig, FormStep, FormQuestion } from '~/types/intake-form/form';

/**
 * Transforms a database quiz to the QuizConfig format expected by the form composable.
 * This function is responsible for mapping snake_case db fields to camelCase app fields.
 */
function transformDatabaseQuizToQuizConfig(dbQuiz: FullQuiz): QuizConfig {
  return {
    id: dbQuiz.slug, // Use the slug for the main ID in the app
    name: dbQuiz.name,
    description: dbQuiz.description,
    version: dbQuiz.version,
    progressSteps: dbQuiz.progressSteps.map(step => ({
      id: step.slug, // Use slug for ID
      name: step.name,
      description: step.description,
      color: step.color || "#A75809"
    })),
    stepProgressMapping: dbQuiz.stepProgressMapping.map(mapping => {
      // Find the form step slug using its UUID
      const formStepSlug = dbQuiz.formSteps.find(fs => fs.id === mapping.form_step_id)?.slug;
      // Find the progress step slug using its UUID
      const progressStepSlug = dbQuiz.progressSteps.find(ps => ps.id === mapping.progress_step_id)?.slug;
      return {
        stepId: formStepSlug || '',
        progressStepId: progressStepSlug || ''
      };
    }),
    steps: dbQuiz.formSteps.map((step): FormStep => ({
      id: step.slug, // Use slug for ID
      title: step.title,
      heading1: step.heading1,
      subtext: step.subtext,
      questionSubtext: step.subtext, // Alias for compatibility
      renderCondition: step.render_condition, // Include the render condition from database
      questions: step.questions?.map((question: any): FormQuestion => {
        const baseQuestion = {
          id: question.slug, // Use slug for ID
          question: question.question,
          displayQuestion: question.display_question,
          required: question.is_required,
          type: question.type as any, // Cast as needed if using a more specific enum
          placeholder: question.placeholder,
          apiType: question.api_type as any,
          options: question.options?.map((option: any) => option.value),
          optionLabels: question.options?.map((option: any) => option.label || option.value),
          // Map display_as_row from database, with fallback for SINGLESELECT and MULTISELECT
          displayAsRow: question.display_as_row ?? (question.type === 'SINGLESELECT' || question.type === 'MULTISELECT'),
          validation: question.validation_rules, // Correctly map snake_case to camelCase
        };

        // Add type-specific fields based on question type
        if (question.type === 'BEFORE_AFTER') {
          return {
            ...baseQuestion,
            beforeImage: question.before_image,
            afterImage: question.after_image,
            quote: question.quote,
          } as FormQuestion;
        }

        if (question.type === 'MARKETING' || question.type === 'SINGLESELECT' || question.type === 'MULTISELECT' || question.type === 'CHECKBOX') {
          return {
            ...baseQuestion,
            image: question.image,
          } as FormQuestion;
        }

        return baseQuestion as FormQuestion;
      }) || [],
      // Map other potential fields from the step if they exist
    })),
    metadata: {
      category: dbQuiz.metadata?.category || "medical",
      estimatedTime: dbQuiz.metadata?.estimatedTime || "15-20 minutes",
      targetAudience: dbQuiz.metadata?.targetAudience || "Adults seeking weight loss medication",
      compliance: dbQuiz.metadata?.compliance || ["HIPAA", "FDA guidelines"]
    }
  };
}

/**
 * Fetches a full quiz configuration from the database based on the organization and a product bundle ID.
 */
export async function getQuizByOrgAndProduct(organizationId: string, productBundleId: string): Promise<QuizConfig | null> {
  const supabase = createClient();

  const { data: quizData, error } = await supabase
    .from('quizzes')
    .select(`
      id, slug, name, description, version, metadata,
      progress_steps ( id, slug, name, description, color, step_order ),
      quiz_form_steps (
        step_order,
        form_steps (
          id, slug, title, heading1, subtext, config, render_condition,
          questions (
            id, slug, type, question, display_question, placeholder, is_required, question_order, api_type, validation_rules, display_as_row, image, before_image, after_image, quote,
            question_options ( id, value, label, option_order )
          )
        )
      ),
      step_progress_mapping ( form_step_id, progress_step_id )
    `)
    .eq('organization_id', organizationId)
    .contains('product_bundle_ids', [productBundleId])
    .single();

  if (error || !quizData) {
    console.error('Error fetching quiz for org/product:', organizationId, productBundleId, error);
    return null;
  }

  // The data from Supabase has a nested structure from the join table.
  // We need to transform it to match the clean `FullQuiz` type.
  const transformedQuiz: FullQuiz = {
    ...(quizData as any), // Cast to any to handle the raw Supabase response structure
    // Hoist the form_steps out of the join table and add the step_order
    formSteps: (quizData.quiz_form_steps || [])
      .map((joinResult: any) => ({
        ...joinResult.form_steps,
        step_order: joinResult.step_order,
        questions: (joinResult.form_steps.questions || []).sort((a: any, b: any) => a.question_order - b.question_order).map((q: any) => ({
            ...q,
            options: (q.question_options || []).sort((a: any, b: any) => a.option_order - b.option_order)
        }))
      }))
      .sort((a: any, b: any) => a.step_order - b.step_order),
    // Map related tables to the correct property names in FullQuiz
    progressSteps: (quizData.progress_steps || []).sort((a: any, b: any) => a.step_order - b.step_order),
    stepProgressMapping: quizData.step_progress_mapping,
  };
  
  // Clean up the raw join table properties that are now redundant
  delete (transformedQuiz as any).quiz_form_steps;
  // The step_progress_mapping is needed for the transformation, so we keep it.

  return transformDatabaseQuizToQuizConfig(transformedQuiz);
}

