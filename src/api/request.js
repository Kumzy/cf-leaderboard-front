import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // Replace with actual server IP
  baseURL: 'http://127.0.0.1:5000/', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // console.log(this.$cookie.get('token'))
    config.headers['Access-Control-Allow-Origin'] = '*'
    if (store.getters.token) {
      // let each request carry token
      // config.headers['Access-Control-Allow-Origin'] = '*'
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      // TODO: show message generic alert for errors

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
          // TODO: show a message of token expired before dispatching to the reset token
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // TODO: show a message error alert
    // console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
