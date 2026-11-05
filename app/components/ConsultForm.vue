<template>
  <div class="consult-form-wrapper">
    <form class="consult-form" @submit.prevent="handleFormSubmit">
      <div class="form-group">
        <label>{{ t('quote.fullname') }}</label>
        <input v-model="form.name" type="text" required :placeholder="t('consult_form.name_placeholder')" />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>{{ t('quote.phone') }}</label>
          <input v-model="form.phone" type="tel" required :placeholder="t('consult_form.phone_placeholder')" />
        </div>
        <div class="form-group">
          <label>{{ t('quote.email') }}</label>
          <input v-model="form.email" type="email" required :placeholder="t('consult_form.email_placeholder')" />
        </div>
      </div>

      <div v-if="showDetailedFields" class="form-row">
        <div class="form-group">
          <label>{{ t('quote.category') }}</label>
          <select v-model="form.serviceType">
            <option v-for="service in serviceOptions" :key="service" :value="service">
              {{ service }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>{{ t('quote.budget_area') }}</label>
          <input v-model="form.budgetArea" type="text" :placeholder="t('consultation_form.budget_area_placeholder', '100m², 1.5 tỷ...')" />
        </div>
      </div>

      <div class="form-group">
        <label>{{ t('quote.description') }}</label>
        <textarea v-model="form.content" rows="4" :placeholder="t('consult_form.content_placeholder')"></textarea>
      </div>

      <button type="submit" class="btn-submit" :disabled="submitting">
        {{ submitting ? t('common.sending') : submitBtnText || t('consult_form.submit') }}
      </button>

      <div v-if="submitMessage" class="submit-msg" :class="{ 'msg-success': submitSuccess, 'msg-error': !submitSuccess }">
        {{ submitMessage }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { submitConsultRequest } from '~/services/consultService'
import { useI18n } from '~/composables/useI18n'
import { DEFAULT_SERVICE_OPTIONS } from '~/utils/consultHelper'

const props = defineProps<{
  showDetailedFields?: boolean
  submitBtnText?: string
}>()

const { t } = useI18n()
const serviceOptions = DEFAULT_SERVICE_OPTIONS

const form = ref({
  name: '',
  phone: '',
  email: '',
  serviceType: DEFAULT_SERVICE_OPTIONS[0],
  budgetArea: '',
  content: '',
})

const submitting = ref(false)
const submitMessage = ref('')
const submitSuccess = ref(false)

const handleFormSubmit = async () => {
  submitting.value = true
  submitMessage.value = ''

  const res = await submitConsultRequest(form.value)
  submitSuccess.value = res.success
  submitMessage.value = res.success ? t('quote.success_msg') : (res.message || t('quote.error_msg'))

  if (res.success) {
    form.value = {
      name: '',
      phone: '',
      email: '',
      serviceType: DEFAULT_SERVICE_OPTIONS[0],
      budgetArea: '',
      content: '',
    }
  }

  submitting.value = false
}
</script>

<style scoped>
.consult-form {
  background: #ffffff;
  padding: 32px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  outline: none;
  background-color: #ffffff;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #d97706;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: #d97706;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #b45309;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-msg {
  margin-top: 14px;
  font-size: 14px;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  line-height: 1.5;
}

.msg-success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
}

.msg-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
