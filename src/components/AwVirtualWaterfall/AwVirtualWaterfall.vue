<template>
  <div ref="selfEl" class="aw-virtual-waterfall">
    <div class="vw-content" :style="contentStyle">
      <div
        v-for="{ item, style } in renderedData"
        :key="item.id"
        class="vw-item"
        :style="style"
      >
        <slot name="item" :item="item" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { throttle } from '@/utils/adLoadsh'
import {
  computed,
  CSSProperties,
  nextTick,
  onMounted,
  reactive,
  ref
} from 'vue'
import * as Type from './type'

const props = withDefaults(
  defineProps<{
    /** 滚动节点 */
    target: string | HTMLElement
    /** 新数据请求 */
    requset: Type.RequsetFn
    /** 滚底阈值差 */
    offsetY?: number
    /** 列的总数 */
    column?: number
    /** 每列最小数量 */
    columnItemCount?: number
    /** 列和列元素的间隙 */
    gap?: number
  }>(),
  {
    target: '',
    requset: () =>
      Promise.resolve({
        total: 0,
        list: []
      }),
    offsetY: 300,
    column: 3,
    columnItemCount: 6,
    gap: 16
  }
)
const selfEl = ref<HTMLElement>()

const reList = reactive({
  isPending: false,
  tpage: 1,
  total: 0,
  hasMore: true,
  data: [] as Type.DataItem[],
  get map() {
    return this.data.reduce((totol, item) => {
      totol.set(item.id, item)
      return totol
    }, new Map<string | number, Type.DataItem>())
  }
})
const awItem = computed(() =>
  reList.data.reduce((totol, item) => {
    const width = (scroll.width / props.column) | 0
    totol.set(item.id, {
      width,
      height: ((width / item.w) * item.h) | 0
    })
    return totol
  }, new Map<Type.DataItem['id'], Type.AwItemRect>())
)
const columns = reactive({
  queue: Array(props.column)
    .fill(0)
    .map<Type.ColumnsQueue>(() => ({
      list: [],
      get height() {
        // todo 莫名其妙的类型问题
        return this.list.reduce((totol, { item }: { item: Type.DataItem }) => {
          const hei = awItem.value.get(item.id)?.height || 0
          return totol + hei
        }, 0)
      }
    })),
  usedDataLen: 0,
  get heights() {
    return columns.queue.map((item) => item.height)
  },
  get maxHeight() {
    return Math.max(...this.heights)
  },
  get minHeight() {
    return Math.min(...this.heights)
  }
})
const scroll = reactive({
  width: 0,
  height: 0,
  start: 0,
  offsetTop: 0,
  get end() {
    return this.start + this.height
  }
})

const requestSize = computed(() => props.column * props.columnItemCount)
const hasMoreData = computed(() => columns.usedDataLen < reList.data.length)
const queueData = computed(() =>
  columns.queue
    .map((q, i) => {
      let beforeOffsetY = 0
      let beforeHei = 0
      return q.list.map((item, index) => {
        const hei = awItem.value.get(item.item?.id)?.height || 0
        if (index === 1) {
          beforeHei = hei
          beforeOffsetY =
            awItem.value.get(item.before?.item?.id || -1)?.height || 0
        } else if (index !== 0) {
          beforeOffsetY += beforeHei
          beforeHei = hei
        }
        return {
          ...item,
          y: beforeOffsetY,
          h: hei,
          style: {
            width: `${100 / props.column}%`,
            transform: `translate3d(${i * 100}%,${beforeOffsetY}px,0)`
          } as CSSProperties
        }
      })
    })
    .flat(2)
)
// const queueDataMap = computed(() =>
//   queueData.value.reduce(
//     (totol, item) => {
//       totol.set(
//         {
//           h: item.h,
//           y: item.y
//         },
//         item
//       )
//       return totol
//     },
//     new Map<
//       {
//         h: number
//         y: number
//       },
//       typeof queueData.value[0]
//     >()
//   )
// )
const renderedData = computed(() =>
  queueData.value.filter(
    (item) => item.y + item.h > scroll.start && item.y < scroll.end
  )
)
const contentStyle = computed<CSSProperties>(() => {
  return {
    height: `${columns.maxHeight}px`
  }
})

const { onIsBindChanged, loadMore, getTarget } = (() => {
  const mainScroll = throttle(async (e: Event) => {
    let { scrollTop, clientHeight } = e.target as HTMLElement
    scrollTop -= scroll.offsetTop
    scroll.start = scrollTop
    if (clientHeight + scrollTop + props.offsetY > columns.minHeight) {
      if (!hasMoreData.value) {
        // console.log('request')
        await loadMore()
      }
      // console.log('add')
      addToQueue(5)
    }
  }, 100)
  const loadMore = async () => {
    if (reList.isPending) return
    reList.isPending = true
    const { list, total } = await props.requset(reList.tpage, requestSize.value)
    if (list.length < requestSize.value) {
      reList.hasMore = false
    }
    reList.tpage++
    reList.data.push(...list.map((item) => Object.freeze(item)))
    reList.total = total
    reList.isPending = false
  }
  const getTarget = (): HTMLElement | null => {
    const { target } = props
    if (!target) {
      return selfEl.value!
    } else {
      return typeof target === 'string'
        ? document.querySelector(target)
        : target
    }
  }
  const addEvent = async () => {
    await nextTick()
    getTarget()?.addEventListener('scroll', mainScroll)
  }
  const removeEvent = () => {
    const target = getTarget()
    if (!target) return
    target.removeEventListener('scroll', mainScroll)
  }
  const onIsBindChanged = (bind: boolean) => {
    bind ? addEvent() : removeEvent()
  }
  return {
    onIsBindChanged,
    loadMore,
    getTarget
  }
})()

const initRect = () => {
  const rect = getTarget()?.getBoundingClientRect()
  if (!rect) return
  scroll.width = selfEl.value!.clientWidth
  scroll.height = rect.height
  scroll.offsetTop = selfEl.value!.offsetTop
}
const pushToQueue = (index: number, item: Type.DataItem) => {
  const q = columns.queue[index]
  const listLen = q.list.length
  columns.usedDataLen++
  q.list.push({
    item,
    before: q.list[listLen - 1] || null
  })
}
const addToQueue = (size = 1) => {
  for (const _ of Array(size)) {
    if (!hasMoreData.value) {
      break
    }
    const minHeiQueueIndex = columns.queue.findIndex(
      (item) => item.height === columns.minHeight
    )
    pushToQueue(minHeiQueueIndex, reList.data[columns.usedDataLen])
  }
}

onMounted(async () => {
  initRect()
  onIsBindChanged(true)
  await loadMore()
  addToQueue(requestSize.value)
})

defineExpose({
  // Type
})
</script>
<style lang="less" scoped>
.aw-virtual-waterfall {
  position: relative;
  width: 100%;

  .vw {
    &-content {
      position: relative;
      width: 100%;
    }
    &-item {
      position: absolute;
      left: 0;
      top: 0;
    }
  }
}
</style>
