# Frontend Nuxt conventions

## Scope

This folder contains the Nuxt frontend for the WE Construction site. Keep changes scoped to the frontend unless the work is explicitly cross-cutting with the Laravel API.

## Architecture

- Place page routes under `app/pages`.
- Place reusable UI under `app/components`, grouped by domain (for example `home`, `services`, `consultation`, `common`, `blog`, `pricing`).
- Put shared logic in `app/composables`, API adapters in `app/services`, typed models in `app/types`, and helper functions in `app/utils`.
- Keep `nuxt.config.ts` as the source of site metadata, runtime config, SEO defaults, and route rules.
- Prefer existing patterns over creating new abstraction layers.

## Coding patterns

- Use `script setup lang="ts"` for Vue components and pages when possible.
- Use `NuxtLink` for internal navigation instead of raw anchors.
- Use `useHead()` for page-specific SEO metadata and `useRuntimeConfig()` for environment-driven values.
- Prefer small, composable functions over large inline logic blocks.
- Reuse active patterns from nearby components before introducing a new component or helper.
- Keep CSS scoped to the component when possible. The project already uses component-level styles and global CSS assets for major site styling.

## Data and API conventions

- Keep API access centralized in `app/services` and composables.
- Prefer typed response objects under `app/types` instead of untyped inline data shapes.
- When an API call fails, handle the failure gracefully and keep the UI resilient.
- Keep external endpoints and public config values in `runtimeConfig.public` rather than hard-coded in components.

## Component conventions

- Name components by feature or domain, not by generic names like `Card.vue` unless it is clearly part of a shared UI set.
- Prefer descriptive, domain-based folders such as `home/`, `services/`, `pricing/`, `consultation/`, and `common/`.
- Keep one responsibility per component; page-level orchestration belongs in the page file, while reusable sections belong in components.
- Use `ref`, `computed`, and lifecycle hooks from Vue in the same style already used in the codebase.
- Use `aria-label` and semantic markup for interactive elements such as nav, forms, and toggles.

## Validation

- Validate frontend changes with the smallest relevant command: usually `npm run build` in the frontend folder.
- If a feature affects route generation, layout, or SEO config, check the related page and config together.
- Before broad refactors, look for the nearest existing component/page doing the same task.

## Important references

- [nuxt.config.ts](../nuxt.config.ts)
- [app/pages/index.vue](../app/pages/index.vue)
- [app/components/AppHeader.vue](../app/components/AppHeader.vue)
- [app/composables/useApi.ts](../app/composables/useApi.ts)
