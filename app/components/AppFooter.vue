<template>
  <footer class="site-footer">
    <div class="footer-main">
      <div class="footer-brand">
        <NuxtLink
          to="/"
          class="footer-brand-link"
          :aria-label="t('common.home_brand_aria', { name: t('footer.brand_name') })"
        >
          <img
            :src="logoDark || logo"
            :alt="t('footer.brand_name')"
            width="187"
            height="46"
            loading="lazy"
          />
        </NuxtLink>
        <ul class="contact-list">
          <li>
            <i class="fa-solid fa-house contact-icon" aria-hidden="true"></i>
            <span>{{ t("footer.address_label") }} {{ t("footer.address_val") }}</span>
          </li>
          <li>
            <i class="fa-solid fa-phone contact-icon" aria-hidden="true"></i>
            <span>
              {{ t("footer.hotline_label") }}
              <a :href="'tel:' + t('footer.phone_val').replace(/\s+/g, '')" :aria-label="t('footer.phone_val')">{{ t("footer.phone_val") }}</a>
            </span>
          </li>
          <li>
            <i class="fa-solid fa-envelope contact-icon" aria-hidden="true"></i>
            <span>
              {{ t("footer.email_label") }}
              <a :href="'mailto:' + t('footer.email_val')" :aria-label="t('footer.email_label')">{{ t("footer.email_val") }}</a>
            </span>
          </li>
          <li>
            <i class="fa-regular fa-clock contact-icon" aria-hidden="true"></i>
            <span>
              {{ t("footer.working_hours_label") }} {{ t("footer.working_hours_val") }}
            </span>
          </li>
        </ul>
      </div>

      <img
        class="footer-dmca-badge"
        src="/images/qr-zl/dmca.webp"
        :alt="t('footer.dmca_badge_alt')"
        width="150"
        height="30"
        loading="lazy"
      >

      <nav class="footer-column" :aria-label="t('footer.explore_title')">
        <h2>{{ t("footer.explore_title") }}</h2>
        <NuxtLink v-for="link in exploreLinks" :key="link.url" :to="link.url">
          {{ link.label }}
        </NuxtLink>
      </nav>

      <nav class="footer-column" :aria-label="t('footer.services_title')">
        <h2>{{ t("footer.services_title") }}</h2>
        <NuxtLink v-for="link in policyLinks" :key="link.url" :to="link.url">
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="footer-mobile-contact-row">
        <FooterQuickContactForm />
        <a
          class="footer-zalo-qr"
          :href="socialZalo"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="t('footer.zalo_label')"
        >
          <span>{{ t("footer.zalo_qr_title") }}</span>
          <img src="/images/qr-zl/zalo-qr.webp" :alt="t('footer.zalo_qr_alt')" width="88" height="88" loading="lazy">
        </a>
      </div>

      <div class="footer-map-social">
        <h2>{{ t("footer.map_title") }}</h2>
        <iframe
          class="footer-map"
          :src="mapIframe"
          :title="t('footer.map_title')"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
        <h2 class="social-heading">{{ t("footer.social_title") }}</h2>
        <div class="social-links">
          <a
            :href="socialFacebook"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="t('footer.facebook_label')"
          >
            <i class="fa-brands fa-facebook-f" aria-hidden="true"></i>
          </a>
          <a
            :href="socialZalo"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="t('footer.zalo_label')"
          >
            <i class="fa-solid fa-comment-dots" aria-hidden="true"></i>
          </a>
          <a
            v-if="socialTiktok"
            :href="socialTiktok"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="t('footer.tiktok_label')"
          >
            <i class="fa-brands fa-tiktok" aria-hidden="true"></i>
          </a>
          <a :href="'mailto:' + t('footer.email_val')" :aria-label="t('footer.email_label')">
            <i class="fa-regular fa-envelope" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <span>{{ t("footer.copyright") }}</span>
      <a :href="siteUrl">{{ siteHost }}</a>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "~/composables/useI18n";
import { useNavigation } from "~/composables/useNavigation";
import { useSiteSettings } from "~/composables/useSiteSettings";
import FooterQuickContactForm from "~/components/FooterQuickContactForm.vue";

const { t } = useI18n();
const { siteUrl } = useNavigation();
const siteHost = computed(() => {
  try {
    return new URL(siteUrl).hostname.replace(/^www\./, "");
  } catch {
    return t("footer.website_val");
  }
});

