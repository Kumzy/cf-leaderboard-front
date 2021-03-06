import request from '@/api/request'

export function postScore(data) {
  return request({
    url: '/api/score',
    method: 'POST',
    data
  })
}