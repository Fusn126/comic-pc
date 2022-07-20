export type RequsetFn = (
  tpage: number,
  size: number
) => Promise<{ list: any[]; total: number }>

export interface AwItemRect {
  width: number
  height: number
}

export interface DataItem {
  w: number
  h: number
  id: number | string
  [props: string]: any
}

export interface ColumnsQueue {
  list: {
    item: DataItem
    before: ColumnsQueue['list'][0] | null
  }[]
  readonly height: number
}
