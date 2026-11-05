<template>
  <main class="quote-page">
    <EditorialPageHero
      title-id="quote-page-title"
      compact
      :breadcrumb-home="t('nav.home')"
      :breadcrumb-label="t('quote_page.hero_breadcrumb')"
      :eyebrow="t('quote_page.hero_eyebrow')"
      :title="quotationConfig?.title || t('quote_page.hero_title')"
      :description="quotationConfig?.subtitle || t('quote_page.hero_description')"
      :image="cmsPage?.image || settings?.contact_banner || '/images/pg.webp'"
      :image-mobile="cmsPage?.image || settings?.default_page_banner_mobile || '/images/pg-mobile.webp'"
      :image-alt="t('quote_page.hero_image_alt')"
    />

    <div class="quote-content">
      <!-- SECTION 1: CÔNG CỤ DỰ TOÁN TÍNH TIỀN (CHUẨN THEO HÌNH ẢNH) -->
      <section class="quote-section quote-calc-section" aria-labelledby="calc-section-title">
        <div class="section-title">
          <span class="section-number" aria-hidden="true">01</span>
          <h2 id="calc-section-title">{{ quotationConfig?.title || 'Dự toán xây nhà trực tiếp' }}</h2>
        </div>

        <div class="quote-calc-panel">
          <div class="quote-calc-controls">
            <!-- Diện tích đất -->
            <div class="quote-calc-field">
              <label for="quote-land-area">Diện tích đất</label>
              <div class="quote-calc-input-wrap">
                <input
                  id="quote-land-area"
                  v-model.number="calcLandArea"
                  type="number"
                  min="1"
                  max="50000"
                  step="1"
                  inputmode="numeric"
                  placeholder="200"
                >
                <span aria-hidden="true">m²</span>
              </div>
            </div>

            <!-- Loại móng -->
            <div class="quote-calc-field">
              <label for="quote-foundation">Loại móng</label>
              <select id="quote-foundation" v-model="calcFoundation">
                <option v-for="opt in foundationList" :key="opt.id || opt.name" :value="opt.percent">
                  {{ opt.name }} ({{ opt.percent }}%)
                </option>
              </select>
            </div>

            <!-- Số tầng -->
            <div class="quote-calc-field">
              <label for="quote-floor-count">Số tầng</label>
              <select id="quote-floor-count" v-model.number="calcFloors">
                <option v-for="opt in floorList" :key="opt.id || opt.value" :value="opt.value">
                  {{ opt.name || opt.value }}
                </option>
              </select>
            </div>

            <!-- Số hầm -->
            <div class="quote-calc-field">
              <label for="quote-basement-count">Số hầm</label>
              <select id="quote-basement-count" v-model.number="calcBasementCount">
                <option v-for="opt in basementList" :key="opt.id || opt.count" :value="opt.count">
                  {{ opt.name }}
                </option>
              </select>
            </div>

            <!-- Diện tích tầng hầm -->
            <div class="quote-calc-field">
              <label for="quote-basement-area">Diện tích tầng hầm</label>
              <div class="quote-calc-input-wrap">
                <input
                  id="quote-basement-area"
                  v-model.number="calcBasementArea"
                  type="number"
                  min="0"
                  max="10000"
                  step="1"
                  inputmode="numeric"
                  placeholder="20"
                >
                <span aria-hidden="true">m²</span>
              </div>
            </div>

            <!-- Chiều cao tầng trệt -->
            <div class="quote-calc-field">
              <label for="quote-ground-height">Chiều cao tầng trệt</label>
              <select id="quote-ground-height" v-model.number="calcHeightExtraPercent">
                <option v-for="opt in heightList" :key="opt.id || opt.name" :value="opt.extra_percent">
                  {{ opt.name }}
                </option>
              </select>
            </div>

            <!-- Loại mái -->
            <div class="quote-calc-field">
              <label for="quote-roof">Loại mái</label>
              <select id="quote-roof" v-model="calcRoof">
                <option v-for="opt in roofList" :key="opt.id || opt.name" :value="opt.percent">
                  {{ opt.name }} ({{ opt.percent }}%)
                </option>
              </select>
            </div>

            <!-- Sân trước / sau -->
            <div class="quote-calc-field">
              <label for="quote-yard">Sân trước / sau</label>
              <select id="quote-yard" v-model="calcYard">
                <option v-for="opt in yardList" :key="opt.id || opt.name" :value="opt.percent">
                  {{ opt.name }}
                </option>
              </select>
            </div>

            <!-- Gói vật tư -->
            <div class="quote-calc-field quote-calc-field--full">
              <label>Gói vật tư</label>
              <div class="quote-package-options">
                <button
                  v-for="pkg in packageList"
                  :key="pkg.id || pkg.name"
                  type="button"
                  class="quote-package-btn"
                  :class="{ 'is-active': calcSelectedPrice === pkg.price }"
                  @click="calcSelectedPrice = pkg.price"
                >
                  {{ pkg.name }}
                </button>
              </div>
            </div>
          </div>

          <!-- Bảng kết quả ước tính (Bên phải) -->
          <aside class="quote-calc-summary" aria-live="polite">
            <div class="summary-top">
              <div class="summary-label">Tổng Giá Trị Ước Tính</div>
              <div class="summary-price-wrap">
                <span class="summary-price">{{ formatNumber(totalEstimatedCost) }}</span>
                <span class="summary-currency">đồng</span>
              </div>
            </div>

            <hr class="summary-divider">

            <dl class="summary-list">
              <div class="summary-row">
                <dt>Diện tích đất</dt>
                <dd>{{ formatArea(calcLandArea) }}</dd>
              </div>
              <div class="summary-row">
                <dt>Diện tích sàn xây dựng</dt>
                <dd>{{ formatArea(buildingFloorArea) }} ({{ calcFloors }} tầng)</dd>
              </div>
              <div class="summary-row">
                <dt>Tổng m² quy đổi</dt>
                <dd>{{ formatArea(totalConvertedArea) }}</dd>
              </div>
              <div class="summary-row">
                <dt>Đơn giá áp dụng</dt>
                <dd>{{ formatNumber(calcSelectedPrice) }} đ/m²</dd>
              </div>
            </dl>

            <button type="button" class="quote-calc-cta" @click="scrollToConsultForm">
              {{ quotationConfig?.cta_text || 'Nhận dự toán chi tiết miễn phí' }} <span aria-hidden="true">↗</span>
            </button>
          </aside>
        </div>

        <p v-if="quotationConfig?.note" class="quote-section-note mt-3">
          * {{ quotationConfig.note }}
        </p>
      </section>

      <!-- SECTION 2: BẢNG BÁO GIÁ CHI TIẾT TỪNG HẠNG MỤC (ĐỘNG TỪ ADMIN) -->
      <section v-if="quoteItemsList.length > 0" class="quote-section" aria-labelledby="detail-items-title">
        <div class="section-title">
          <span class="section-number" aria-hidden="true">02</span>
          <h2 id="detail-items-title">Bảng báo giá chi tiết theo từng hạng mục</h2>
        </div>

        <div class="table-scroll" tabindex="0" aria-label="Bảng chi tiết hạng mục báo giá">
          <table class="estimate-table">
            <thead>
              <tr>
                <th scope="col" style="width: 45%;">Hạng mục & Nội dung</th>
                <th scope="col" style="width: 15%;">Nhóm</th>
                <th scope="col" style="width: 20%;">Đơn giá</th>
                <th scope="col" style="width: 20%;" class="text-end">Thành tiền tham khảo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in quoteItemsList" :key="item.id || item.name">
                <td>
                  <strong>{{ item.name }}</strong>
                  <div v-if="item.description" class="item-description text-muted small mt-1">
                    {{ item.description }}
                  </div>
                </td>
                <td>
                  <span class="badge" :class="item.group === 'design' ? 'badge-design' : 'badge-construction'">
                    {{ item.group === 'design' ? 'Thiết kế' : 'Thi công' }}
                  </span>
                </td>
                <td>
                  {{ formatNumber(item.unit_price) }} đ/{{ item.unit || 'm²' }}
                </td>
                <td class="money-cell text-end">
                  {{ formatNumber(item.unit_price * (item.group === 'design' ? calcLandArea : buildingFloorArea)) }} đ
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- SECTION 3: FORM ĐĂNG KÝ NHẬN DỰ TOÁN -->
      <section id="investor-form-section" class="quote-section investor-section" aria-labelledby="investor-section-title">
        <div class="section-title">
          <span class="section-number" aria-hidden="true">03</span>
          <h2 id="investor-section-title">{{ t('quote_page.investor_section') }}</h2>
        </div>

        <form class="investor-form" novalidate @submit.prevent="submitInvestorForm">
          <div class="investor-fields">
            <div class="quote-field">
              <label for="investor-name">{{ t('quote_page.investor_name') }} *</label>
              <input
                id="investor-name"
                v-model="investor.name"
                type="text"
                autocomplete="name"
                placeholder="Nhập họ và tên của quý khách"
                required
              >
            </div>
            <div class="quote-field">
              <label for="investor-phone">{{ t('quote_page.investor_phone') }} *</label>
              <input
                id="investor-phone"
                v-model="investor.phone"
                type="tel"
                inputmode="tel"
                autocomplete="tel"
                placeholder="Nhập số điện thoại liên hệ"
                required
              >
            </div>
            <div class="quote-field">
              <label for="investor-email">{{ t('quote_page.investor_email') }}</label>
              <input
                id="investor-email"
                v-model="investor.email"
                type="email"
                autocomplete="email"
                placeholder="Nhập email nhận bản vẽ / dự toán"
              >
            </div>
            <div class="quote-field quote-field--full">
              <label for="investor-notes">Ghi chú yêu cầu dự toán</label>
              <textarea
                id="investor-notes"
                v-model="investor.note"
                rows="3"
                class="form-control"
                placeholder="Yêu cầu cụ thể, địa chỉ công trình hoặc thời gian khởi công dự kiến..."
              />
            </div>
          </div>

          <button class="button-gold investor-submit" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? t('quote_page.submit_loading') : 'Gửi yêu cầu nhận dự toán miễn phí' }}
          </button>
          <p v-if="formStatus" class="form-status" :class="{ 'is-error': formIsError }" role="status">
            {{ formStatus }}
          </p>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import EditorialPageHero from '~/components/EditorialPageHero.vue'
