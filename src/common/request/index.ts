import axios, { AxiosPromise } from 'axios'
import { BASE_URL, timeout } from './config'
// import AxiosUtils from './axiosUtils.class'

// 创建公共实例
const instance = axios.create({
  baseURL: BASE_URL,
  timeout
})
// new AxiosUtils(instance)

/**
 * 请求 - get
 * @param url 请求地址
 * @returns
 */
export function getax(url: string): AxiosPromise<any> {
  // onDownloadProgress ???
  return instance(url)
}

/**
 * 请求 - post
 * @param url 请求地址
 * @param params 请求参数
 * @param config 请求配置
 * @returns
 */
export function postax(
  url: string,
  params = {},
  config = {}
): AxiosPromise<any> {
  return instance.post(url, params, config)
}

/**
 * 基于axios的请求 - get
 * @param url 完整请求地址
 * @returns
 */
export function dfGetax(url: string): AxiosPromise<any> {
  const instance = axios.create({
    timeout
  })
  return instance(url)
}

/**
 * 创建一个请求驳回源
 * @returns
 */
export function createCancelToken() {
  const CancelToken = axios.CancelToken
  return CancelToken.source()
}
