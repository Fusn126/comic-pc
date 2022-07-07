import { useElementRect } from '@/hooks/useElementRect'
import { jsonParse } from 'adicw-utils'
import {
  computed,
  CSSProperties,
  DefineComponent,
  defineComponent,
  h,
  reactive,
  ref,
  Teleport
} from 'vue'

interface AwDragProps {
  draggable: boolean
  groupKey: string | number
  selfKey: string | number
}
type DargTransferData = Omit<AwDragProps, 'draggable'>
export interface ExchangeParam {
  from: AwDragProps['selfKey']
  to: AwDragProps['selfKey']
}

// todo 优化
export const AwDrag = defineComponent({
  name: 'AwDrag',
  props: {
    /**
     * 是否可拖动，否则相当于此组件无效
     */
    draggable: {
      type: Boolean,
      require: true
    },
    /**
     * 可互相拖动组的公共key
     */
    groupKey: {
      type: [String, Number],
      default: Math.random()
    },
    /**
     * 组件自身的key，用于拖拽完成后区分变化
     */
    selfKey: {
      type: [String, Number],
      default: Math.random()
    }
  },
  emits: {
    /** 交换事件 */
    exChange: (e: ExchangeParam) => e
  },
  setup(props, ctx) {
    const selfEl = ref<HTMLElement>()
    const fakeImg = new Image()
    fakeImg.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cpath /%3E%3C/svg%3E"

    const state = reactive({
      draging: false,
      dragEntering: false,
      isSameDrag: false
    })
    const selfElRect = useElementRect(selfEl)
    const move = reactive({
      x: 0,
      y: 0,
      offsetX: 0,
      offsetY: 0
    })

    const selfStyle = computed<CSSProperties>(() => {
      return {
        transition: state.dragEntering ? 'opacity 0.25s' : '',
        opacity: (() => {
          if (state.isSameDrag && state.draging) {
            return 0
          }
          if (state.dragEntering) {
            return 0.2
          }
          return 1
        })()
      }
    })
    const innerOrgStyle = computed<CSSProperties>(() => {
      return {
        width: `${selfElRect.width}px`,
        height: `${selfElRect.height}px`,
        transform: `translate(${move.x - move.offsetX}px,${
          move.y - move.offsetY
        }px)`
      }
    })

    const getDargTransferData = (e: DragEvent) => {
      return jsonParse<DargTransferData | null>(
        e.dataTransfer?.getData('aw-drag') as any,
        null
      )
    }
    const ondragstart = (e: DragEvent) => {
      move.offsetX = e.offsetX
      move.offsetY = e.offsetY
      state.draging = true

      e.dataTransfer?.setDragImage(fakeImg, 0, 0) // 设置拖动时为透明

      e.dataTransfer?.setData(
        'aw-drag',
        JSON.stringify({
          groupKey: props.groupKey,
          selfKey: props.selfKey
        } as DargTransferData)
      )
    }
    // 此事件默认有节流，略卡
    const ondrag = (e: DragEvent) => {
      move.x = e.pageX
      move.y = e.pageY
    }
    const ondragend = () => {
      state.draging = false
    }
    const ondrop = (e: DragEvent) => {
      e.preventDefault() // 阻止默认动作（如打开一些元素的链接）
      state.dragEntering = false
      const data = getDargTransferData(e)
      if (
        data &&
        data.groupKey === props.groupKey &&
        props.selfKey !== data.selfKey
      ) {
        ctx.emit('exChange', {
          from: props.selfKey,
          to: data.selfKey
        })
      }
    }
    const ondragover = (e: DragEvent) => {
      e.preventDefault() // 阻止默认动作以启用 drop事件

      if (state.dragEntering) return
      state.dragEntering = true
    }
    const ondragleave = () => {
      state.dragEntering = false
    }
    const ondragenter = (e: DragEvent) => {
      console.log('eneter')
      state.isSameDrag = !!selfEl.value?.contains(e.target as HTMLElement)
    }

    return () => {
      const slot = ctx.slots.default!
      return h(
        'div',
        {
          ref: selfEl,
          draggable: props.draggable,
          ondragstart,
          ondragend,
          ondrag,
          ondragover,
          ondrop,
          ondragleave,
          ondragenter,
          style: {
            ...selfStyle.value
          }
        },
        [
          h(
            Teleport,
            {
              to: 'body',
              disabled: !state.draging
            },
            state.draging
              ? h(
                  'div',
                  {
                    ...ctx.attrs,
                    style: {
                      ...innerOrgStyle.value,
                      position: 'fixed',
                      zIndex: 3333,
                      top: 0,
                      left: 0,
                      pointerEvents: 'none'
                    }
                  },
                  slot()
                )
              : slot()
          ),
          state.draging && slot()
        ]
      )
    }
  }
}) as DefineComponent<AwDragProps>
