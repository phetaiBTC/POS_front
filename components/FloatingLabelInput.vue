<template>
  <div class="input-container" :class="[width || 'w-full']">
    <input :type="inputType" :placeholder="label" :value="modelValue" required
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
    <label>{{ label }}</label>
    <i v-if="icon" :class="`${icon}`" style="  top: 50%;left: 20px;"></i>
    <i v-if="isPassword" :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" class="pass" @click="toggleEye" style="right: 0px;"></i>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  type?: string;
  label: string;
  modelValue: string;
  width?: string;
  icon?: string;
}>();

defineEmits(["update:modelValue"]);

const showPassword = ref(false);

const isPassword = computed(() => props.type === "password");
const inputType = computed(() => (showPassword.value ? "text" : props.type || "text"));

const toggleEye = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
.input-container {
  position: relative;
  margin: 0.5rem 0;
}

.input-container input {
  width: 100%;
  background-color: white;
  padding: 0.5rem;
  padding-left: 35px;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  outline: none;
  transition: border-color 0.2s ease-in-out;
}

.input-container input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.input-container input::placeholder {
  color: transparent;
}

.input-container label {
  position: absolute;
  background-color: white;
  padding: 0 0.25rem;
  left: 35px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  transition: all 0.2s ease-in-out;
  pointer-events: none;
}

.input-container input:focus+label,
.input-container input:not(:placeholder-shown)+label {
  top: 0;
  left: 8px;
  font-size: 0.775rem;
  color: #3b82f6;
}
.input-container i{
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #6b7280;
}
</style>
