import request from '@/api/request'

export function getCompetitors(query) {
  return request({
    url: '/api/competitors',
    method: 'get',
    params: query
  })
}

export function putCompetitor(data) {
  return request({
    url: '/api/competitor/'+data.id,
    method: 'put',
    data
  })
}

export function deleteCompetitor(id) {
  return request({
    url: `/api/competitor/${id}`,
    method: 'delete'
  })
}