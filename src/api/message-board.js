import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/message-board/message/list',
    method: 'get',
    params
  })
}

export function addMessage(data) {
  return request({
    url: '/message-board/message/add',
    method: 'post',
    data
  })
}
