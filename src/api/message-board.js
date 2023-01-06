import request from '@/utils/request'

export function fetchMessageBoardList(params) {
  return request({
    url: '/message-board/message/list',
    method: 'get',
    params
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