const exploreLinks = computed(() => [
  { label: t("footer.explore_about"), url: "/gioi-thieu" },
  { label: t("footer.explore_services"), url: "/dich-vu" },
  { label: t("footer.explore_projects"), url: "/du-an" },
  { label: t("footer.explore_products"), url: "/danh-muc-san-pham" },
  { label: t("footer.explore_news"), url: "/tin-tuc" },
  { label: t("footer.explore_contact"), url: "/lien-he" },
]);

const policyLinks = computed(() => [
  { label: t("footer.policy_pricing"), url: "/bao-gia" },
  { label: t("footer.policy_process"), url: "/process" },
  { label: t("footer.policy_consult"), url: "/lien-he#consultation-form" },
]);

const {
  mapIframe,
  socialZalo,
  socialFacebook,
  socialTiktok,
  logo,
  logoDark,
} = useSiteSettings();
</script>


<style scoped>
.site-footer {
  padding: 46px max(24px, calc((100vw - 1515px) / 2)) 18px;
  border-top: 1px solid rgba(214, 179, 106, 0.55);
  background: #111;
  color: #b9b6ae;
  position: relative;
}

.footer-main {
  display: grid;
  position: relative;
  grid-template-columns:
    minmax(0, 1.65fr)
    minmax(0, 0.75fr)
    minmax(0, 0.95fr)
    minmax(0, 1.2fr)
    minmax(0, 1.25fr);
  gap: clamp(18px, 2.2vw, 36px);
  max-width: 1515px;
  margin: 0 auto;
  padding-bottom: 54px;
}

.footer-brand {
  grid-column: 1;
}
.footer-column:nth-of-type(1) {
  grid-column: 2;
}
.footer-column:nth-of-type(2) {
  grid-column: 3;
}
.footer-mobile-contact-row {
  display: flex;
  grid-column: 4;
  flex-direction: column;
  gap: 30px;
}
.footer-mobile-contact-row :deep(.footer-quick-contact) {
  width: 100%;
}
.footer-mobile-contact-row :deep(.footer-quick-contact h2) {
  margin-bottom: 10px;
  font-size: 24px;
}
.footer-mobile-contact-row :deep(.footer-quick-contact form) {
  gap: 10px;
}
.footer-mobile-contact-row :deep(.footer-quick-contact input) {
  min-height: 34px;
  padding: 6px 12px;
  font-size: 13px;
}
.footer-mobile-contact-row :deep(.footer-quick-contact button) {
  min-height: 34px;
  justify-content: center;
  gap: 12px;
  font-family: var(--font-serif);
  font-size: 14px;
  font-weight: 400;
}
.footer-zalo-qr {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  color: var(--color-text);
  font-size: 14px;
  line-height: 1.4;
  text-decoration: none;
}
.footer-zalo-qr img {
  display: block;
  width: 84px;
  height: 84px;
  flex: 0 0 84px;
  padding: 4px;
  border: 1px solid rgba(245, 242, 235, 0.32);
  background: #fff;
  image-rendering: pixelated;
}
.footer-dmca-badge {
  position: absolute;
  bottom: 8px;
  left: 0;
  display: block;
  width: 175px;
  height: auto;
}
.footer-map-social {
  grid-column: 5;
}

.footer-brand-link {
  display: inline-flex;
}
.footer-brand-link img {
  display: block;
  width: min(350px, 100%);
  height: 100px;
  object-fit: contain;
  object-position: left;
}
.company-name {
  margin: 18px 0 14px;
  color: #e8d6ae;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.45px;
  line-height: 1.65;
}
.contact-list {
  display: grid;
  gap: 8px;
  list-style: none;
}
.contact-list li {
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr);
  gap: 15px;
  color: var(--color-text);
  font-size: 18px;
  line-height: 1.65;
}
.contact-icon {
  width: 14px;
  margin-top: 2px;
  color: var(--color-gold);
  font-size: 12px;
  text-align: center;
}
.contact-list a {
  color: inherit;
  text-decoration: none;
}
.contact-list a:hover {
  color: var(--color-gold);
}

.footer-column h2 {
  margin: 2px 0 4px;
  color: var(--color-gold);
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 0.25px;
}

.footer-column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.footer-map-social h2 {
  margin: 2px 0 4px;
  color: var(--color-gold);
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 0.25px;
}
.footer-column a {
  color: var(--color-text);
  font-size: 16px;
  line-height: 1.5;
  text-decoration: none;
}
.footer-column a:hover,
.footer-column a:focus-visible {
  color: var(--color-gold);
}

