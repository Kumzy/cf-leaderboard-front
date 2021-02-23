import request from '@/api/request'

export function getCompetitors(query) {
  return request({
    url: '/api/competitors',
    method: 'get',
    params: query
  })
}