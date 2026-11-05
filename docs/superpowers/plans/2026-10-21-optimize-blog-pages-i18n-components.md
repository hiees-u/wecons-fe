# Optimize Blog Pages (i18n & Component Extraction) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Blog/Article pages (`app/pages/bai-viet/index.vue` and `app/pages/bai-viet/[slug].vue`) to extract reusable editorial components and replace all hardcoded text with multi-language i18n keys (`vi.json` and `en.json`).

**Architecture:** 
- Extract modular Vue components under `app/components/blog/`: `BlogFeaturedCard.vue`, `BlogCard.vue`, `ArticleContent.vue`, and `ArticleRelated.vue`.
- Add comprehensive translation keys for `blog_page` and `article_detail` to `app/locales/vi.json` and `app/locales/en.json`.
- Integrate `useI18n()` composable into `app/pages/bai-viet/index.vue` and `app/pages/bai-viet/[slug].vue`.

**Tech Stack:** Nuxt 4 (compatibilityVersion 4), Vue 3 Composition API, TypeScript, Custom i18n (`useI18n`).

---

## Global Constraints
- Maintain existing routes and aliases (`/bai-viet`, `/blog`, `/bai-viet/:slug`, `/blog/:slug`).
- Preserve the luxury editorial dark theme styling and responsive layout.
- Strictly adhere to `useI18n()` dictionary format in `vi.json` and `en.json`.

---

## Tasks

### Task 1: Add Translation Keys to Locales (vi.json & en.json)
**Files:**
- Modify: `app/locales/vi.json`
- Modify: `app/locales/en.json`

- [ ] **Step 1: Add `blog_page` and `article_detail` translation dictionaries to `app/locales/vi.json`**
- [ ] **Step 2: Add matching English translations to `app/locales/en.json`**
- [ ] **Step 3: Verify JSON syntax validity**

---

### Task 2: Create Reusable Blog Components
**Files:**
- Create: `app/components/blog/BlogFeaturedCard.vue`
- Create: `app/components/blog/BlogCard.vue`
- Create: `app/components/blog/ArticleContent.vue`
- Create: `app/components/blog/ArticleRelated.vue`

- [ ] **Step 1: Create `BlogFeaturedCard.vue` for the featured article block**
- [ ] **Step 2: Create `BlogCard.vue` for articles in the 3-column grid**
- [ ] **Step 3: Create `ArticleContent.vue` to render dynamic content blocks and consultation CTA**
- [ ] **Step 4: Create `ArticleRelated.vue` for the related articles sidebar**

---

### Task 3: Refactor `app/pages/bai-viet/index.vue`
**Files:**
- Modify: `app/pages/bai-viet/index.vue`

- [ ] **Step 1: Replace hardcoded strings with `t('blog_page...')`**
- [ ] **Step 2: Use `BlogFeaturedCard` and `BlogCard` components**
- [ ] **Step 3: Test and verify page template rendering**

---

### Task 4: Refactor `app/pages/bai-viet/[slug].vue`
**Files:**
- Modify: `app/pages/bai-viet/[slug].vue`

- [ ] **Step 1: Replace hardcoded strings with `t('article_detail...')` and `useI18n()`**
- [ ] **Step 2: Use `ArticleContent` and `ArticleRelated` components**
- [ ] **Step 3: Test and verify article details rendering**

---

### Task 5: Build & Type-check Verification
**Files:**
- Run verification checks across the frontend workspace

- [ ] **Step 1: Run `yarn nuxt prepare` to verify type generation**
- [ ] **Step 2: Verify zero build/syntax errors**