import { useI18n } from '~/composables/useI18n'
import { useRealEstate } from '~/composables/useRealEstate'
import { submitConsultRequest } from '~/services/consultService'

const { t } = useI18n()
const { settings } = useSiteSettings()
const { getQuotationSettings } = useRealEstate()

// SSR fetch quotation settings from Backend
const { data: quotationRes } = await useAsyncData('page-quotation-settings', () => getQuotationSettings(), {
  default: () => null,
})
const quotationConfig = computed(() => quotationRes.value?.data || null)

// Options fallback & reactive lists
const defaultPackages = [
  { id: 'standard', name: 'Tiêu chuẩn', price: 7500000 },
  { id: 'premium', name: 'Cao cấp', price: 9400000 },
  { id: 'luxury', name: 'Sang trọng', price: 11000000 },
]

const defaultFoundations = [
  { id: 'mong_don', name: 'Móng đơn', percent: 30 },
  { id: 'mong_bang', name: 'Móng băng', percent: 50 },
  { id: 'mong_coc', name: 'Móng cọc', percent: 40 },
  { id: 'mong_be', name: 'Móng bè', percent: 70 },
]

const defaultFloors = [
  { id: 'flr_1', name: '1', value: 1 },
  { id: 'flr_2', name: '2', value: 2 },
  { id: 'flr_3', name: '3', value: 3 },
  { id: 'flr_4', name: '4', value: 4 },
  { id: 'flr_5', name: '5', value: 5 },
]

