<template>
  <div v-if="detail" class="pixiv-main" :style="selfStyle">
    <div class="pixiv-main__close">
      <Icon name="delete2" @click="backPage" />
    </div>
    <div class="pixiv-main__content" :style="contentStyle">
      <div class="painter">
        <div class="painter-avatar">
          <img :src="detail.orgurl" alt="" />
        </div>
        <div class="painter-info">
          <p>
            <b>{{ detail.title }}</b>
            <a> · {{ $moment(detail.date).fromNow() }}</a>
          </p>
          <ul>
            <li>#Vinneart</li>
            <li>#Artworks</li>
          </ul>
        </div>
      </div>
      <div class="plate">
        <img
          ref="plateImgEl"
          :src="detail.orgurl"
          alt=""
          @load="onPlateImgLoad"
        />
        <ul>
          <li v-for="(item, index) in detail.tags.split(',')" :key="index">
            <a>#{{ item }}</a>
          </li>
        </ul>
      </div>
      <div class="else">
        <div class="else-item">
          <Icon name="icon_love" />
          <span> {{ detail.likeTotal }}</span>
        </div>
        <div class="else-item">
          <Icon name="iccosplay" />
          <span>
            {{ detail.commentTotal }}
          </span>
        </div>
      </div>
    </div>
    <div ref="fakeEl" :style="fakeStyle" class="pixiv-main__fake">
      <img :src="enterRect?.path" alt="" @load="onFakeImgLoad" />
    </div>
  </div>
</template>

<script lang="ts">
import { PixivMainParams } from '@/hooks/router'
import { jsonParse } from 'adicw-utils'
import {
  computed,
  CSSProperties,
  defineComponent,
  onActivated,
  onDeactivated,
  reactive,
  ref,
  unref
} from 'vue'
import { useRoute, useRouter } from 'vue-router'

function animateModule() {
  const $route = useRoute()
  const plateImgEl = ref<HTMLImageElement>()
  const fakeEl = ref<HTMLElement>()

  const fake = reactive({
    active: true,
    visible: false
  })
  const plateImgPending = ref(true)

  const enterRect = computed<PixivMainParams['rect'] | null>(() =>
    jsonParse($route.params.rect as string, null)
  )
  const selfStyle = computed<CSSProperties>(() => {
    return {
      // 'overflow-y': fake.active ? 'hidden' : 'auto'
    }
  })
  const contentStyle = computed<CSSProperties>(() => {
    return {
      opacity: fake.active || plateImgPending.value ? 0 : 1
    }
  })
  const fakeStyle = computed<CSSProperties>(() => {
    const fakeRect = unref(enterRect)
    const active = fake.visible || plateImgPending.value
    // 设置初始位置，避免动画一开始会跳一下位置
    const initRect: CSSProperties = fakeRect
      ? {
          width: `${fakeRect.width}px`,
          height: `${fakeRect.height}px`,
          transform: `translate3d(${fakeRect.x}px,${fakeRect.y}px,0)`,
          borderRadius: fakeRect.radius
        }
      : {}
    return {
      opacity: active ? 1 : 0,
      zIndex: active ? 3 : -1,
      ...initRect
    }
  })

  const fakeAnimate = (callback: () => void, reverse = false) => {
    const fakeRect = unref(enterRect)
    const realRect = plateImgEl.value?.getBoundingClientRect()
    if (!fakeRect || !realRect || !fakeEl.value) return

    fake.active = true
    const keyframes: Keyframe[] = [
      {
        width: `${fakeRect.width}px`,
        height: `${fakeRect.height}px`,
        transform: `translate3d(${fakeRect.x}px,${fakeRect.y}px,0)`,
        borderRadius: fakeRect.radius
      },
      {
        width: `${realRect.width}px`,
        height: `${(realRect.width / fakeRect.width) * fakeRect.height}px`, // 图片第一时间可能没有加载完成，所以需要自己算
        transform: `translate3d(${realRect.x}px,${realRect.y}px,0)`,
        borderRadius: getComputedStyle(plateImgEl.value!).borderRadius
      }
    ]
    fakeEl.value.animate(!reverse ? keyframes : keyframes.reverse(), {
      duration: 625,
      fill: 'forwards',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }).onfinish = callback
    fake.visible = true
  }
  const onPlateImgLoad = () => {
    plateImgPending.value = false
  }
  const onFakeImgLoad = () => {
    //
  }

  onActivated(() => {
    fakeAnimate(() => {
      fake.visible = false
      fake.active = false
    })
  })
  onDeactivated(() => {
    fake.active = true
    fake.visible = true
    plateImgPending.value = true
  })

  return {
    plateImgEl,
    fakeEl,
    selfStyle,
    contentStyle,
    fakeStyle,
    enterRect,
    onPlateImgLoad,
    fakeAnimate,
    onFakeImgLoad
  }
}

