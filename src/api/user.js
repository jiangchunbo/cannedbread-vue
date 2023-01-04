import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function getDetail(token) {
  return request({
    url: `/basic/user-detail`,
    method: 'get',
    params: { token }
  })
}

export function editPersonalInfo(data) {
  return request({
    url: `/basic/user/edit`,
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
