 <template>
  <HouseModelsPage :image="cmsPage?.image || settings?.default_page_banner || '/images/pg.webp'" :image-mobile="cmsPage?.imageMobile || settings?.default_page_banner_mobile || '/images/pg-mobile.webp'" />
</template>

<script setup lang="ts">
import HouseModelsPage from '~/components/catalog/HouseModelsPage.vue'
import { useNavigation } from '~/composables/useNavigation'
import { useI18n } from '~/composables/useI18n'
import { useSiteSettings } from '~/composables/useSiteSettings'

const { t } = useI18n()
const { siteUrl } = useNavigation()
const { settings } = useSiteSettings()
const title = t('house_models_page.meta_title')
const description = t('house_models_page.meta_desc')

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl.replace(/\/$/, '')}/danh-muc-san-pham` }],
})

const cmsPage = await useCmsPageMeta('productCategories', { title, description })
</script>
