import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  detail: '/client.wxapp/detail',
  setting: '/client.wxapp/setting'
}

// 微信小程序详情
export function detail (params) {
  return axios({
    url: api.detail,
    method: 'get',
    params
  })
}

/**
 * 更新记录
 * @param {*} data
 */
export function setting (data) {
  return axios({
    url: api.setting,
    method: 'post',
    data
  })
}
