<template>
  <div id="pixiv">
    <SearchHeader
      v-model="pixivFilter.name"
      class="pixiv-header"
      @searchEnter="resetWaterfall()"
      @searchClick="onSearch"
    />
    <Waterfall
      v-if="state.waterfallKey"
      target="#pixiv"
      :column="5"
      :column-size="6"
      :requset="fetchPixiv"
      :gap="26"
    >
      <template #content="{ column }">
        <WaterfallColumn v-for="col in column" :key="col">
          <template #content="{ data }">
            <!-- <AwVirtualList target="#pixiv" :list="data">
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
            <div v-for="item in data" :key="item.id" class="pixiv-img">
              <BaseImg :src="item.preurl" />
            </div>
          </template>
        </WaterfallColumn>
      </template>
    </Waterfall>

    <AdBreakTop target="#pixiv" />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, reactive } from 'vue'
import { Waterfall, WaterfallColumn, Type } from '@/components/AwWaterfall'
import SearchHeader from '@/components/Form/SearchHeader.vue'
// import { AwVirtualList, AwVirtualListItem } from '@/components/AwVirtualList'
import { getComicImglist } from '@/api'

const pixivFilter = reactive({
  name: ''
})
const state = reactive({
  waterfallKey: Math.random()
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
</script>
<style lang="less" scoped>
#pixiv {
  position: relative;
  width: 100%;
  height: 100%;
  // border-top-left-radius: 30px;
  overflow-y: auto;
  padding: 26px;
  box-sizing: border-box;
  // background: var(--box-bg-color);
  .pixiv {
    &-header {
      position: sticky;
      top: 0;
      margin-bottom: 40px;
      padding: 0 12px;
      box-sizing: border-box;
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
