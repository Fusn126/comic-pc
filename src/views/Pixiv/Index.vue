<template>
  <div id="pixiv">
    <div class="pixiv-content">
      <SearchHeader
        v-model="pixivFilter.name"
        class="pixiv-header"
        @searchEnter="resetWaterfall()"
        @searchClick="onSearch"
      />
      <Waterfall
        v-if="state.waterfallKey"
        target=".pixiv-content"
        :column="5"
        :column-size="6"
        :requset="fetchPixiv"
        :gap="26"
      >
        <template #content="{ column }">
          <WaterfallColumn v-for="col in column" :key="col">
            <template #content="{ data }">
              <!-- <AwVirtualList target=".pixiv-content" :list="data">
              <template #content="{ list }">
                <AwVirtualListItem
                  v-for="item in list"
                  :id="item.id"
                  :key="item.id"
                  class="pixiv-img"
                >
                  <img :src="item.preurl" alt="" />
                </AwVirtualListItem>
              </template>
            </AwVirtualList> -->
              <div
                v-for="item in data"
                :key="item.id"
                class="pixiv-img"
                :style="{ opacity: state.pixivMainId === item.id ? 0 : 1 }"
              >
                <BaseImg
                  :lazy="false"
                  :src="item.preurl"
                  @click="(e) => imgPreview(e, item)"
                />
              </div>
            </template>
          </WaterfallColumn>
        </template>
      </Waterfall>
      <AdBreakTop target=".pixiv-content" />
    </div>

    <router-view v-slot="{ Component }">
      <!-- <transition name="route-transition"> -->
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
      <!-- </transition> -->
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, reactive } from 'vue'
import { Waterfall, WaterfallColumn, Type } from '@/components/AwWaterfall'
import SearchHeader from '@/components/Form/SearchHeader.vue'
// import { AwVirtualList, AwVirtualListItem } from '@/components/AwVirtualList'
import { getComicImglist, GetComicImglistReturn } from '@/api'
import { toPixivMain } from '@/hooks/router'
import { useRoute } from 'vue-router'

const $route = useRoute()
const pixivFilter = reactive({
  name: ''
})
const state = reactive({
  waterfallKey: Math.random(),
  pixivMainId: computed(() => $route.params.id)
})
const fetchPixiv: Type.RequsetFn = async (tpage, size) => {
  const data = await getComicImglist({
    limit: size,
    offset: --tpage * size,
    name: pixivFilter.name
  })
  return {
    list: data,
    total: 1000
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
const imgPreview = (e: Event, item: GetComicImglistReturn[0]) => {
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
</script>
<style lang="less" scoped>
#pixiv {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 26px 0 0 26px;
  box-sizing: border-box;
  overflow: hidden;
  .pixiv {
    &-header {
      position: sticky;
      top: 0;
      margin-bottom: 40px;
      padding: 0 12px;
      box-sizing: border-box;
    }
    &-content {
      width: 100%;
      height: 100%;
      padding-right: 20px;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: auto;
    }
    &-img {
      width: 100%;
      img {
        width: 100%;
        display: block;
        border-radius: 14px;
        transition: all 0.25s;
        cursor: pointer;
      }
      &:hover {
        img {
          box-shadow: 0 0 14px rgba(0, 0, 0, 0.1);
          transform: scale(0.98);
        }
      }
    }
  }
}
</style>
