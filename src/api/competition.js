import request from '@/api/request'

export function getCompetitions(query) {
  return request({
    url: '/api/competitions',
    method: 'get',
    params: query
  })
}

export function getCompetitionLeaderboard(id,query) {
  return request({
    url: `/api/competition/${id}/leaderboard`,
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

export function getCompetition(id) {
  return request({
    url: `/api/competition/${id}`,
    method: 'get'
  })
}

export function postCompetitorToCompetition(data) {
  return request({
    url: '/api/competition/competitor/add',
    method: 'POST',
    data
  })
}

export function removeCompetitorFromCompetition(query) {
  return request({
    url: '/api/competition/competitor',
    method: 'DELETE',
    params: query
  })
}
