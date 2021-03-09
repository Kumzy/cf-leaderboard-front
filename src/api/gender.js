import request from '@/api/request'

export function getGenders() {
  return request({
    url: '/api/genders',
    method: 'get'
  })
}