const defaultBasements = [
  { id: 'bsm_0', name: '0 hầm', count: 0, percent: 0 },
  { id: 'bsm_1', name: '1 hầm', count: 1, percent: 150 },
  { id: 'bsm_2', name: '2 hầm', count: 2, percent: 200 },
]

const defaultHeights = [
  { id: 'h_33', name: '3.3 m', height: 3.3, extra_percent: 0 },
  { id: 'h_36', name: '3.6 m', height: 3.6, extra_percent: 1.5 },
  { id: 'h_40', name: '4.0 m', height: 4.0, extra_percent: 3.5 },
  { id: 'h_45', name: '4.5 m', height: 4.5, extra_percent: 6.0 },
]

const defaultRoofs = [
  { id: 'rf_1', name: 'Mái tôn', percent: 15 },
  { id: 'rf_2', name: 'Mái BTCT', percent: 50 },
  { id: 'rf_3', name: 'Mái ngói vì kèo sắt', percent: 70 },
  { id: 'rf_4', name: 'Mái ngói dán BTCT', percent: 100 },
]

const defaultYards = [
  { id: 'yd_0', name: 'Không có sân', percent: 0 },
  { id: 'yd_1', name: 'Sân trước', percent: 50 },
  { id: 'yd_2', name: 'Sân trước và sau', percent: 70 },
]

