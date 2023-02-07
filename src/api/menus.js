import request from '@/utils/request'

export function listMyMenusConfig(data) {
  return request({
    url: '/menus/config/mine',
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


export function setMenusVisible(data) {
    return request({
        url: '/menus/visible/set',
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        data
    })
}