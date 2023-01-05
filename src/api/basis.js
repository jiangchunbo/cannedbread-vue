import request from '@/utils/request'

export function executePhp(data) {
  return request({
    url: '/util/php',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}

export function updateSystemProperties(data) {
  return request({
    url: '/basis/system-properties/update',
    method: 'post',
    data
  })
}

export function listSystemProperties() {
  return request({
    url: '/basis/system-properties/list',
    method: 'get'
  })
}
