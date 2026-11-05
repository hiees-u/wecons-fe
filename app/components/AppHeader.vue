<template>
  <header class="site-header site-header-home">
    <div class="nav-container">
      <NuxtLink to="/" class="brand-link" :aria-label="t('common.home_brand_aria', { name: brandName })" @click="closeMobileMenu">
        <img class="brand-logo" :src="logo" :alt="`${brandName} Logo`" width="244" height="60">
      </NuxtLink>

      <nav id="primary-navigation" class="nav-links" :class="{ 'nav-open': isMobileMenuOpen }" :aria-label="t('common.main_nav')">
        <div
          v-for="item in navItems"
          :key="item.pageHref"
          class="nav-entry"
          :class="{ 'submenu-open': isSubmenuOpen(item) }"
          @mouseenter="openSubmenu(item)"
          @mouseleave="onSubmenuMouseleave(item, $event)"
          @focusin="openSubmenu(item)"
          @focusout="onSubmenuFocusout(item, $event)"
        >
          <template v-if="getSubmenuType(item)">
            <NuxtLink
              :to="item.pageHref"
              class="nav-item submenu-nav-trigger submenu-nav-link"
              :class="{ 'is-active': isActivePage(item.pageHref) }"
              :aria-current="isActivePage(item.pageHref) ? 'page' : undefined"
              @click="closeMobileMenu"
            >
              {{ item.label }}
              <i class="fa-solid fa-angle-down" aria-hidden="true"></i>
            </NuxtLink>
            <button
              :id="`${getSubmenuType(item)}-submenu-toggle`"
              class="nav-item submenu-nav-trigger mobile-submenu-trigger"
              :class="{ 'is-active': isActivePage(item.pageHref) }"
              type="button"
              :aria-label="`${item.label}: ${isSubmenuOpen(item) ? 'Đóng danh sách' : 'Mở danh sách'}`"
              :aria-expanded="isSubmenuOpen(item)"
              :aria-controls="`${getSubmenuType(item)}-submenu`"
              @click="toggleSubmenu(item)"
            >
              {{ item.label }}
              <i class="fa-solid fa-angle-down" aria-hidden="true"></i>
            </button>
          </template>
          <NuxtLink
            v-else
            :to="item.pageHref"
            class="nav-item"
            :class="{ 'is-active': isActivePage(item.pageHref) }"
            :aria-current="isActivePage(item.pageHref) ? 'page' : undefined"
            @click="closeMobileMenu"
          >
            {{ item.label }}
          </NuxtLink>
          <div
            v-if="getSubmenuType(item)"
            :id="`${getSubmenuType(item)}-submenu`"
            class="nav-submenu"
          >
            <template v-if="getSubmenuType(item) === 'services'">
              <NuxtLink
                v-for="service in serviceHighlights"
                :key="service.id"
                :to="`/dich-vu/${encodeURIComponent(service.slug)}`"
                class="submenu-item"
                @click="closeMobileMenu"
              >
                {{ service.title }}
              </NuxtLink>
              <NuxtLink to="/dich-vu" class="submenu-item submenu-all" @click="closeMobileMenu">
                Hiển thị tất cả
              </NuxtLink>
            </template>
            <template v-else-if="getSubmenuType(item) === 'articles'">
              <NuxtLink
                v-for="category in postCategories"
                :key="category.id"
                :to="{ path: '/tin-tuc', query: { category_id: String(category.id) } }"
                class="submenu-item"
                @click="closeMobileMenu"
              >
                {{ category.name }}
              </NuxtLink>
              <NuxtLink to="/tin-tuc" class="submenu-item submenu-all" @click="closeMobileMenu">
                Hiển thị tất cả
              </NuxtLink>
            </template>
            <template v-else-if="getSubmenuType(item) === 'houseModels'">
              <NuxtLink
                v-for="category in houseModelCategories.filter(category => category.id !== 'all')"
                :key="category.id"
                :to="{ path: '/danh-muc-san-pham', query: { category: category.id } }"
                class="submenu-item"
                @click="closeMobileMenu"
              >
                {{ category.label }}
              </NuxtLink>
              <NuxtLink to="/danh-muc-san-pham" class="submenu-item submenu-all" @click="closeMobileMenu">
                Hiển thị tất cả
              </NuxtLink>
            </template>
          </div>
        </div>
      </nav>

      <button
        class="mobile-toggle"
        :class="{ 'is-active': isMobileMenuOpen }"
        :aria-expanded="isMobileMenuOpen"
        aria-controls="primary-navigation"
        :aria-label="isMobileMenuOpen ? t('common.close_nav') : t('common.open_nav')"
        @click="toggleMobileMenu"
      >
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '~/composables/useI18n'
import { useSiteSettings } from '~/composables/useSiteSettings'
import { useServiceHighlights } from '~/composables/useServiceHighlights'
import { useHouseModelCategories } from '~/composables/useHouseModelCategories'
import { usePostCategories } from '~/composables/usePostCategories'

