import request from '@/api/request'

export function login(data) {
  return request({
    url: '/token/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/user',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/token/logout',
    method: 'post'
  })
}
