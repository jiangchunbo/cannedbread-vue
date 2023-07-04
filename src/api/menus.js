import request from '@/utils/request'

export function listMyMenusConfig(data) {
  return request({
    url: '/menu',
    method: 'get'
  })
}

export function saveMyMenusConfig(data) {
  return request({
    url: '/menus/config/save',
    method: 'post',
    data
  })
}

export function setMenusVisible({ data, params }) {
  return request({
    url: '/menu/visible/set',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data,
    params
  })
}
