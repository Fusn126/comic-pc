<template>
  <div id="pixiv">
    <div class="pixiv-content">
      <SearchHeader
        v-model="pixivFilter.name"
        class="pixiv-header"
        @searchEnter="resetWaterfall()"
        @searchClick="onSearch"
      />
      <AwVirtualWaterfall
        v-if="state.waterfallKey"
        target=".pixiv-content"
        :column="5"
        :request-size="50"
        :requset="fetchPixiv"
        :gap="26"
      >
        <template #item="{ item }">
          <PixivContentItem
            :style="{
              opacity: state.pixivMainId === item.id ? 0 : 1
            }"
            :detail="item"
            @click="(e) => imgPreview(e, item)"
          />
        </template>
      </AwVirtualWaterfall>
      <AdBreakTop target=".pixiv-content" />
    </div>

    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { getComicImglist, ComicSearchItem } from '@/api'
import { AwVirtualWaterfall, Type } from '@/components/AwVirtualWaterfall'
import SearchHeader from '@/components/Form/SearchHeader.vue'
import { toPixivMain } from '@/hooks/router'
import { ElMessage } from 'element-plus'
import { nextTick, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import PixivContentItem from './component/PixivContentItem.vue'

const $route = useRoute()

const pixivFilter = reactive({
  name: ''
})
const state = reactive({
  waterfallKey: Math.random(),
  pixivMainId: '',
  childRouteActive: false
})

const fetchPixiv: Type.RequsetFn = async (tpage, size) => {
  const { list, total } = await getComicImglist({
    limit: size,
    offset: --tpage * size,
    name: pixivFilter.name
  })
  if (list.length === 0 && tpage === 0) {
    ElMessage({
      message: '什么都没有找到~',
      type: 'warning'
    })
  }
  return {
    list,
    total
  }
}
const resetWaterfall = async () => {
  state.waterfallKey = 0
  await nextTick()
  state.waterfallKey = Math.random()
}
const onSearch = () => {
  if (pixivFilter.name !== '') {
    pixivFilter.name = ''
  }
  resetWaterfall()
}
const imgPreview = (e: Event, item: ComicSearchItem) => {
  const el = e.target as HTMLElement
  const rect = el.getBoundingClientRect()

  toPixivMain(item.id, {
    detail: item,
    rect: {
      width: rect.width | 0,
      height: rect.height | 0,
      x: rect.x | 0,
      y: rect.y | 0,
      path: item.preurl,
      radius: getComputedStyle(el).borderRadius
    }
  })
}

watch(
  () => $route.params,
  (params) => {
    const id = String(params.id)
    if (!params.id) {
      setTimeout(() => {
        state.pixivMainId = ''
      }, 625)
    }
    if (state.pixivMainId === '') {
      state.pixivMainId = id
    }
  }
)
</script>
<style lang="less" scoped>
#pixiv {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;

  .pixiv {
    &-header {
      position: sticky;
      top: 0;
      padding-top: 10px;
      margin-bottom: 20px;
    }

    &-content {
      width: 100%;
      height: 100%;
      padding-right: 20px;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}
</style>
