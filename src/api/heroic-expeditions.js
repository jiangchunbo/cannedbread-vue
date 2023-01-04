import request from '@/utils/request'

export function fetchEquipmentList() {
  return request({
    url: '/heroic-expeditions/equipment',
    method: 'get'
  })
}
