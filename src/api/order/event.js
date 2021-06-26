import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  delivery: '/order.event/delivery',
  updatePrice: '/order.event/updatePrice',
  confirmCancel: '/order.event/confirmCancel'
}

/**
 * 确认发货
 * @param {*} data
 */
export function delivery (data) {
  return axios({
    url: api.delivery,
    method: 'post',
    data
  })
}

/**
 * 修改订单价格
 * @param {*} data
 */
export function updatePrice (data) {
  return axios({
    url: api.updatePrice,
    method: 'post',
    data
  })
}

/**
 * 审核：用户取消订单
 * @param {*} data
 */
export function confirmCancel (data) {
  return axios({
    url: api.confirmCancel,
    method: 'post',
    data
  })
}
