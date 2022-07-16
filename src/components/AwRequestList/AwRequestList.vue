<template>
  <div class="request-list">
    <div ref="contentDom" class="request-list__content">
      <slot name="contain" :data="reList.data" />
    </div>
    <p v-if="!reList.hasMore" class="request-list__over">{{ overText }}</p>
    <p v-show="reList.isPending" class="request-list__load">
      {{ loadingText }}
    </p>
  </div>
</template>

<script lang="ts">
import { ReList, BreakData, Scroll, RequsetFn } from './type'
import {
  onMounted,
  onBeforeUnmount,
  reactive,
  toRefs,
  watch,
  ref,
  nextTick,
  defineComponent,
  PropType
} from 'vue'
export * from './type'
function detailModule(props: any) {
  const { isBind } = toRefs(props)

  const contentDom = ref<HTMLElement>()
  const reList: ReList = reactive({
    isPending: false,
    tpage: 1,
    total: 0,
    hasMore: true,
    data: []
  })
  const scroll: Scroll = reactive({
    oldY: 0
  })
  const loadMore = () => {
    if (reList.isPending) return
    reList.isPending = true
    props
      .requset(reList.tpage, props.size, props.params)
      .then(({ list, total }: BreakData) => {
        if (list.length < props.size) {
          reList.hasMore = false
        }
        reList.tpage++
        reList.data.push(...list)
        reList.total = total
        reList.isPending = false
      })
  }
  const mainScroll = ({ target }: any) => {
    if (!reList.hasMore) return
    const { scrollTop, offsetHeight, scrollHeight } = target
    if (scrollHeight - scrollTop - offsetHeight <= props.offsetY) {
      loadMore()
    }
  }
  const getTarget = (): HTMLElement => {
    if (!props.target) {
      return contentDom.value!
    } else {
      return document.querySelector(props.target)!
    }
  }
  const addEvent = () => {
    nextTick(() => {
      //   dom.scrollTop = 0;
      getTarget().addEventListener('scroll', mainScroll)
    })
  }
  const removeEvent = () => {
    const target = getTarget()
    scroll.oldY = target.scrollTop
    target.removeEventListener('scroll', mainScroll)
  }
  const onIsBindChanged = (bind: boolean) => {
    bind ? addEvent() : removeEvent()
  }
  watch(isBind, onIsBindChanged, {
    immediate: true
  })
  onMounted(loadMore)
  onBeforeUnmount(removeEvent)
  return {
    reList,
    onIsBindChanged,
    contentDom
  }
}
export default defineComponent({
  name: 'AwRequestList',
  props: {
    requset: {
      type: Function as PropType<RequsetFn>,
      default: () =>
        Promise.resolve({
          total: 0,
          list: []
        })
    },
    size: {
      type: Number,
      default: 10
    },
    target: {
      type: String,
      default: ''
    },
    offsetY: {
      type: Number,
      default: 140
    },
    isBind: {
      type: Boolean,
      default: true
    },
    params: {
      type: Object,
      default: () => ({})
    },
    loadingText: {
      type: String,
      default: '-- 加载中 --'
    },
    overText: {
      type: String,
      default: '-- 没有更多了嗷 --'
    }
  },
  setup(props) {
    const { reList, ...detailModuleArgs } = detailModule(props)
    return {
      reList,
      ...detailModuleArgs
      // ...styleModule(reList)
    }
  }
})
</script>
<style lang="less" scoped>
.request-list {
  &__content {
    width: 100%;
    height: max-content;
  }
  &__load,
  &__over {
    text-align: center;
    margin: 16px 0;
    font-size: 12px;
    color: #999;
  }
}
</style>
