<template>
  <form id="consultation-form" class="consultation-lead-form" novalidate :aria-busy="submitting" @submit.prevent="handleSubmit">
    <div class="consultation-field">
      <label for="lead-name">{{ t('consultation_form.name_label') }} <span aria-hidden="true">*</span></label>
      <input
        id="lead-name"
        v-model.trim="form.name"
        name="name"
        type="text"
        autocomplete="name"
        maxlength="120"
        required
        :aria-invalid="Boolean(errors.name)"
        :aria-describedby="errors.name ? 'lead-name-error' : undefined"
        :placeholder="t('consultation_form.name_placeholder')"
        @input="clearError('name')"
      >
      <p v-if="errors.name" id="lead-name-error" class="field-error" role="alert">{{ errors.name }}</p>
    </div>

    <div class="consultation-field-grid">
      <div class="consultation-field">
        <label for="lead-email">{{ t('consultation_form.email_label') }} <span class="optional-label">{{ t('consultation_form.optional') }}</span></label>
        <input
          id="lead-email"
          v-model.trim="form.email"
          name="email"
          type="email"
          autocomplete="email"
          maxlength="120"
          :aria-invalid="Boolean(errors.email)"
          :aria-describedby="errors.email ? 'lead-email-error' : undefined"
          :placeholder="t('consultation_form.email_placeholder')"
          @input="clearError('email')"
        >
        <p v-if="errors.email" id="lead-email-error" class="field-error" role="alert">{{ errors.email }}</p>
      </div>
      <div class="consultation-field">
        <label for="lead-phone">{{ t('consultation_form.phone_label') }} <span aria-hidden="true">*</span></label>
        <input
          id="lead-phone"
          v-model.trim="form.phone"
          name="phone"
          type="tel"
          autocomplete="tel"
          maxlength="20"
          required
          :aria-invalid="Boolean(errors.phone)"
          :aria-describedby="errors.phone ? 'lead-phone-error' : undefined"
          :placeholder="t('consultation_form.phone_placeholder')"
          @input="clearError('phone')"
        >
        <p v-if="errors.phone" id="lead-phone-error" class="field-error" role="alert">{{ errors.phone }}</p>
      </div>
    </div>

    <div class="consultation-field">
      <label for="lead-note">{{ t('contact_page.message_label') }}</label>
      <textarea
        id="lead-note"
        v-model.trim="form.note"
        name="content"
        rows="4"
        maxlength="1400"
        :placeholder="t('contact_page.message_placeholder')"
      ></textarea>
    </div>

    <p v-if="statusMessage" class="form-status" :class="{ 'is-success': submitted, 'is-error': !submitted }" :role="submitted ? 'status' : 'alert'" aria-live="polite">
      {{ statusMessage }}
    </p>

    <button class="consultation-submit" type="submit" :disabled="submitting">
      <span>{{ submitting ? t('consultation_form.btn_submitting') : t('contact_page.form_submit') }}</span>
      <span aria-hidden="true">{{ submitting ? '…' : '↗' }}</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { submitConsultRequest } from '~/services/consultService'
import { useI18n } from '~/composables/useI18n'
import { validatePhone, validateEmail } from '~/utils/consultHelper'

type LeadField = 'name' | 'phone' | 'email'

const { t } = useI18n()
const form = reactive({ name: '', phone: '', email: '', note: '' })
const errors = reactive<Partial<Record<LeadField, string>>>({})
const submitting = ref(false)
const submitted = ref(false)
const statusMessage = ref('')

function clearError(field: LeadField): void {
  delete errors[field]
  statusMessage.value = ''
  submitted.value = false
}

function validateForm(): boolean {
  Object.keys(errors).forEach(field => delete errors[field as LeadField])

  if (form.name.length < 2) errors.name = t('consultation_form.val_name_required')
  if (!validatePhone(form.phone)) errors.phone = t('consultation_form.val_phone_required')
  if (form.email && !validateEmail(form.email)) errors.email = t('consultation_form.val_email_invalid')

  const firstInvalidField = (['name', 'email', 'phone'] as const).find(field => errors[field])
  if (firstInvalidField) {
    document.getElementById(`lead-${firstInvalidField}`)?.focus()
    return false
  }

  return true
}

async function handleSubmit(): Promise<void> {
  if (submitting.value || !validateForm()) return

  submitting.value = true
  statusMessage.value = ''
  submitted.value = false

  try {
    const response = await submitConsultRequest({
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      content: form.note,
    })

    if (!response.success) {
      statusMessage.value = response.message || t('consultation_form.error_message')
      return
    }

    submitted.value = true
    statusMessage.value = response.message || t('consultation_form.success_message')
    form.name = ''
    form.phone = ''
    form.email = ''
    form.note = ''
  } catch (error) {
    console.error('[Contact form] Request failed:', error)
    statusMessage.value = t('consultation_form.error_message')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.consultation-lead-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.consultation-field {
  min-width: 0;
}

.consultation-field label {
  display: flex;
  align-items: baseline;
  gap: 7px;
  margin-bottom: 7px;
  color: var(--color-text);
  font-size: 18px;
  font-weight: 600;
}

.consultation-field label > span:first-child:not(.optional-label) {
  color: var(--color-gold);
}

.optional-label {
  color: var(--color-subtle);
  font-size: 8px;
  font-weight: 500;
}

.consultation-field input,
.consultation-field textarea {
  display: block;
  width: 100%;
  min-height: 37px;
  padding: 8px 0;
  border: 0;
  border-bottom: 1px solid rgba(245, 242, 235, .22);
  border-radius: 0;
  outline: none;
  background: transparent;
  color: var(--color-text);
  font: inherit;
  font-size: 18px;
  transition: border-color 180ms ease;
}

.consultation-field textarea {
  min-height: 70px;
  resize: vertical;
}

.consultation-field input::placeholder,
.consultation-field textarea::placeholder {
  color: var(--color-subtle);
}

.consultation-field input:focus-visible,
.consultation-field textarea:focus-visible {
  border-color: var(--color-gold);
}

.consultation-field input[aria-invalid="true"] {
  border-color: #d98d7c;
}

.consultation-field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.field-error {
  margin-top: 5px;
  color: #e3a394;
  font-size: 11px;
  line-height: 1.5;
}

.form-status {
  padding: 10px 12px;
  border-left: 2px solid currentColor;
  background: rgba(245, 242, 235, .05);
  font-size: 11px;
  line-height: 1.6;
}

.form-status.is-success { color: #d8c79f; }
.form-status.is-error { color: #e3a394; }

.consultation-submit {
  display: flex;
  width: 100%;
  min-height: 43px;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 0 18px;
  border: 1px solid var(--color-gold);
  background: var(--color-gold);
  color: #100f0d;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .6px;
  cursor: pointer;
  transition: background-color 180ms ease, border-color 180ms ease;
}

.consultation-submit:hover:not(:disabled) {
  border-color: var(--color-gold-hover);
  background: var(--color-gold-hover);
}

.consultation-submit:focus-visible {
  outline: 2px solid var(--color-champagne);
  outline-offset: 4px;
}

.consultation-submit:disabled {
  cursor: wait;
  opacity: .7;
}

@media (max-width: 600px) {
  .consultation-field-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}
</style>
