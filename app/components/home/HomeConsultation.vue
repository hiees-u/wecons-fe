<template>
  <section id="consultation" class="consultation-section">
    <div class="consultation-backdrop" aria-hidden="true"></div>
    <div class="consultation-inner">
      <div class="consultation-copy">
        <p class="eyebrow"><span></span> {{ t('home.consultation.eyebrow') }}</p>
        <h2>{{ t('home.consultation.title_1') }}<br><em>{{ t('home.consultation.title_2') }}</em></h2>
        <p>{{ t('home.consultation.desc') }}</p>
        <div class="contact-placeholders">
          <span>{{ t('common.hotline_val', 'HOTLINE') }} <strong><a :href="`tel:${sanitizePhoneLink(settings.hotline)}`">{{ settings.hotline }}</a></strong></span>
          <span>{{ t('common.zalo_val', 'ZALO') }} <strong><a :href="`https://zalo.me/${sanitizePhoneLink(settings.hotline)}`" target="_blank" rel="noopener">{{ settings.hotline }}</a></strong></span>
          <span>{{ t('common.email_val', 'EMAIL') }} <strong><a :href="`mailto:${settings.email}`">{{ settings.email }}</a></strong></span>
          <span>{{ t('common.hq_val', 'TRỤ SỞ') }} <strong>{{ settings.address }}</strong></span>
        </div>
      </div>

      <form class="consultation-form" @submit.prevent="submitDemo">
        <div class="form-heading"><span>01 / 02</span><p>{{ t('consult_form.title') }}</p></div>
        <label for="consult-name">{{ t('home.consultation.form_name') }} <i>*</i></label>
        <input id="consult-name" v-model.trim="form.name" name="name" autocomplete="name" required minlength="2" :placeholder="t('home.consultation.form_name_placeholder')">
        <div class="form-row">
          <div>
            <label for="consult-phone">{{ t('home.consultation.form_phone') }} <i>*</i></label>
            <input id="consult-phone" v-model.trim="form.phone" name="phone" type="tel" autocomplete="tel" required @input="clearPhoneValidity" :placeholder="t('home.consultation.form_phone_placeholder')">
          </div>
          <div>
            <label for="consult-type">{{ t('home.consultation.form_type') }}</label>
            <select id="consult-type" v-model="form.projectType" name="projectType">
              <option value="" disabled>{{ t('home.consultation.form_type') }}</option>
              <option v-for="type in projectTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
        </div>
        <label for="consult-note">{{ t('home.consultation.form_note') }}</label>
        <textarea id="consult-note" v-model.trim="form.note" name="note" rows="3" :placeholder="t('home.consultation.form_note_placeholder')"></textarea>
        <button type="submit" class="button-gold form-submit">
          {{ t('home.consultation.btn_submit') }}
          <span class="cta-arrow" aria-hidden="true"><img src="/images/right-arrow.svg" alt="" width="24" height="14"></span>
        </button>
        <p v-if="submitted" class="demo-message" role="status" aria-live="polite">
          {{ t('home.consultation.disclaimer') }}
        </p>
        <p v-else class="form-disclaimer">{{ t('home.consultation.disclaimer') }}</p>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useSiteSettings } from '~/composables/useSiteSettings'
import { DEFAULT_PROJECT_TYPES, sanitizePhoneLink, validatePhone } from '~/utils/consultHelper'

const { t } = useI18n()
const { settings } = useSiteSettings()
const projectTypes = DEFAULT_PROJECT_TYPES

const form = reactive({
  name: '',
  phone: '',
  projectType: '',
  note: '',
})
const submitted = ref(false)

const clearPhoneValidity = (event: Event) => {
  const input = event.currentTarget as HTMLInputElement
  input.setCustomValidity('')
}

const submitDemo = (event: SubmitEvent) => {
  const formElement = event.currentTarget as HTMLFormElement
  const phoneInput = formElement.elements.namedItem('phone') as HTMLInputElement
  if (!validatePhone(form.phone)) {
    phoneInput.setCustomValidity(t('consultation_form.val_phone_required'))
    phoneInput.reportValidity()
    return
  }
  phoneInput.setCustomValidity('')
  submitted.value = true
}
</script>
