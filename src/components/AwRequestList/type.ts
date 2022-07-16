export interface ReList {
  tpage: number
  isPending: boolean
  total: number
  hasMore: boolean
  data: Array<any>
}
export interface BreakData {
  list: Array<any>
  total: number
}
export interface Scroll {
  oldY: number
}
export type RequsetFn = (
  tpage: number,
  size: number,
  params?: any
) => Promise<{ list: any[]; total: number }>
