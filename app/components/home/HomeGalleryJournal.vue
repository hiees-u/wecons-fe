<template>
  <JournalSection
    section-id="journal"
    section-class="section"
    heading-id="journal-title"
    :eyebrow="t('home.journal.eyebrow')"
    :title="t('home.journal.title')"
    :link-text="t('home.journal.view_all')"
    :link-text-mobile="t('common.view_all')"
    :articles="articles"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ArticleSummary } from '~/components/blog/BlogFeaturedCard.vue'
import JournalSection from '~/components/blog/JournalSection.vue'
import { normalizeImageUrl } from '~/utils/imageHelper'
import { useI18n } from '~/composables/useI18n'
import { useBlog } from '~/composables/useBlog'

const { t } = useI18n()
const { getPosts } = useBlog()

const FIGMA_SAMPLE_POSTS = [
  {
    title: '8 Nguyên Tắc Thiết Kế Kiến Trúc Nhà Ở Đúng Tiêu Chuẩn',
    category: 'LẬP KẾ HOẠCH',
    image: '/images/image-3.webp',
    alt: '8 Nguyên Tắc Thiết Kế Kiến Trúc Nhà Ở Đúng Tiêu Chuẩn',
    detail: 'Những nguyên tắc cốt lõi giúp tối ưu hóa không gian, ánh sáng và công năng sinh hoạt chuẩn kỹ thuật.',
    slug: '8-nguyen-tac-thiet-ke-kien-truc-nha-o-dung-tieu-chuan',
    date: '27/07/2026'
  },
  {
    title: 'Kỹ Thuật Tô Tường Chuẩn Trong Xây Dựng Giúp Tường Bền, Không Nứt',
    category: 'KỸ THUẬT XÂY DỰNG',
    image: '/images/imae-home-1.webp',
    alt: 'Kỹ Thuật Tô Tường Chuẩn Trong Xây Dựng Giúp Tường Bền, Không Nứt',
    detail: 'Quy trình thi công, tỷ lệ phối trộn và các bước bảo dưỡng bề mặt vữa xây tường không co ngót.',
    slug: 'ky-thuat-to-tuong-chuan-trong-xay-dung-giup-tuong-ben-khong-nut',
    date: '27/07/2026'
  },
  {
    title: 'Hiểu Dịch Vụ Thi Công Nội Thất Là Gì Qua Góc Nhìn Tổng Thầu Wecons',
    category: 'THI CÔNG NỘI THẤT',
    image: '/images/image-2.webp',
    alt: 'Hiểu Dịch Vụ Thi Công Nội Thất Là Gì Qua Góc Nhìn Tổng Thầu Wecons',
    detail: 'Giải pháp hoàn thiện chìa khóa trao tay, kiểm soát chất lượng vật liệu gỗ và nghiệm thu chuẩn mực.',
    slug: 'hieu-dich-vu-thi-cong-noi-that-la-gi-qua-goc-nhin-tong-thau-wecons',
    date: '27/07/2026'
  },
  {
    title: 'Phong Cách Hiện Đại Trong Thiết Kế Nội Thất Căn Hộ',
    category: 'XU HƯỚNG THIẾT KẾ',
    image: '/images/image-7.webp',
    alt: 'Phong Cách Hiện Đại Trong Thiết Kế Nội Thất Căn Hộ',
    detail: 'Đường nét tối giản, màu sắc trang nhã và tận dụng tối đa ánh sáng tự nhiên cho không gian sống.',
    slug: 'phong-cach-hien-dai-trong-thiet-ke-noi-that-can-ho',
    date: '27/07/2026'
  }
]

function formatDate(val?: string): string {
  if (!val) return '27/07/2026'
  try {
    const d = new Date(val)
    if (isNaN(d.getTime())) return '27/07/2026'
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
  } catch {
    return '27/07/2026'
  }
}

const { data: blogPosts } = await useAsyncData(
  'home-journal-posts',
  async () => {
    try {
      const res = await getPosts({ per_page: 4 })
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((item: any, idx: number) => {
          const fallback = FIGMA_SAMPLE_POSTS[idx % FIGMA_SAMPLE_POSTS.length]
          const imageValue = item.image || item.thumbnail || item.feature_image
          let imagePath = ''
          if (typeof imageValue === 'string') {
            imagePath = imageValue.trim()
          } else if (imageValue && typeof imageValue === 'object') {
            imagePath = (imageValue.url || imageValue.thumb || '').trim()
          }

          const rawTitle = (item.name || item.title || '').trim()
          const isDummyTitle = !rawTitle || /listio|listeo|why people choose|what people says/i.test(rawTitle)
          const isPlaceholderImg = !imagePath || /resido\.local|600x600|\/news\/\d+\.jpg/i.test(imagePath)

          const finalTitle = isDummyTitle ? fallback.title : rawTitle
          const finalImage = isPlaceholderImg ? fallback.image : normalizeImageUrl(imagePath)
          const finalSlug = isDummyTitle ? fallback.slug : (item.slugable?.key || item.slug || fallback.slug)
          const finalCategory = isDummyTitle ? fallback.category : (item.categories?.[0]?.name || fallback.category)
          const finalDetail = isDummyTitle ? fallback.detail : (item.description || item.excerpt || fallback.detail)

          return {
            title: finalTitle,
            category: finalCategory,
            image: finalImage || fallback.image,
            alt: finalTitle,
            detail: finalDetail,
            slug: finalSlug,
            date: formatDate(item.created_at)
          }
        })

        // Ensure 4 items to fill the 4-column grid evenly
        while (mapped.length < 4) {
          const fb = FIGMA_SAMPLE_POSTS[mapped.length % FIGMA_SAMPLE_POSTS.length]
          mapped.push({ ...fb })
        }

        return mapped
      }
    } catch {
      // fallback
    }
    return FIGMA_SAMPLE_POSTS
  },
  { default: () => FIGMA_SAMPLE_POSTS },
)

const articles = computed<ArticleSummary[]>(() => {
  const list = (blogPosts.value && blogPosts.value.length > 0) ? blogPosts.value : FIGMA_SAMPLE_POSTS
  const fourArticles = [...list.slice(0, 4)]
  while (fourArticles.length < 4) {
    fourArticles.push(FIGMA_SAMPLE_POSTS[fourArticles.length % FIGMA_SAMPLE_POSTS.length])
  }

  return fourArticles.map((article, index) => ({
    id: article.slug || `home-journal-${index}`,
    slug: article.slug || '',
    title: article.title,
    excerpt: article.detail,
    image: normalizeImageUrl(article.image),
    category: article.category,
    date: article.date || '27/07/2026',
  }))
})
</script>
