<template>
  <div>
    <label
      v-if="question.question"
      class="block text-base font-medium text-bodyColor mb-2"
    >
      {{ question.question }}
      <span v-if="question.required" class="text-red-500">*</span>
    </label>

    <!-- Main drop zone container -->
    <div
      class="relative w-full h-[280px] rounded-[10px] bg-white flex items-center justify-center"
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
      @click="triggerFileInput"
    >
      <!-- Inner dashed line container -->
      <div class="w-full h-full rounded-[12px] p-5 bg-backgroundColor">
        <div
          class="flex w-full h-full flex-col items-center justify-center border-2 border-dashed border-accentColor1 rounded-[10px]"
        >
          <!-- File drop icon -->
          <img
            src="/assets/images/intake-form/icons/filedrop-icon.png"
            alt="File upload"
            class="h-20 mb-4"
          />

          <!-- Text instructions -->
          <div class="text-center">
            <p class="text-lg font-semibold text-gray-900 mb-1">
              Drop your image here, or
              <span class="text-accentColor1 cursor-pointer hover:text-blue-700"
                >browse</span
              >
            </p>
            <p class="text-sm text-gray-500">
              Accepted file types include: docx, pdf, and images
            </p>
          </div>
        </div>
      </div>

      <!-- Hidden file input -->
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        @change="handleFileChange"
        accept=".docx,.pdf,.png,.jpg,.jpeg,.gif"
      />
    </div>

    <!-- File selected indicator -->
    <div v-if="fileName" class="mt-3 text-sm text-green-600 font-medium">
      ✓ File selected: {{ fileName }}
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="mt-3 text-sm text-red-600">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { convertFileToBase64 } from "~/utils/intake-form/convertFile";

// --- TYPE DEFINITIONS ---
interface FileInputQuestion {
  id: string;
  question?: string;
  required?: boolean;
}

// --- PROPS & EMITS ---
const props = defineProps<{
  question: FileInputQuestion;
  modelValue: { name: string; contentType: string; data?: string; fileId?: string } | null;
}>();

const emit = defineEmits(["update:modelValue"]);

// --- REACTIVE STATE ---
const fileName = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// --- METHODS ---
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    await processFile(file);
  }
};

const handleDrop = async (event: DragEvent) => {
  event.preventDefault();
  const files = event.dataTransfer?.files;

  if (files && files.length > 0) {
    const file = files[0];
    if (file) {
      await processFile(file);
    }
  }
};

const processFile = async (file: File) => {
  // Clear previous error
  errorMessage.value = null;

  // Validate file type
  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/pdf", // .pdf
    "image/png", // .png
    "image/jpeg", // .jpg, .jpeg
    "image/jpg", // .jpg
    "image/gif", // .gif
  ];

  if (!allowedTypes.includes(file.type)) {
    errorMessage.value =
      "Please select a valid file type (docx, pdf, or image)";
    return;
  }

  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    errorMessage.value = "File size must be less than 10MB";
    return;
  }

  try {
    fileName.value = file.name;
    
    // Upload file to server instead of storing in localStorage
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await $fetch('/api/upload-file', {
      method: 'POST',
      body: formData
    });

    if (response.success) {
      // Store only the file ID and metadata, not the actual data
      emit("update:modelValue", {
        name: response.fileName,
        contentType: response.contentType,
        fileId: response.fileId, // Store the server file ID
        data: null // Don't store the actual data
      });
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    // Provide user-friendly error message
    let userErrorMessage = "Error uploading file. Please try again.";

    if (error instanceof Error && error.message) {
      if (error.message.includes("size")) {
        userErrorMessage = "File is too large. Please select a smaller file.";
      } else if (error.message.includes("type")) {
        userErrorMessage =
          "Unsupported file type. Please select a different file.";
      } else if (error.message.includes("network")) {
        userErrorMessage = "Network error. Please check your connection.";
      } else {
        userErrorMessage = error.message;
      }
    }

    errorMessage.value = userErrorMessage;
    fileName.value = null;
    emit("update:modelValue", null);

    // Error handling complete
  }
};

// Initialize fileName from existing modelValue
const initializeFileName = () => {
  if (props.modelValue && props.modelValue.name) {
    fileName.value = props.modelValue.name;
  } else {
    fileName.value = null;
  }
};

// --- WATCHERS ---
// Watch for changes in modelValue (e.g., when form data is restored)
watch(() => props.modelValue, initializeFileName, { immediate: true });

// --- LIFECYCLE ---
onMounted(() => {
  initializeFileName();
});
</script>

<style scoped>
/* Custom cursor for the drop zone */
.relative {
  cursor: pointer;
}

/* Hover effect for the drop zone */
.relative:hover {
  border-color: #4c4cf2;
  background-color: #fafaff;
}

/* Hover effect for the inner container */
.relative:hover .w-full {
  border-color: #4c4cf2;
}
</style>
