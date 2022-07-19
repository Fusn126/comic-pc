import { dfGetax } from '@/common/request/index'
import * as FnReturns from './type'
import * as ApiReturns from './api.type'
import { getVal } from 'adicw-utils'

/**
 * 获取动漫的相关图片列表-来源pixiv
 * @param param
 */
export async function getComicImglist({
  name = '',
  limit = 20,
  offset = 0,
  sort = 'hot'
}: {
  /** 动漫名称 */
  name?: string
  /** 分页大小 */
  limit?: number
  /** 偏移数量 */
  offset?: number
  sort?: 'hot' | 'new'
  type?: number
}): Promise<FnReturns.GetComicImglistReturn> {
  try {
    const realName = name
      .split(' ')[0]
      .split('/')[0]
      .split('(')[0]
      .replace(
        /(第一季|第二季|第四季|第五季|第六季|第七季|BD|无修|剧场版|？)/,
        ''
      )
    const { data } = await dfGetax<ApiReturns.VilipixIllust>(
      `https://www.vilipix.com/api/v1/picture/public?limit=${limit}&tags=${realName}&sort=${sort}&offset=${offset}`
    )
    return getVal(() => data.data.rows, []).map((item) => ({
      date: item.created_at,
      title: item.title,
      orgurl: item.original_url,
      preurl: item.regular_url,
      id: item.picture_id,
      desc: '',
      w: item.width,
      h: item.height,
      commentTotal: item.comment_total,
      likeTotal: item.like_total,
      tags: item.tags
    }))
  } catch (e) {
    return []
  }
}

/**
 * 获取动漫图片详情，和getComicImglist关联
 * todo
 * @param param
 */
export async function getComicImgmain({ id }: { id: string; userId: string }) {
  try {
    const { data } = await dfGetax<ApiReturns.VilipixTranslate>(
      `https://www.vilipix.com/api/translate/${id}`
    )
    const info = getVal(() => data.data.source_json, '')
    console.log(info)
  } catch {
    return ''
  }
}
