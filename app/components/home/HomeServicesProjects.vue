<template>
  <HomeServiceCards
    :eyebrow="t('home.services.eyebrow')"
    :title="t('home.services.title')"
    :explore-label="t('home.services.explore')"
    :link-to-category="true"
    default-service-path="/danh-muc-san-pham"
    :services="services"
  />
  <HomeCompletedProjects :projects="projects" />
  <FeaturedProjectsSlider :projects="projects" />
  <HomeBenefitsPricingProcess />
</template>

<script setup lang="ts">
import { computed } from "vue";
import homeData from "~/data/homeContent.json";
import type { HomeImageItem } from "~/types/content";
import { useI18n } from "~/composables/useI18n";
import { useRealEstate } from "~/composables/useRealEstate";
import { useServiceHighlights } from "~/composables/useServiceHighlights";
import { normalizeImageUrl } from "~/utils/imageHelper";
import HomeServiceCards from "~/components/home/HomeServiceCards.vue";
import HomeCompletedProjects from "~/components/home/HomeCompletedProjects.vue";
import HomeBenefitsPricingProcess from '~/components/home/HomeBenefitsPricingProcess.vue'
import FeaturedProjectsSlider from "~/components/project/FeaturedProjectsSlider.vue";

const { t } = useI18n();
const { getProjects } = useRealEstate();
const sharedServices = useServiceHighlights();

interface HomeProjectItem extends HomeImageItem {
  idProject: string;
}

const defaultProjects = homeData.projects as HomeProjectItem[];
const services = computed<HomeImageItem[]>(() => sharedServices.value.slice(0, 4).map(service => ({
  title: service.title,
  category: service.category,
  image: service.image,
  alt: service.alt,
  detail: service.description,
  slug: service.slug,
})));

const { data: remoteProjects } = await useAsyncData<HomeProjectItem[] | null>('home-featured-projects', async () => {
  try {
    const res = await getProjects({ per_page: 8, is_featured: 1 });
    if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data.map((item: any, idx: number) => {
        const fallback = defaultProjects[idx % defaultProjects.length] || { image: '/images/pg.webp' };
        const rawImg = (typeof item.image === 'string' ? item.image : (item.image?.url || item.images?.[0] || '')).trim();
        const isPlaceholder = !rawImg || /600x600|resido\.local/i.test(rawImg);
        const finalImage = isPlaceholder ? fallback.image : normalizeImageUrl(rawImg);

        return {
          idProject: String(item.id || idx),
          title: item.name || fallback.title || '',
          category: item.category?.name || item.category || fallback.category || 'Bi?t th? cao c?p',
          image: finalImage,
          alt: item.name || fallback.title || '',
          detail: item.description || item.location || fallback.detail || '',
          slug: item.slug || fallback.idProject || '',
        };
      });
    }
  } catch (e) {
    // Graceful fallback to defaultProjects
  }
  return null;
});

const projects = computed<HomeProjectItem[]>(() => {
  if (remoteProjects.value && remoteProjects.value.length > 0) {
    return remoteProjects.value;
  }
  return defaultProjects;
});
</script>