const packageList = computed(() => quotationConfig.value?.packages?.length ? quotationConfig.value.packages : defaultPackages)
const foundationList = computed(() => quotationConfig.value?.foundations?.length ? quotationConfig.value.foundations : defaultFoundations)
const floorList = computed(() => quotationConfig.value?.floors?.length ? quotationConfig.value.floors : defaultFloors)
const basementList = computed(() => quotationConfig.value?.basements?.length ? quotationConfig.value.basements : defaultBasements)
const heightList = computed(() => quotationConfig.value?.ground_floor_heights?.length ? quotationConfig.value.ground_floor_heights : defaultHeights)
const roofList = computed(() => quotationConfig.value?.roofs?.length ? quotationConfig.value.roofs : defaultRoofs)
const yardList = computed(() => quotationConfig.value?.yards?.length ? quotationConfig.value.yards : defaultYards)
const quoteItemsList = computed(() => quotationConfig.value?.quotation_items || [])

// Calculation inputs (Khởi tạo chuẩn khớp đúng hình ảnh: 200m², Móng băng 50%, 3 tầng, 0 hầm, 20m² hầm, 3.6m trệt, Mái BTCT 50%, Không sân, Gói Sang trọng 11.000.000 đ)
const calcLandArea = ref(200)
const calcFoundation = ref(50)
const calcFloors = ref(3)
const calcBasementCount = ref(0)
const calcBasementArea = ref(20)
const calcHeightExtraPercent = ref(1.5)
const calcRoof = ref(50)
const calcYard = ref(0)
const calcSelectedPrice = ref(11000000)

// Calculation logic
const buildingFloorArea = computed(() => {
  return Math.round(calcLandArea.value * calcFloors.value * 10) / 10
})

