<template>
  <div class="space-y-3">
    <!-- Preview -->
    <div
      v-if="previewUrl || currentImageUrl"
      class="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200"
      data-testid="image-uploader-preview"
    >
      <img
        :src="previewUrl || currentImageUrl"
        alt="Preview"
        class="w-full h-full object-cover"
        data-testid="image-uploader-preview-image"
      />
      <Button
        icon="pi pi-times"
        severity="danger"
        rounded
        class="absolute top-2 right-2"
        @click="handleRemove"
        data-testid="image-uploader-remove-button"
      />
    </div>

    <!-- Upload Area -->
    <div
      v-if="!previewUrl && !currentImageUrl"
      class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
      :class="{ 'border-red-500 bg-red-50': isDragActive || errorMessage }"
      @click="triggerFileInput"
      @dragover.prevent="isDragActive = true"
      @dragleave.prevent="isDragActive = false"
      @drop.prevent="handleDrop"
      data-testid="image-uploader-dropzone"
    >
      <i class="pi pi-cloud-upload text-4xl text-gray-400 mb-2 block"></i>
      <p class="text-gray-600 font-medium mb-1">
        Click to upload or drag and drop
      </p>
      <p class="text-sm text-gray-500">
        JPG, PNG, GIF or WebP (Max 5MB)
      </p>
    </div>

    <!-- Hidden File Input -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/jpeg,image/png,image/gif,image/webp"
      class="hidden"
      @change="handleFileSelect"
      data-testid="image-uploader-file-input"
    />

    <!-- Error Message -->
    <small v-if="errorMessage" class="text-red-500 block" data-testid="image-uploader-error">
      {{ errorMessage }}
    </small>

    <!-- File Info -->
    <div
      v-if="selectedFile"
      class="text-sm text-gray-600"
      data-testid="image-uploader-file-info"
    >
      <i class="pi pi-file mr-1"></i>
      {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import Button from 'primevue/button';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export default defineComponent({
  name: 'ImageUploader',
  components: {
    Button,
  },
  props: {
    currentImageUrl: {
      type: String,
      default: undefined,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const fileInputRef = ref<HTMLInputElement | null>(null);
    const selectedFile = ref<File | null>(null);
    const previewUrl = ref<string>('');
    const errorMessage = ref<string>('');
    const isDragActive = ref(false);

    // Reset when currentImageUrl changes
    watch(
      () => props.currentImageUrl,
      () => {
        selectedFile.value = null;
        previewUrl.value = '';
        errorMessage.value = '';
      }
    );

    function triggerFileInput() {
      fileInputRef.value?.click();
    }

    function validateFile(file: File): boolean {
      errorMessage.value = '';

      if (!ALLOWED_TYPES.includes(file.type)) {
        errorMessage.value = 'Invalid file type. Please upload JPG, PNG, GIF or WebP';
        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        errorMessage.value = 'File size exceeds 5MB limit';
        return false;
      }

      return true;
    }

    function processFile(file: File) {
      if (!validateFile(file)) {
        return;
      }

      selectedFile.value = file;

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrl.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      emit('change', file);
    }

    function handleFileSelect(event: Event) {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        processFile(file);
      }
    }

    function handleDrop(event: DragEvent) {
      isDragActive.value = false;
      const file = event.dataTransfer?.files[0];
      if (file) {
        processFile(file);
      }
    }

    function handleRemove() {
      selectedFile.value = null;
      previewUrl.value = '';
      errorMessage.value = '';
      if (fileInputRef.value) {
        fileInputRef.value.value = '';
      }
      emit('change', null);
    }

    function formatFileSize(bytes: number): string {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    return {
      fileInputRef,
      selectedFile,
      previewUrl,
      errorMessage,
      isDragActive,
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      handleRemove,
      formatFileSize,
    };
  },
});
</script>
