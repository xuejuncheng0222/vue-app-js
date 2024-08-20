import request from '@/api/http'

export const register = () => {
  return request({
    url: '/pass/register',
    method: 'get',
  })
}