const { t } = useI18n()
const { logo, settings, headerNav } = useSiteSettings()
const serviceHighlights = useServiceHighlights()
const { categories: houseModelCategories } = await useHouseModelCategories()
const { categories: postCategories } = await usePostCategories()
const brandName = computed(() => settings.siteName || 'WE Construction')
const isMobileMenuOpen = ref(false)
const activeSubmenu = ref<'services' | 'houseModels' | 'articles' | null>(null)
const route = useRoute()
const isHome = computed(() => route.path === '/')

const navItems = computed(() => {
  if (headerNav.value && headerNav.value.length > 0) {
    return headerNav.value
  }
  return [
    { label: t('nav.header_about'), pageHref: '/gioi-thieu' },
    { label: t('nav.header_services'), pageHref: '/dich-vu' },
    { label: t('nav.header_house_models'), pageHref: '/danh-muc-san-pham' },
    { label: t('nav.header_quote'), pageHref: '/bao-gia' },
    { label: t('nav.header_news'), pageHref: '/tin-tuc' },
    { label: t('nav.header_contact'), pageHref: '/lien-he' },
  ]
})

type SubmenuType = 'services' | 'houseModels' | 'articles'

const getSubmenuType = (item: { label: string; pageHref: string }): SubmenuType | null => {
  const label = item.label.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const href = item.pageHref.replace(/\/+$/, '')
  if (href === '/dich-vu' || href === '/services' || label.includes('dich vu')) return 'services'
  if (
    href === '/tin-tuc'
    || href === '/blog'
    || label.includes('bai viet')
    || label.includes('tin tuc')
    || label.includes('blog')
    || label.includes('news')
  ) return 'articles'
  // if (href === '/danh-muc-san-pham' || label.includes('mau nha dep')) return 'houseModels'
  return null
}

const isActivePage = (href: string) => route.path === href || route.path.startsWith(`${href}/`)

const isSubmenuOpen = (item: { label: string; pageHref: string }): boolean => {
  const submenuType = getSubmenuType(item)
  return submenuType !== null && activeSubmenu.value === submenuType
}

const toggleSubmenu = (item: { label: string; pageHref: string }): void => {
  const submenuType = getSubmenuType(item)
  if (submenuType) {
    activeSubmenu.value = activeSubmenu.value === submenuType ? null : submenuType
  }
}

const openSubmenu = (item: { label: string; pageHref: string }): void => {
  if (window.matchMedia('(min-width: 993px)').matches) {
    activeSubmenu.value = getSubmenuType(item)
  }
}

const closeSubmenu = (item: { label: string; pageHref: string }): void => {
  if (window.matchMedia('(min-width: 993px)').matches && isSubmenuOpen(item)) {
    activeSubmenu.value = null
  }
}

const onSubmenuMouseleave = (item: { label: string; pageHref: string }, event: MouseEvent): void => {
  if (event.currentTarget instanceof HTMLElement && event.currentTarget.contains(document.activeElement)) return
  closeSubmenu(item)
}

const onSubmenuFocusout = (item: { label: string; pageHref: string }, event: FocusEvent): void => {
  if (
    event.currentTarget instanceof HTMLElement
    && event.relatedTarget instanceof Node
    && event.currentTarget.contains(event.relatedTarget)
  ) return
  closeSubmenu(item)
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  activeSubmenu.value = null
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeMobileMenu()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  /* background: #090909; */
}

.site-header-home {
  background: linear-gradient(180deg, rgba(9, 9, 9, 0.88), rgba(9, 9, 9, 0));
}

.site-header-home .nav-container { max-width: 1440px; min-height: 76px; border-bottom: 0; }

.nav-container {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto /*minmax(0, 1fr)*/;
  align-items: center;
  min-height: 76px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 clamp(20px, 5vw, 76px);
  position: relative;
  border-bottom: 1px solid rgba(245, 242, 235, 0.16);
}

.brand-link {
  justify-self: start;
  color: #f5f2eb;
  text-decoration: none;
  flex-shrink: 0;
}

.brand-logo { display: block; width: 244px; height: 60px; }