export default defineComponent({
  name: 'PixivMain',
  props: {
    id: {
      type: [Number, String],
      default: -1
    }
  },
  setup() {
    const $route = useRoute()
    const $router = useRouter()
    const { fakeAnimate, ...animateModuleArgs } = animateModule()

    const detail = computed<PixivMainParams['detail'] | null>(() =>
      jsonParse($route.params.detail as string, null)
    )

    const backPage = () =>
      fakeAnimate(() => {
        $router.go(-1)
      }, true)

    onActivated(() => {
      if (!detail.value) {
        $router.replace({
          name: 'Pixiv'
        })
      }
    })

    return {
      detail,
      backPage,
      ...animateModuleArgs
    }
  }
})
</script>
<style lang="less" scoped>
.pixiv-main {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 444;
  border-top-left-radius: var(--df-radius);
  overflow-y: auto;
  &__close {
    position: fixed;
    top: 80px;
    right: 140px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    background: var(--font-color);
    color: var(--box-bg-color);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.25s;
    i {
      font-size: 40px;
    }
    &:hover {
      transform: rotate(360deg) scale(1.1);
    }
  }
  &__content {
    position: relative;
    left: 0;
    right: 0;
    margin: 10vh auto;
    width: 70%;
    background: var(--box-bg-color);
    border-radius: var(--df-radius);
    padding: 24px;
    box-sizing: border-box;
    // transition: opacity 0.625s;

    .painter {
      display: flex;
      width: 100%;
      margin-bottom: 24px;
      &-avatar {
        width: 60px;
        height: 60px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 18px;
        }
      }
      &-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding: 6px 6px 4px 8px;
        box-sizing: border-box;
        p {
          line-height: 16px;
          a {
            font-size: 12px;
            color: var(--font-unactive-color);
          }
        }
        ul {
          display: flex;
          font-size: 12px;
          line-height: 13px;
          gap: 8px;
          li {
            display: flex;
            align-items: center;
            padding: 0 12px;
            height: 26px;
            background: #000;
            border-radius: 8px;
          }
        }
      }
    }
    .plate {
      width: 100%;
      border-radius: var(--df-radius);
      overflow: hidden;
      padding-bottom: 16px;
      box-sizing: border-box;
      box-shadow: 0 0 2px var(--font-unactive-color);
      img {
        width: 100%;
        border-top-left-radius: var(--df-radius);
        border-top-right-radius: var(--df-radius);
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        padding: 16px;
        padding-bottom: 10px;
        font-size: 18px;
        gap: 4px 12px;
        li {
        }
      }
    }
    .else {
      width: 100%;
      display: flex;
      padding-top: 22px;
      gap: 22px;
      &-item {
        display: flex;
        align-items: center;
        i {
          font-size: 30px;
        }
        span {
          font-size: 16px;
          margin-left: 6px;
        }
      }
    }
  }
  &__fake {
    position: fixed;
    left: 0;
    top: 0;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
}
</style>
