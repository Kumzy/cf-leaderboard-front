import request from '@/api/request'

export function postTeamToCompetition(data) {
  return request({
    url: '/api/team',
    method: 'POST',
    data
  })
}
