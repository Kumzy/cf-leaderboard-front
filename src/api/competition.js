import request from '@/api/request'

export function getCompetitions(query) {
  return request({
    url: '/api/competitions',
    method: 'get',
    params: query
  })
}

export function postCompetition(data) {
  return request({
    url: '/api/competition',
    method: 'POST',
    data
  })
}