.footer-map-social {
  justify-self: end;
  width: 100%;
  gap: 10px;
  max-width: 324px;
  max-height: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.footer-mobile-contact-row {
  display: flex;
}
.footer-dmca-badge {
  display: block;
}
.footer-map {
  display: block;
  width: 100%;
  max-height: 150px;
  aspect-ratio: 1.55;
  border: 0;
  background: #252525;
}
.footer-map {
  display: flex;
  gap: 15px;
  flex-direction: column;
  justify-content: flex-start;
}
.social-heading {
  margin-top: 14px !important;
}
.social-links {
  display: flex;
  gap: 8px;
}
.social-links a {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid rgba(245, 242, 235, 0.45);
  border-radius: 50%;
  color: #eee;
  font-size: 24px;
  font-weight: 600;
  text-decoration: none;
  transition:
    border-color 180ms ease,
    color 180ms ease;
}
.social-links svg {
  font-size: 12px;
}
.social-links a:hover,
.social-links a:focus-visible {
  border-color: var(--color-gold);
  color: var(--color-gold);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  max-width: 1515px;
  margin: 0 auto;
  padding-top: 14px;
  border-top: 1px solid rgba(245, 242, 235, 0.12);
  color: #85827c;
  font-size: 9px;
}
.footer-bottom a {
  color: inherit;
  text-decoration: none;
}
.footer-bottom a:hover {
  color: var(--color-gold);
}

@media (max-width: 850px) {
  .footer-main {
    grid-template-columns: minmax(240px, 1.5fr) 1fr 1fr;
    padding-bottom: 34px;
  }
  .footer-brand,
  .footer-column:nth-of-type(1),
  .footer-column:nth-of-type(2) {
    grid-column: auto;
  }
  .footer-mobile-contact-row,
  .footer-dmca-badge {
    display: none;
  }
  .footer-column {
    gap: 15px;
  }
  .footer-column a {
    font-size: 18px;
  }
  .footer-map-social {
    grid-column: 2 / 4;
    justify-self: start;
    max-width: 300px;
    gap: 15px;
  }
  .social-heading {
    margin-top: 17px !important;
  }
  .social-links a {
    width: 44px;
    height: 44px;
  }
}

@media (max-width: 767px) {
  .site-footer {
    padding: 24px 16px 12px;
  }
  .footer-main {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px 14px;
    padding-bottom: 18px;
  }
  .footer-brand {
    grid-column: 1 / -1;
  }
  .footer-dmca-badge {
    position: static;
    display: block;
    grid-column: 1 / -1;
    width: 112px;
    height: auto;
    margin-top: -12px;
    object-fit: contain;
    object-position: left center;
  }
  .footer-mobile-contact-row {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
    gap: 8px;
  }
  .footer-zalo-qr {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    color: var(--color-text);
    font-size: 9px;
    line-height: 1.4;
    text-decoration: none;
  }
  .footer-zalo-qr img {
    display: block;
    width: 76px;
    height: 76px;
    flex: 0 0 76px;
    padding: 4px;
    border: 1px solid rgba(245, 242, 235, 0.32);
    background: #fff;
    image-rendering: pixelated;
  }
  .footer-map-social {
    grid-column: 1 / -1;
    justify-self: stretch;
    width: 100%;
    max-width: none;
    max-height: none;
    gap: 8px;
  }
  .footer-brand-link img {
    width: min(170px, 100%);
    height: auto;
  }
  .contact-list {
    gap: 6px;
    margin-top: 6px;
  }
  .contact-list li {
    grid-template-columns: 13px minmax(0, 1fr);
    align-items: start;
    gap: 7px;
    font-size: 10px;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
  .contact-icon {
    width: 13px;
    margin-top: 2px;
    font-size: 10px;
  }
  .footer-column {
    min-width: 0;
    gap: 7px;
  }
  .footer-column h2,
  .footer-map-social h2 {
    margin: 0 0 2px;
    font-size: 12px;
    line-height: 1.4;
  }
  .footer-column a {
    font-size: 11px;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }
  .footer-map {
    width: 100%;
    max-height: 128px;
    aspect-ratio: 2.2;
  }
  .social-heading {
    margin-top: 4px !important;
  }
  .social-links {
    flex-wrap: wrap;
    gap: 7px;
  }
  .social-links a {
    width: 36px;
    height: 36px;
    font-size: 17px;
  }
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding-top: 10px;
    font-size: 8px;
    line-height: 1.5;
  }
}
</style>
