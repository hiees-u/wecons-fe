<template>
  <div class="section-heading" :class="customClass" :style="styleCenter ? 'justify-content: center;' : ''">
    <div>
      <p v-if="eyebrow" class="eyebrow">
        <span></span> {{ eyebrow }}
      </p>
      <h2 :id="headingId">
        {{ title }}<br v-if="titleBreak"><em v-if="titleAccent"> {{ titleAccent }}</em>
      </h2>
    </div>
    <div v-if="intro || linkHref" class="section-heading-side">
      <p v-if="intro" class="section-intro">{{ intro }}</p>
      <NuxtLink v-if="linkHref && linkText" class="text-link" :to="linkHref">
        <span class="section-heading-link-desktop">{{ linkText }}</span>
        <span v-if="linkTextMobile" class="section-heading-link-mobile">{{ linkTextMobile }}</span>
        <span aria-hidden="true">↗</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  titleBreak?: boolean
  titleAccent?: string
  headingId?: string
  intro?: string
  linkHref?: string
  linkText?: string
  linkTextMobile?: string
  customClass?: string
  styleCenter?: boolean
}>()
</script>

<style scoped>
.section-heading-link-mobile {
  display: none;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 32px;
  margin-bottom: clamp(36px, 5vw, 64px);
}

.section-heading-side {
  max-width: 440px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
  text-align: right;
}

@media (max-width: 768px) {
  .section-heading {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    align-items: center;
  }

  .section-heading-side {
    align-items: flex-start;
    text-align: left;
  }

  .section-heading-link-mobile {
    display: none;
  }
}
</style>
