import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  image: '/upload/image'
}

/**
 * 上传图片
 * @param {*} data
 */
export function image (data) {
  return axios({
    url: api.image,
    method: 'post',
    data
  })
}
