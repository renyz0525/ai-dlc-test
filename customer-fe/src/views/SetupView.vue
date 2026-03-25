<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md" data-testid="setup-form">
      <h1 class="text-2xl font-bold text-center mb-6">테이블 설정</h1>
      <p class="text-gray-500 text-center mb-8 text-sm">관리자가 태블릿 초기 설정을 진행합니다</p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">매장 ID</label>
          <InputText
            v-model="form.storeId"
            placeholder="매장 ID를 입력하세요"
            class="w-full"
            data-testid="setup-store-id"
            :disabled="isLoading"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">테이블 번호</label>
          <InputText
            v-model.number="form.tableNumber"
            type="number"
            placeholder="테이블 번호를 입력하세요"
            class="w-full"
            data-testid="setup-table-number"
            :disabled="isLoading"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
          <Password
            v-model="form.password"
            placeholder="비밀번호를 입력하세요"
            class="w-full"
            :feedback="false"
            toggleMask
            inputClass="w-full"
            data-testid="setup-password"
            :disabled="isLoading"
          />
        </div>

        <p v-if="error" class="text-red-500 text-sm" data-testid="setup-error">{{ error }}</p>

        <Button
          type="submit"
          label="설정 완료"
          class="w-full"
          :loading="isLoading"
          data-testid="setup-submit-button"
        />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const store = useStore()
const router = useRouter()

const form = reactive({
  storeId: '',
  tableNumber: null as number | null,
  password: '',
})

const isLoading = ref(false)
const error = ref<string | null>(null)

async function handleSubmit() {
  if (!form.storeId || !form.tableNumber || !form.password) {
    error.value = '모든 필드를 입력해주세요'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    await store.dispatch('auth/login', {
      storeId: form.storeId,
      tableNumber: form.tableNumber,
      password: form.password,
    })
    router.push('/')
  } catch (e) {
    error.value = e instanceof Error ? e.message : '로그인에 실패했습니다'
  } finally {
    isLoading.value = false
  }
}
</script>
