import { App } from 'vue'
import {
  ElNotification,
  ElCarousel,
  ElCarouselItem,
  ElButton,
  ElPagination,
  ElSlider,
  ElTabs,
  ElTabPane,
  ElColorPicker,
  ElRate,
  ElTooltip,
  ElForm,
  ElFormItem,
  ElInput,
  ElPopconfirm,
  ElTimeline,
  ElTimelineItem,
  ElSelect,
  ElOption,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu
} from 'element-plus'
const comps = [
  ElCarousel,
  ElCarouselItem,
  ElButton,
  ElPagination,
  ElSlider,
  ElTabs,
  ElTabPane,
  ElColorPicker,
  ElRate,
  ElTooltip,
  ElForm,
  ElFormItem,
  ElInput,
  ElPopconfirm,
  ElTimeline,
  ElTimelineItem,
  ElSelect,
  ElOption,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu
]
const plugins = [ElNotification]
export function elementPlusInit(app: App<Element>) {
  comps.forEach((comp) => {
    app.component(comp.name, comp)
  })
  plugins.forEach((plugin) => {
    app.use(plugin)
  })
}
