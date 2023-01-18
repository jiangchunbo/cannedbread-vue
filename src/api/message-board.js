import request from '@/utils/request'

export function fetchBeforeMessage(params) {
  return request({
    url: '/message-board/message/list',
    method: 'get',
    params: {
      ...params,
      direction: 'before'
    }
  })
}

export function fetchAfterMessage(params) {
  return request({
    url: '/message-board/message/list',
    method: 'get',
    params: {
      ...params,
      direction: 'after'
    }
  })
}

export function sendMessage(data) {
  return request({
    url: '/message-board/message/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}
