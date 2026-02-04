<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Quiz Configuration Viewer</h1>
        <p class="text-gray-600">Explore all quiz configurations, questions, conditions, and types</p>
        <div class="mt-4 flex gap-4 items-center">
          <div class="text-sm">
            <span class="font-semibold">Total Quizzes:</span> {{ allQuizzes.length }}
          </div>
          <div class="text-sm">
            <span class="font-semibold">JSON Quizzes:</span> 
            <span class="text-blue-600">{{ jsonQuizzesCount }}</span>
          </div>
          <div class="text-sm">
            <span class="font-semibold">Hardcoded Quizzes:</span> 
            <span class="text-green-600">{{ hardcodedQuizzesCount }}</span>
          </div>
        </div>
      </div>

      <!-- Search/Filter -->
      <div class="mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search quizzes, questions, or types..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Quiz List -->
      <div class="space-y-4">
        <div
          v-for="quiz in filteredQuizzes"
          :key="quiz.id"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <!-- Quiz Header -->
          <div
            class="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
            @click="toggleQuiz(quiz.id)"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h2 class="text-2xl font-bold text-gray-900">{{ quiz.name }}</h2>
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded"
                    :class="getQuizSourceClass(quiz.id)"
                  >
                    {{ getQuizSource(quiz.id) }}
                  </span>
                </div>
                <p class="text-gray-600 mb-2">{{ quiz.description }}</p>
                <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span><strong>ID:</strong> {{ quiz.id }}</span>
                  <span><strong>Version:</strong> {{ quiz.version }}</span>
                  <span><strong>Category:</strong> {{ quiz.metadata.category }}</span>
                  <span><strong>Time:</strong> {{ quiz.metadata.estimatedTime }}</span>
                  <span><strong>Progress Steps:</strong> {{ quiz.progressSteps.length }}</span>
                  <span><strong>Form Steps:</strong> {{ quiz.steps.length }}</span>
                  <span><strong>Total Questions:</strong> {{ getTotalQuestions(quiz) }}</span>
                </div>
              </div>
              <div class="ml-4">
                <svg
                  class="w-6 h-6 text-gray-400 transition-transform"
                  :class="{ 'rotate-180': expandedQuizzes.has(quiz.id) }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Quiz Details (Collapsible) -->
          <div v-if="expandedQuizzes.has(quiz.id)" class="border-t border-gray-200">
            <!-- Progress Steps -->
            <div class="p-6 bg-blue-50">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Progress Steps</h3>
              <div class="flex gap-2 flex-wrap mb-4">
                <div
                  v-for="(step, index) in quiz.progressSteps"
                  :key="step.id"
                  class="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm"
                >
                  <div
                    class="w-4 h-4 rounded-full"
                    :style="{ backgroundColor: step.color }"
                  ></div>
                  <span class="font-medium">{{ step.name }}</span>
                  <span class="text-xs text-gray-500">({{ index + 1 }})</span>
                </div>
              </div>
              
              <!-- Step Progress Mapping Visualization -->
              <div class="mt-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-2">Step Progress Mapping</h4>
                <div class="space-y-2">
                  <div
                    v-for="mapping in quiz.stepProgressMapping"
                    :key="`${mapping.stepId}-${mapping.progressStepId}`"
                    class="flex items-center gap-2 text-sm bg-white px-3 py-2 rounded"
                  >
                    <span class="font-mono text-xs text-gray-600">{{ mapping.stepId }}</span>
                    <span class="text-gray-400">→</span>
                    <span
                      class="px-2 py-1 rounded text-xs font-medium"
                      :style="{
                        backgroundColor: getProgressStepColorById(quiz, mapping.progressStepId) + '20',
                        color: getProgressStepColorById(quiz, mapping.progressStepId)
                      }"
                    >
                      {{ getProgressStepNameById(quiz, mapping.progressStepId) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Form Steps -->
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Form Steps</h3>
              <div class="space-y-4">
                <div
                  v-for="(step, stepIndex) in quiz.steps"
                  :key="step.id"
                  class="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <!-- Form Step Header -->
                  <div
                    class="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    @click="toggleFormStep(`${quiz.id}-${step.id}`)"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <div class="flex items-center gap-3 mb-1">
                          <span class="text-sm font-medium text-gray-500">Step {{ stepIndex + 1 }}</span>
                          <h4 class="text-lg font-semibold text-gray-900">{{ step.id }}</h4>
                          <span
                            v-if="getProgressStepForFormStep(quiz, step.id)"
                            class="px-2 py-1 text-xs font-medium rounded"
                            :style="{
                              backgroundColor: getProgressStepColor(quiz, step.id) + '20',
                              color: getProgressStepColor(quiz, step.id)
                            }"
                          >
                            {{ getProgressStepName(quiz, step.id) }}
                          </span>
                        </div>
                        <div v-if="step.title" class="text-sm text-gray-600 mb-1">
                          <strong>Title:</strong> {{ step.title }}
                        </div>
                        <div v-if="step.heading1" class="text-sm text-gray-600 mb-1">
                          <strong>Heading:</strong> {{ step.heading1 }}
                        </div>
                        <div v-if="step.subtext" class="text-sm text-gray-500 italic">
                          {{ step.subtext }}
                        </div>
                        <div v-if="step.heading2" class="text-sm text-gray-600 mt-1">
                          <strong>Heading2:</strong> {{ step.heading2 }}
                        </div>
                        <div v-if="step.renderCondition" class="mt-2">
                          <span class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                            Conditional: {{ formatRenderCondition(step.renderCondition) }}
                          </span>
                        </div>
                        <div v-if="step.dynamicTitle || step.dynamicHeading1 || step.dynamicHeading2 || step.dynamicSubtext" class="mt-2 space-y-1">
                          <div v-if="step.dynamicTitle" class="text-xs text-purple-600">
                            <strong>Dynamic Title:</strong> {{ step.dynamicTitle }}
                          </div>
                          <div v-if="step.dynamicHeading1" class="text-xs text-purple-600">
                            <strong>Dynamic Heading1:</strong> {{ step.dynamicHeading1 }}
                          </div>
                          <div v-if="step.dynamicHeading2" class="text-xs text-purple-600">
                            <strong>Dynamic Heading2:</strong> {{ step.dynamicHeading2 }}
                          </div>
                          <div v-if="step.dynamicSubtext" class="text-xs text-purple-600">
                            <strong>Dynamic Subtext:</strong> {{ step.dynamicSubtext }}
                          </div>
                        </div>
                        <div v-if="step.showTrustBadges !== undefined || step.headingsInline !== undefined" class="mt-2 text-xs text-gray-500">
                          <span v-if="step.showTrustBadges" class="mr-2">Show Trust Badges</span>
                          <span v-if="step.headingsInline">Headings Inline</span>
                        </div>
                        <div class="mt-2 text-sm text-gray-500">
                          <strong>Questions:</strong> {{ step.questions.length }}
                        </div>
                      </div>
                      <svg
                        class="w-5 h-5 text-gray-400 transition-transform"
                        :class="{ 'rotate-180': expandedFormSteps.has(`${quiz.id}-${step.id}`) }"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <!-- Questions (Collapsible) -->
                  <div v-if="expandedFormSteps.has(`${quiz.id}-${step.id}`)" class="p-4 bg-white">
                    <div class="space-y-4">
                      <div
                        v-for="(question, qIndex) in step.questions"
                        :key="question.id"
                        class="border-l-4 pl-4"
                        :style="{ borderColor: getQuestionTypeColor(question.type) }"
                      >
                        <div class="flex items-start justify-between mb-2">
                          <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                              <span class="text-xs font-medium text-gray-500">Q{{ qIndex + 1 }}</span>
                              <span
                                class="px-2 py-1 text-xs font-bold rounded"
                                :style="{
                                  backgroundColor: getQuestionTypeColor(question.type) + '20',
                                  color: getQuestionTypeColor(question.type)
                                }"
                              >
                                {{ question.type }}
                              </span>
                              <span
                                v-if="question.required"
                                class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded"
                              >
                                Required
                              </span>
                            </div>
                            <div v-if="question.question" class="font-medium text-gray-900 mb-1">
                              {{ question.question }}
                            </div>
                            <div v-if="question.displayQuestion && question.displayQuestion !== question.question" class="text-sm text-gray-600 mb-1">
                              <strong>Display:</strong> {{ question.displayQuestion }}
                            </div>
                            <div v-if="question.placeholder" class="text-sm text-gray-500 italic mb-1">
                              Placeholder: "{{ question.placeholder }}"
                            </div>
                          </div>
                        </div>

                        <!-- Question Details -->
                        <div class="mt-2 space-y-2">
                          <!-- API Type -->
                          <div class="text-xs text-gray-500">
                            <strong>API Type:</strong> {{ question.apiType }}
                          </div>

                          <!-- Validation -->
                          <div v-if="question.validation && question.validation.length > 0" class="text-xs">
                            <strong>Validation:</strong>
                            <span
                              v-for="(val, vIndex) in question.validation"
                              :key="vIndex"
                              class="ml-1 px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded"
                            >
                              {{ val }}
                            </span>
                          </div>

                          <!-- Options (for SELECT types) -->
                          <div v-if="hasOptions(question)" class="mt-2">
                            <div class="text-xs font-medium text-gray-700 mb-1">Options:</div>
                            <div class="flex flex-wrap gap-2">
                              <div
                                v-for="(option, optIndex) in getQuestionOptions(question)"
                                :key="optIndex"
                                class="px-2 py-1 bg-gray-100 rounded text-xs flex items-center gap-1"
                              >
                                <img
                                  v-if="question.optionImages && question.optionImages[optIndex]"
                                  :src="question.optionImages[optIndex]"
                                  :alt="option.label || String(option.value)"
                                  class="w-4 h-4 object-contain"
                                />
                                <span class="font-medium">{{ option.value }}</span>
                                <span v-if="option.label && option.label !== String(option.value)" class="text-gray-600 ml-1">
                                  ({{ option.label }})
                                </span>
                              </div>
                            </div>
                          </div>

                          <!-- Type-specific fields -->
                          <div v-if="question.type === 'MARKETING'" class="text-xs text-gray-600 space-y-1">
                            <div v-if="question.image"><strong>Image:</strong> {{ question.image }}</div>
                            <div v-if="question.displayStatistics !== undefined">
                              <strong>Display Statistics:</strong> {{ question.displayStatistics }}
                            </div>
                          </div>
                          <div v-if="question.type === 'BEFORE_AFTER'" class="text-xs text-gray-600 space-y-1">
                            <div v-if="question.beforeImage"><strong>Before:</strong> {{ question.beforeImage }}</div>
                            <div v-if="question.afterImage"><strong>After:</strong> {{ question.afterImage }}</div>
                            <div v-if="question.quote"><strong>Quote:</strong> "{{ question.quote }}"</div>
                          </div>
                          <div v-if="hasOptions(question)" class="text-xs text-gray-600 space-y-1">
                            <div v-if="question.displayAsRow !== undefined">
                              <strong>Display as row:</strong> {{ question.displayAsRow }}
                            </div>
                            <div v-if="question.image">
                              <strong>Question Image:</strong> {{ question.image }}
                            </div>
                            <div v-if="question.optionImages && question.optionImages.length > 0">
                              <strong>Option Images:</strong> {{ question.optionImages.length }} image(s)
                            </div>
                          </div>
                          <div v-if="question.dynamicText" class="text-xs text-gray-600">
                            <strong>Dynamic Text:</strong> {{ question.dynamicText }}
                          </div>
                          <div v-if="question.icon" class="text-xs text-gray-600">
                            <strong>Icon:</strong> {{ question.icon }}
                          </div>
                          <div v-if="question.type === 'MEDICAL_REVIEW'" class="text-xs text-gray-600 space-y-1">
                            <div v-if="question.calculatedValues">
                              <strong>Calculated Values:</strong> {{ JSON.stringify(question.calculatedValues) }}
                            </div>
                            <div v-if="question.candidateStatement">
                              <strong>Candidate Statement:</strong> {{ question.candidateStatement }}
                            </div>
                          </div>
                          <div v-if="question.type === 'PERFECT'" class="text-xs text-gray-600 space-y-1">
                            <div v-if="question.heading1"><strong>Heading1:</strong> {{ question.heading1 }}</div>
                            <div v-if="question.dynamicSubtext"><strong>Dynamic Subtext:</strong> {{ question.dynamicSubtext }}</div>
                            <div v-if="question.subtext"><strong>Subtext:</strong> {{ question.subtext }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Metadata -->
            <div class="p-6 bg-gray-50 border-t border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <strong class="text-gray-700">Category:</strong>
                  <div class="text-gray-600">{{ quiz.metadata.category }}</div>
                </div>
                <div>
                  <strong class="text-gray-700">Estimated Time:</strong>
                  <div class="text-gray-600">{{ quiz.metadata.estimatedTime }}</div>
                </div>
                <div>
                  <strong class="text-gray-700">Target Audience:</strong>
                  <div class="text-gray-600">{{ quiz.metadata.targetAudience }}</div>
                </div>
                <div>
                  <strong class="text-gray-700">Compliance:</strong>
                  <div class="text-gray-600">{{ quiz.metadata.compliance.join(', ') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredQuizzes.length === 0" class="text-center py-12">
        <p class="text-gray-500">No quizzes found matching "{{ searchQuery }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getQuizById, getAvailableQuizzes, availableQuizzes } from '~/data/intake-form/quizConfigs';
import { loadQuizzesFromJson } from '~/utils/intake-form/transformQuizJson';
import type { QuizConfig, FormQuestion } from '~/types/intake-form/form';

const allQuizzes = ref<QuizConfig[]>([]);
const jsonQuizzes = ref<string[]>([]);
const searchQuery = ref('');
const expandedQuizzes = ref<Set<string>>(new Set());
const expandedFormSteps = ref<Set<string>>(new Set());

const jsonQuizzesCount = computed(() => jsonQuizzes.value.length);
const hardcodedQuizzesCount = computed(() => allQuizzes.value.length - jsonQuizzes.value.length);

const filteredQuizzes = computed(() => {
  if (!searchQuery.value) {
    return allQuizzes.value;
  }

  const query = searchQuery.value.toLowerCase();
  return allQuizzes.value.filter(quiz => {
    // Search in quiz name, description, ID
    if (
      quiz.name.toLowerCase().includes(query) ||
      quiz.description.toLowerCase().includes(query) ||
      quiz.id.toLowerCase().includes(query)
    ) {
      return true;
    }

    // Search in questions
    return quiz.steps.some(step =>
      step.questions.some(q =>
        q.question?.toLowerCase().includes(query) ||
        q.type.toLowerCase().includes(query) ||
        q.id.toLowerCase().includes(query)
      )
    );
  });
});

onMounted(async () => {
  // Load all quizzes
  try {
    allQuizzes.value = getAvailableQuizzes();
  } catch (error) {
    console.error('Error loading quizzes:', error);
    // Fallback to availableQuizzes export
    allQuizzes.value = availableQuizzes;
  }
  
  // Identify JSON quizzes - try both sync and async
  try {
    // Try sync first
    let jsonQuizzesList = loadQuizzesFromJson();
    
    // If sync returned empty, try async
    if (jsonQuizzesList.length === 0) {
      const { loadQuizzesFromJsonAsync } = await import('~/utils/intake-form/transformQuizJson');
      jsonQuizzesList = await loadQuizzesFromJsonAsync();
    }
    
    jsonQuizzes.value = jsonQuizzesList.map(q => q.id);
    
    // Log for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.log('JSON quizzes loaded:', jsonQuizzesList.length, jsonQuizzes.value);
    }
  } catch (error) {
    console.error('Error loading JSON quizzes:', error);
  }
  
  // Expand first quiz by default
  if (allQuizzes.value.length > 0) {
    expandedQuizzes.value.add(allQuizzes.value[0].id);
  }
});

function toggleQuiz(quizId: string) {
  if (expandedQuizzes.value.has(quizId)) {
    expandedQuizzes.value.delete(quizId);
    // Also collapse all form steps for this quiz
    Array.from(expandedFormSteps.value).forEach(key => {
      if (key.startsWith(quizId + '-')) {
        expandedFormSteps.value.delete(key);
      }
    });
  } else {
    expandedQuizzes.value.add(quizId);
  }
}

function toggleFormStep(key: string) {
  if (expandedFormSteps.value.has(key)) {
    expandedFormSteps.value.delete(key);
  } else {
    expandedFormSteps.value.add(key);
  }
}

function getQuizSource(quizId: string): string {
  return jsonQuizzes.value.includes(quizId) ? 'JSON' : 'Hardcoded';
}

function getQuizSourceClass(quizId: string): string {
  return jsonQuizzes.value.includes(quizId)
    ? 'bg-blue-100 text-blue-800'
    : 'bg-green-100 text-green-800';
}

function getTotalQuestions(quiz: QuizConfig): number {
  return quiz.steps.reduce((total, step) => total + step.questions.length, 0);
}

function getProgressStepForFormStep(quiz: QuizConfig, formStepId: string): string | undefined {
  const mapping = quiz.stepProgressMapping.find(m => m.stepId === formStepId);
  return mapping?.progressStepId;
}

function getProgressStepName(quiz: QuizConfig, formStepId: string): string {
  const progressStepId = getProgressStepForFormStep(quiz, formStepId);
  if (!progressStepId) return '';
  const step = quiz.progressSteps.find(ps => ps.id === progressStepId);
  return step?.name || progressStepId;
}

function getProgressStepColor(quiz: QuizConfig, formStepId: string): string {
  const progressStepId = getProgressStepForFormStep(quiz, formStepId);
  if (!progressStepId) return '#6B7280';
  const step = quiz.progressSteps.find(ps => ps.id === progressStepId);
  return step?.color || '#6B7280';
}

function getProgressStepNameById(quiz: QuizConfig, progressStepId: string): string {
  const step = quiz.progressSteps.find(ps => ps.id === progressStepId);
  return step?.name || progressStepId;
}

function getProgressStepColorById(quiz: QuizConfig, progressStepId: string): string {
  const step = quiz.progressSteps.find(ps => ps.id === progressStepId);
  return step?.color || '#6B7280';
}

function formatRenderCondition(condition: any): string {
  if (typeof condition === 'function') {
    return 'Function-based';
  }
  if (condition && condition.conditions) {
    return `${condition.logicalOperator}: ${condition.conditions.length} condition(s)`;
  }
  return 'Always show';
}

function getQuestionTypeColor(type: string): string {
  const colors: Record<string, string> = {
    text: '#3B82F6',
    email: '#10B981',
    number: '#8B5CF6',
    tel: '#F59E0B',
    textarea: '#6366F1',
    SINGLESELECT: '#EC4899',
    MULTISELECT: '#F43F5E',
    CHECKBOX: '#EF4444',
    DROPDOWN: '#14B8A6',
    MARKETING: '#A855F7',
    BEFORE_AFTER: '#06B6D4',
    FILE_INPUT: '#84CC16',
    MEDICAL_REVIEW: '#F97316',
    PERFECT: '#22C55E',
    WEIGHT_SUMMARY: '#64748B',
  };
  return colors[type] || '#6B7280';
}

function hasOptions(question: FormQuestion): boolean {
  return (
    question.type === 'SINGLESELECT' ||
    question.type === 'MULTISELECT' ||
    question.type === 'CHECKBOX' ||
    question.type === 'DROPDOWN'
  );
}

function getQuestionOptions(question: FormQuestion): Array<{ value: any; label?: string }> {
  if (!hasOptions(question) || !('options' in question)) {
    return [];
  }

  const options = question.options || [];
  const optionLabels = 'optionLabels' in question ? question.optionLabels : undefined;

  if (Array.isArray(options)) {
    return options.map((opt, index) => ({
      value: opt,
      label: optionLabels?.[index] || String(opt),
    }));
  }

  return [];
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
