import router from '../router/index'

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
