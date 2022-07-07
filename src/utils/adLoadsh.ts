type DefaultFn = (...args: any[]) => void

/**
 * 防抖
 * @param callback 执行方法
 * @param delay 间隔时间
 */
export function debounce(callback: DefaultFn, delay = 300) {
  let timer: NodeJS.Timeout | null = null
  return function (this: any, ...args: any[]) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      callback.apply(this, args)
    }, delay)
  }
}

/**
 * 节流
 * @param callback 执行方法
 * @param delay 间隔时间
 */
export function throttle(callback: DefaultFn, delay = 300) {
  let flag = false
  return function (this: any, ...args: any[]) {
    if (flag) return
    flag = true
    setTimeout(() => {
      callback.apply(this, args)
      flag = false
    }, delay)
  }
}

/**
 * 数组位置交换
 * @param arr
 * @param aIndex
 * @param bIndex
 */
export function swap<T>(arr: T[], aIndex: number, bIndex: number) {
  const [a, b] = [arr[aIndex], arr[bIndex]]
  arr.splice(aIndex, 1, b)
  arr.splice(bIndex, 1, a)
}
