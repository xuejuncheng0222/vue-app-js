import axios from 'axios'
import qs from 'qs'

const service = axios.create({
  baseURL: '/knowServer', // url = base api url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000, // request timeout
})

service.interceptors.request.use(
  (config) => {
    if (config.type === 'form') {
      config.data = qs.stringify(config.data)
    }
    // 在此处添加请求头等，如添加 token
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (response.status !== 200) {
      return Promise.reject(res || 'error')
    } else {
      return Promise.resolve(response.data)
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

const request = (config) => {
  return new Promise((resolve, reject) => {
    service
      .request(config)
      .then((res) => resolve(res))
      .catch((err) => reject(err))
  })
}

export default request
