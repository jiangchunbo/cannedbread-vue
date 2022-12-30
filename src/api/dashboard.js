import request from '@/utils/request'

export function fetchUserRankingList(data) {
  return request({
    url: '/core/user/rank',
    method: 'get'
  })
}
