import request from '@/utils/request'

export function executePhp(data) {
  return request({
    url: '/code-executor/php',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}

export function getPhpExecutorConfig() {
  return request({
    url: '/code-executor/php/config',
    method: 'get'
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

export function fetchUpdateLogList() {
  return request({
    url: '/basis/update-log/list',
    method: 'get'
  })
}

export function fetchBaiduNetdiskFileList(params) {
  return request({
    url: '/baidu-netdisk/list',
    method: 'get',
    params
  })
}

