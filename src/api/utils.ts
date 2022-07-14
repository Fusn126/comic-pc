import { ElNotification } from 'element-plus'

/**
 * 视频地址格式化（用于处理部分错误的地址）
 * @param url
 * @returns
 */
export function videoUrlFormat(url: string) {
  return url.replaceAll("'", '').split('?url=').pop() || ''
}

export const newError = () => new Error('bad request')

export const badRequestNotify = (apiPath: string) => {
  return ElNotification({
    type: 'error',
    title: '资源获取',
    message: `${apiPath} 资源获取出问题啦！`,
    duration: 0
  })
}
