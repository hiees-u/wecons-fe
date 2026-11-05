<template>
  <section class="footer-quick-contact" :aria-labelledby="titleId">
    <h2 :id="titleId">{{ t('footer.quick_form_title') }}</h2>
    <form novalidate :aria-busy="submitting" @submit.prevent="submit">
      <input
        id="footer-lead-name"
        ref="nameInput"
        v-model.trim="form.name"
        type="text"
        name="name"
        autocomplete="name"
        required
        maxlength="120"
        :aria-label="t('consultation_form.name_placeholder')"
        :aria-invalid="Boolean(errors.name)"
        :placeholder="t('consultation_form.name_placeholder')"
        @input="clearError('name')"
      >
      <p v-if="errors.name" class="footer-form-error" role="alert">{{ errors.name }}</p>

      <input
        id="footer-lead-phone"
        ref="phoneInput"
        v-model.trim="form.phone"
        type="tel"
        name="phone"
        autocomplete="tel"
        required
        maxlength="20"
        :aria-label="t('consultation_form.phone_placeholder')"
        :aria-invalid="Boolean(errors.phone)"
        :placeholder="t('consultation_form.phone_placeholder')"
        @input="clearError('phone')"
      >
      <p v-if="errors.phone" class="footer-form-error" role="alert">{{ errors.phone }}</p>

      <input
        id="footer-lead-email"
        ref="emailInput"
        v-model.trim="form.email"
        type="email"
        name="email"
        autocomplete="email"
        maxlength="120"
        :aria-label="t('consultation_form.email_placeholder')"
        :aria-invalid="Boolean(errors.email)"
        :placeholder="t('consultation_form.email_placeholder')"
        @input="clearError('email')"
      >
      <p v-if="errors.email" class="footer-form-error" role="alert">{{ errors.email }}</p>

      <p v-if="statusMessage" class="footer-form-status" :class="{ 'is-success': submitted }" :role="submitted ? 'status' : 'alert'">
        {{ statusMessage }}
      </p>

      <button type="submit" :disabled="submitting">
        <span>{{ submitting ? t('consultation_form.btn_submitting') : t('footer.quick_form_submit') }}</span>
        <span aria-hidden="true">{{ submitting ? '…' : '↗' }}</span>
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { submitConsultRequest } from '~/services/consultService'
import { useI18n } from '~/composables/useI18n'
import { validateEmail, validatePhone } from '~/utils/consultHelper'

type Field = 'name' | 'phone' | 'email'

const { t } = useI18n()
const titleId = 'footer-quick-contact-title'
const form = reactive({ name: '', phone: '', email: '' })
const errors = reactive<Partial<Record<Field, string>>>({})
const nameInput = ref<HTMLInputElement | null>(null)
const phoneInput = ref<HTMLInputElement | null>(null)
const emailInput = ref<HTMLInputElement | null>(null)
const submitting = ref(false)
const submitted = ref(false)
const statusMessage = ref('')

function clearError(field: Field): void {
  delete errors[field]
  statusMessage.value = ''
  submitted.value = false
}

function validate(): boolean {
  Object.keys(errors).forEach(field => delete errors[field as Field])

  if (form.name.length < 2) errors.name = t('consultation_form.val_name_required')
  if (!validatePhone(form.phone)) errors.phone = t('consultation_form.val_phone_required')
  if (!validateEmail(form.email)) errors.email = t('consultation_form.val_email_invalid')

  const invalidField = (['name', 'phone', 'email'] as const).find(field => errors[field])
  if (invalidField) {
    const input = {
      name: nameInput,
      phone: phoneInput,
      email: emailInput,
    }[invalidField]
    input.value?.focus()
    return false
  }

  return true
}

async function submit(): Promise<void> {
  if (submitting.value || !validate()) return

  submitting.value = true
  statusMessage.value = ''
  submitted.value = false

  try {
    const response = await submitConsultRequest({
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
    })

    submitted.value = response.success
    statusMessage.value = response.success
      ? t('footer.quick_form_success')
      : t('footer.quick_form_error')

    if (response.success) {
      form.name = ''
      form.phone = ''
      form.email = ''
    }
  } catch (error) {
    console.error('[Footer contact form] Request failed:', error)
    statusMessage.value = t('footer.quick_form_error')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.footer-quick-contact h2 {
  margin-bottom: 7px;
  color: var(--color-gold);
  font-family: var(--font-serif);
  font-size: 13px;
  font-weight: 400;
}

.footer-quick-contact form {
  display: grid;
  gap: 5px;
}

.footer-quick-contact input {
  width: 100%;
  min-width: 0;
  min-height: 34px;
  padding: 6px 8px;
  border: 1px solid rgba(245, 242, 235, 0.22);
  border-radius: 0;
  outline: none;
  background: #141414;
  color: var(--color-text);
  font: inherit;
  font-size: 10px;
}

.footer-quick-contact input::placeholder {
  color: var(--color-subtle);
}

.footer-quick-contact input:focus-visible {
  border-color: var(--color-gold);
}

.footer-quick-contact input[aria-invalid="true"] {
  border-color: #d98d7c;
}

.footer-quick-contact button {
  display: flex;
  min-height: 36px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 10px;
  border: 1px solid var(--color-gold);
  background: var(--color-gold);
  color: #100f0d;
  font-size: 9px;
  font-weight: 600;
  cursor: pointer;
}

.footer-quick-contact button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.footer-quick-contact button:focus-visible {
  outline: 2px solid var(--color-champagne);
  outline-offset: 3px;
}

.footer-form-error,
.footer-form-status {
  color: #e3a394;
  font-size: 9px;
  line-height: 1.4;
}

.footer-form-status.is-success {
  color: var(--color-champagne);
}
</style>
