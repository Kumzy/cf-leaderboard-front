import request from '@/api/request'

export function postScore(data) {
  return request({
    url: '/api/score',
    method: 'POST',
    data
  })
}

export function putScore(data,id) {
  return request({
    url: `/api/score/${id}`,
    method: 'PUT',
    data
  })
}

export function getScores(id) {
  return request({
    url: `/api/competition/${id}/scores`,
    method: 'GET'
  })
}

export function deleteScore(id) {
  return request({
    url: `/api/score/${id}`,
    method: 'DELETE'
  })
}