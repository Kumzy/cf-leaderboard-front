import request from '@/api/request'

export function getCountries() {
  return request({
    url: '/api/countries',
    method: 'get'
  })
}
