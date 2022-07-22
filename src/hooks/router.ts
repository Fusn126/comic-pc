import router from '../router/index'
import { ComicSearchItem } from '@/api'

/**
 * 前往动漫详情
 * @param id
 * @param type
 * @param op { latest-0|1 是否最新集 }
 * @returns
 */
export function toComicMain(
  id: number | string,
  type: 'push' | 'replace' = 'push',
  op = {
    latest: 0
  }
) {
  return router[type]({
    name: 'ComicMain',
    params: {
      id
    },
    query: {
      latest: op.latest
    } as any
  })
}

export interface PixivMainParams {
  /** 图片信息 */
  detail: ComicSearchItem
  /** 进入图片rect */
  rect: {
    width: number
    height: number
    x: number
    y: number
    radius: string
    path: string
  }
}

/**
 * 前往Pixiv图片详情
 * @param id
 * @param params
 * @param type
 * @returns
 */
export function toPixivMain(
  id: number | string,
  params: PixivMainParams,
  type: 'push' | 'replace' = 'push'
) {
  return router[type]({
    name: 'PixivMain',
    params: {
      rect: JSON.stringify(params.rect),
      detail: JSON.stringify(params.detail),
      id
    }
  })
}