const totalConvertedArea = computed(() => {
  const base = Math.max(0, Number(calcLandArea.value) || 0)
  const floors = Math.max(1, Number(calcFloors.value) || 1)
  const buildingSqm = base * floors
  const foundationSqm = base * ((Number(calcFoundation.value) || 0) / 100)
  const roofSqm = base * ((Number(calcRoof.value) || 0) / 100)
  const yardSqm = base * ((Number(calcYard.value) || 0) / 100)
  const basementSqm = (Number(calcBasementCount.value) || 0) > 0
    ? (Number(calcBasementArea.value) || 0) * (Number(calcBasementCount.value) || 0)
    : 0
  const heightSqm = base * ((Number(calcHeightExtraPercent.value) || 0) / 100)

  return Math.round((buildingSqm + foundationSqm + roofSqm + yardSqm + basementSqm + heightSqm) * 10) / 10
})

const totalEstimatedCost = computed(() => {
  return Math.round(totalConvertedArea.value * (Number(calcSelectedPrice.value) || 0))
})

function formatNumber(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.round(n || 0))
}

function formatArea(n: number): string {
  return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(n || 0)} m²`
}

// Scroll to consult form
function scrollToConsultForm() {
  const formEl = document.getElementById('investor-form-section')
  if (formEl) {
    const selectedPkg = packageList.value.find((p: any) => p.price === calcSelectedPrice.value)?.name || 'Sang trọng'
    investor.value.note = `Yêu cầu dự toán trực tiếp: Diện tích đất ${calcLandArea.value} m², ${calcFloors.value} tầng, gói ${selectedPkg}. Tổng diện tích quy đổi: ${totalConvertedArea.value} m². Tổng giá trị ước tính: ${formatNumber(totalEstimatedCost.value)} đồng.`
    formEl.scrollIntoView({ behavior: 'smooth' })
    const nameInput = document.getElementById('investor-name')
    if (nameInput) nameInput.focus()
  }
}

// Investor Form
const investor = ref({
  name: '',
  phone: '',
  email: '',
  note: '',
})
const isSubmitting = ref(false)
const formStatus = ref('')
const formIsError = ref(false)

async function submitInvestorForm() {
  if (!investor.value.name.trim() || !investor.value.phone.trim()) {
    formStatus.value = 'Vui lòng điền họ tên và số điện thoại liên hệ.'
    formIsError.value = true
    return
  }

  isSubmitting.value = true
  formStatus.value = ''
  formIsError.value = false

  try {
    const selectedPkg = packageList.value.find((p: any) => p.price === calcSelectedPrice.value)?.name || ''
    const content = `[DỰ TOÁN BÁO GIÁ WECONS]\n` +
      `- Diện tích đất: ${calcLandArea.value} m²\n` +
      `- Số tầng: ${calcFloors.value} tầng\n` +
      `- Hầm: ${calcBasementCount.value} hầm (${calcBasementArea.value} m²)\n` +
      `- Móng: ${calcFoundation.value}%, Mái: ${calcRoof.value}%, Sân: ${calcYard.value}%\n` +
      `- Gói vật tư: ${selectedPkg} (${formatNumber(calcSelectedPrice.value)} đ/m²)\n` +
      `- Tổng m² quy đổi: ${totalConvertedArea.value} m²\n` +
      `- Tổng giá trị dự toán ước tính: ${formatNumber(totalEstimatedCost.value)} đồng\n` +
      `- Ghi chú khách hàng: ${investor.value.note || 'Không có'}`

    const res = await submitConsultRequest({
      name: investor.value.name,
      phone: investor.value.phone,
      email: investor.value.email,
      content,
    })

    if (res.success) {
      formStatus.value = 'Cảm ơn quý khách! WE Construction đã tiếp nhận thông tin và chuyên viên dự toán sẽ liên hệ tư vấn trong 15 phút.'
      investor.value.name = ''
      investor.value.phone = ''
      investor.value.email = ''
      investor.value.note = ''
    } else {
      formStatus.value = res.message || 'Gửi yêu cầu không thành công, vui lòng thử lại hoặc gọi Hotline.'
      formIsError.value = true
    }
  } catch (err: any) {
    formStatus.value = 'Đã có lỗi xảy ra. Quý khách vui lòng gọi Hotline trực tiếp để được hỗ trợ nhanh nhất.'
    formIsError.value = true
  } finally {
    isSubmitting.value = false
  }
}

// SEO Head
const pageTitle = computed(() => quotationConfig.value?.title || t('quote_page.meta_title') || 'Báo Giá & Dự Toán Xây Nhà')
const pageDescription = computed(() => quotationConfig.value?.subtitle || t('quote_page.meta_description') || 'Công cụ tính chi phí xây dựng nhà trọn gói WE Construction.')

useHead(() => ({
  title: pageTitle.value,
  meta: [
    { name: 'description', content: pageDescription.value },
    { property: 'og:url', content: 'https://wecons.vn/bao-gia' },
  ],
  link: [{ rel: 'canonical', href: 'https://wecons.vn/bao-gia' }],
}))

const cmsPage = await useCmsPageMeta('pricing', {
  title: pageTitle,
  description: pageDescription,
})
</script>

<style scoped>
.quote-page {
  --page-gutter: clamp(22px, 5.4vw, 78px);
  overflow: clip;
  background: #191a1d;
  color: #f5f2eb;
  font-size: 16px;
}

.quote-content {
  width: min(1320px, calc(100% - var(--page-gutter) * 2));
  margin: 0 auto;
  padding: clamp(40px, 6vw, 72px) 0;
}

.quote-section {
  margin-top: 36px;
  padding: clamp(28px, 4vw, 48px);
  border: 1px solid #2b2e35;
  background: #141518;
  border-radius: 8px;
}

.section-title {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 28px;
}

.section-number {
  flex: 0 0 auto;
  color: #d6b36a;
  font-family: var(--font-serif, serif);
  font-size: 26px;
  font-style: italic;
  font-weight: 700;
}

.section-title h2 {
  color: #ffffff;
  font-size: clamp(22px, 2.2vw, 28px);
  font-weight: 600;
  margin: 0;
}

/* ========================================================
   ESTIMATE CALCULATOR (LAYOUT & STYLING CHUẨN THEO ẢNH)
   ======================================================== */
.quote-calc-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.95fr);
  gap: clamp(24px, 3.5vw, 48px);
  background: #101114;
  border: 1px solid #262930;
  border-radius: 8px;
  padding: clamp(24px, 3vw, 40px);
}

.quote-calc-controls {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 16px;
}

.quote-calc-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quote-calc-field--full {
  grid-column: 1 / -1;
}

.quote-calc-field label {
  color: #cfd2d8;
  font-size: 14px;
  font-weight: 500;
}

.quote-calc-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.quote-calc-input-wrap input,
.quote-calc-field select {
  width: 100%;
  height: 48px;
  background: #18191d;
  color: #ffffff;
  border: 1px solid #32363f;
  border-radius: 4px;
  padding: 0 14px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.quote-calc-input-wrap input {
  padding-right: 44px;
}

.quote-calc-input-wrap > span {
  position: absolute;
  right: 14px;
  color: #8c909a;
  font-size: 14px;
  pointer-events: none;
}

.quote-calc-field select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%238c909a%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 10px;
  padding-right: 36px;
  cursor: pointer;
}

.quote-calc-input-wrap input:focus,
.quote-calc-field select:focus {
  border-color: #d6b36a;
  box-shadow: 0 0 0 2px rgba(214, 179, 106, 0.25);
}

.quote-package-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.quote-package-btn {
  flex: 1 1 auto;
  min-height: 44px;
  background: #18191d;
  color: #adb1b8;
  border: 1px solid #32363f;
  border-radius: 4px;
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quote-package-btn:hover {
  color: #ffffff;
  border-color: #555b66;
}

.quote-package-btn.is-active {
  background: #18191d;
  color: #d6b36a;
  border-color: #d6b36a;
  box-shadow: 0 0 0 1px #d6b36a;
}

/* Cột phải: Bảng kết quả */
.quote-calc-summary {
  background: #1b1c20;
  border: 1px solid #2a2e36;
  border-radius: 6px;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.summary-label {
  color: #adb1b8;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.summary-price-wrap {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.summary-price {
  color: #d6b36a;
  font-size: clamp(28px, 2.8vw, 36px);
  font-weight: 700;
  letter-spacing: -0.5px;
}

.summary-currency {
  color: #d6b36a;
  font-size: 18px;
  font-weight: 500;
}

.summary-divider {
  border: 0;
  height: 1px;
  background: #2a2e36;
  margin: 24px 0;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0 0 28px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.summary-row dt {
  color: #8c909a;
  font-weight: 400;
}

.summary-row dd {
  color: #ffffff;
  font-weight: 600;
  margin: 0;
}

.quote-calc-cta {
  width: 100%;
  min-height: 50px;
  background: #d6b36a;
  color: #101114;
  font-weight: 700;
  font-size: 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s, transform 0.1s;
}

.quote-calc-cta:hover {
  background: #e2c179;
}

.quote-calc-cta:active {
  transform: translateY(1px);
}

.quote-section-note {
  color: #8c909a;
  font-size: 13px;
  line-height: 1.6;
}

/* ========================================================
   SECTION 2: TABLE DETAIL ITEMS
   ======================================================== */
.table-scroll {
  overflow-x: auto;
  border: 1px solid #262930;
  border-radius: 4px;
}

.estimate-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.estimate-table th,
.estimate-table td {
  padding: 14px 18px;
  border-bottom: 1px solid #262930;
  text-align: left;
}

.estimate-table th {
  background: #101114;
  color: #cfd2d8;
  font-weight: 600;
}

.estimate-table td {
  background: #141518;
  color: #f5f2eb;
}

.badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.badge-design {
  background: rgba(80, 140, 255, 0.15);
  color: #70a1ff;
  border: 1px solid rgba(80, 140, 255, 0.3);
}

.badge-construction {
  background: rgba(214, 179, 106, 0.15);
  color: #d6b36a;
  border: 1px solid rgba(214, 179, 106, 0.3);
}

/* ========================================================
   SECTION 3: INVESTOR FORM
   ======================================================== */
.investor-fields {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.quote-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quote-field--full {
  grid-column: 1 / -1;
}

.quote-field label {
  color: #cfd2d8;
  font-size: 14px;
  font-weight: 500;
}

.quote-field input,
.quote-field textarea {
  width: 100%;
  background: #101114;
  border: 1px solid #32363f;
  border-radius: 4px;
  color: #ffffff;
  padding: 12px 14px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}

.quote-field input:focus,
.quote-field textarea:focus {
  border-color: #d6b36a;
}

.button-gold {
  margin-top: 24px;
  min-height: 50px;
  background: #d6b36a;
  color: #101114;
  font-weight: 700;
  font-size: 15px;
  border: none;
  border-radius: 4px;
  padding: 0 32px;
  cursor: pointer;
  transition: background 0.2s;
}

.button-gold:hover:not(:disabled) {
  background: #e2c179;
}

.button-gold:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-status {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 4px;
  background: rgba(46, 213, 115, 0.15);
  color: #2ed573;
  border: 1px solid rgba(46, 213, 115, 0.3);
  font-size: 14px;
}

.form-status.is-error {
  background: rgba(255, 71, 87, 0.15);
  color: #ff4757;
  border-color: rgba(255, 71, 87, 0.3);
}

/* Responsive */
@media (max-width: 991px) {
  .quote-calc-panel {
    grid-template-columns: minmax(0, 1fr);
  }

  .investor-fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .quote-calc-controls {
    grid-template-columns: minmax(0, 1fr);
  }

  .investor-fields {
    grid-template-columns: minmax(0, 1fr);
  }

  .button-gold {
    width: 100%;
  }
}
</style>