.nav-links { display: flex; align-items: center; justify-self: center; }
.nav-entry { position: relative; display: flex; align-items: center; }
.nav-item { position: relative; padding: 12px clamp(8px, 1vw, 14px); color: rgba(245, 242, 235, 0.76); font-size: var(--type-nav); font-weight: 500; letter-spacing: 0.3px; text-decoration: none; white-space: nowrap; transition: color 0.2s; }
.nav-entry + .nav-entry .nav-item::before { position: absolute; top: 50%; left: 0; color: rgba(245, 242, 235, 0.45); content: "|"; font-weight: 400; transform: translateY(-50%); }
.nav-item::after { content: ""; position: absolute; right: 100%; bottom: 5px; left: 0; height: 1px; background: #d6b36a; transition: right 0.2s ease; }
.nav-item:hover, .nav-item:focus-visible, .nav-item.is-active { color: #e8d6ae; }
.nav-item:hover::after, .nav-item:focus-visible::after, .nav-item.is-active::after { right: 0; }
.submenu-nav-trigger { display: inline-flex; align-items: center; gap: 7px; border: 0; background: transparent; cursor: pointer; }
.submenu-nav-trigger i { font-size: 13px; transition: transform 0.2s ease; }
.submenu-open .submenu-nav-trigger i { transform: rotate(180deg); }
.nav-submenu { position: absolute; top: 100%; left: 0; z-index: 31; display: none; min-width: 240px; border: 1px solid rgba(214, 179, 106, 0.25); background: rgba(20, 20, 20, 0.98); }
.nav-entry.submenu-open > .nav-submenu { display: grid; }
.mobile-submenu-trigger { display: none; }
.submenu-item { padding: 11px 16px; color: rgba(245, 242, 235, 0.82); font-size: var(--type-nav); line-height: 1.4; text-decoration: none; }
.submenu-item:hover, .submenu-item:focus-visible { background: rgba(214, 179, 106, 0.1); color: #e8d6ae; }
.submenu-all { border-top: 1px solid rgba(245, 242, 235, 0.12); color: #e8d6ae; }
.mobile-toggle { display: none; }

@media (min-width: 993px) {
  .nav-submenu .submenu-all { display: none; }
}

@media (max-width: 1180px) and (min-width: 993px) {
  .nav-item { padding-right: 7px; padding-left: 7px; }
}

@media (max-width: 992px) {
  .site-header-home .nav-container { min-height: 74px; }
  .brand-logo { width: 138px; height: auto; }
  .nav-container { grid-template-columns: minmax(0, 1fr) auto; min-height: 74px; }
  .mobile-toggle { z-index: 32; display: flex; width: 38px; height: 38px; flex-direction: column; justify-content: space-between; padding: 11px 9px; border: 1px solid rgba(245, 242, 235, 0.35); background: transparent; color: #f5f2eb; cursor: pointer; }
  .mobile-toggle .bar { width: 100%; height: 1px; background: currentColor; transition: transform 0.2s, opacity 0.2s; }
  .mobile-toggle.is-active .bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .mobile-toggle.is-active .bar:nth-child(2) { opacity: 0; }
  .mobile-toggle.is-active .bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  .nav-links { position: absolute; top: calc(100% + 0px); right: 20px; left: 20px; display: flex; flex-direction: column; align-items: stretch; padding: 12px 20px 20px; border: 1px solid rgba(214, 179, 106, 0.2); background: rgba(20, 20, 20, 0.98); opacity: 0; visibility: hidden; transform: translateY(-8px); transition: opacity 0.2s, transform 0.2s, visibility 0.2s; }
  .nav-links.nav-open { opacity: 1; visibility: visible; transform: translateY(0); width: calc(100% - 0px); }
  .site-header-home:has(.nav-links.nav-open) { background: rgba(20, 20, 20, 0.98); }
  .nav-entry { flex-wrap: wrap; }
  .submenu-nav-link { display: none; }
  .mobile-submenu-trigger { display: inline-flex; }
  .nav-item { flex: 1; padding: 13px 4px; font-size: var(--type-nav-mobile); border-bottom: 1px solid rgba(245, 242, 235, 0.08); }
  .nav-item::after, .nav-entry + .nav-entry .nav-item::before { display: none; }
  .nav-submenu { position: static; flex-basis: 100%; min-width: 0; padding: 4px 0 8px 12px; border: 0; border-bottom: 1px solid rgba(245, 242, 235, 0.08); background: transparent; }
  .submenu-item { display: block; padding: 10px 8px; font-size: var(--type-nav-mobile); }
}

@media (max-width: 380px) {
  .brand-logo { width: 122px; }
  .nav-links { right: 12px; left: 12px; }
}

@media (prefers-reduced-motion: reduce) {
  .nav-links, .mobile-toggle .bar { transition: none; }
}
</style>
