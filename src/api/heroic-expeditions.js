import request from '@/utils/request'

export function fetchEquipmentList(params) {
  return request({
    url: '/heroic-expeditions/equipment',
    method: 'get',
    params
  })
}
