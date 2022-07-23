<template>
  <div v-moveable class="live2d">
    <canvas ref="cvs" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { LIVE2D_CDNS } from './static'
import Moveable from '@/directs/moveable.direct'
import { wait } from 'adicw-utils'

/** 初始化参数 */
export interface InitOption {
  /** 模型model.json路径，此文件建议放到public文件夹下 */
  model: string
  /** 缩放比例 */
  scale?: number
  /** 生成模型空间大小 */
  size?: {
    width: number
    height: number
  }
  /** 版本 2版本model文件一般为xx.model.json 其他的视为4版本文件 */
  version?: 2 | 4
}

export default defineComponent({
  name: 'Live2d',
  directives: {
    Moveable
  },
  props: {
    draggable: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const cvs = ref<HTMLCanvasElement>()
    const live2d = reactive<{
      instance: any
      version: InitOption['version']
    }>({
      instance: null,
      version: 2
    })

    /** 依赖加载 */
    const loadCDN = async () => {
      return Promise.all(
        LIVE2D_CDNS.map(
          ({ link }) =>
            new Promise((resolve, reject) => {
              const el = document.createElement('script')
              el.src = link
              el.type = 'text/javascript'
              document.body.appendChild(el)
              el.onload = resolve
              el.onerror = reject
            })
        )
      )
    }
    /** live2d初始化 */
    const initLive2d = async ({
      model = '',
      scale = 0.13,
      size = {
        width: 220,
        height: 280
      },
      version = 2
    }: InitOption) => {
      try {
        await loadCDN()
        await wait(1000)
        const PIXI = (window as any).PIXI
        if (!model || !PIXI) return console.log('依赖错误')

        const app = new PIXI.Application({
          ...size,
          view: cvs.value,
          autoStart: true,
          transparent: true
        })
        const live2DModel = await PIXI.live2d.Live2DModel.from(model)
        app.stage.addChild(live2DModel)
        live2DModel.scale.set(scale)

        live2d.instance = live2DModel
        live2d.version = version
      } catch (e) {
        console.log('PIXI加载失败：', e)
      }
    }
    /**
     * 动作
     * @param name 动作名称，不传则随机
     */
    const motion = (name?: string) => {
      if (!live2d.instance) return
      switch (live2d.version) {
        case 2: {
          typeof name === 'undefined'
            ? live2d.instance.motion()
            : live2d.instance.motion(name)
          break
        }
        case 4: {
          typeof name === 'undefined'
            ? live2d.instance.expression()
            : live2d.instance.expression(name)
          break
        }
      }
    }

    return {
      initLive2d,
      motion,
      cvs
    }
  }
})
</script>
<style lang="less" scoped>
.live2d {
  position: fixed;
  z-index: 4444;
  left: 0;
  bottom: 0;
  user-select: none;
}
</style>
