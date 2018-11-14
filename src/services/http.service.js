import axios from 'axios'
import { Notice } from 'iview'
import localStorage from './localStorage.service'
import config from '../config'

window.Promise = require('es6-promise').Promise

const axiosConfig = {
  timeout: 15000
}
const opRedirectUrl = `${config.opapiHost}/user/toLogin`
const instance = axios.create(Object.assign({}, axiosConfig))
instance._extend = {}

function requestInterceptor (config) {
  config.headers['x-requested-with'] = 'XMLHttpRequest'
  //config.headers['x-auth-system'] = 'LZS'

  if (!config.headers['x-auth-token']) {
    config.headers['x-auth-token'] = localStorage.get('token') || ''
  }

  return config
}

function responseInterceptor (response) {
  if (response.headers['content-type'] === 'application/octet-stream' ||
    response.headers['content-type'] === 'application/vnd.ms-excel;charset=UTF-8') {
    return response.data
  }
  if (response.config.responseType === 'arraybuffer') {
    return response.data
  }

  if (response.status < 200 || response.status > 300) {
    Notice.error({
      title: '请求发生错误',
      desc: (response && response.data && response.data.msg) || '请求出错了'
    })
    return Promise.reject(response && response.data)
  }

  // lzs接口返回格式
  if (response.data.code === 0) {
    return Promise.resolve(response.data.body || {})
  }

  // opapi返回格式
  if (response.data.code === '0000' && response.data.businessCode === '0000') {
    return Promise.resolve(response.data.data || {})
  }

  Notice.error({
    title: '',
    desc: response.data.msg || response.data.message || '程序出错了'
  })
  return Promise.reject(response && response.data)
}

/**
 * 不使用默认拦截器
 *    axios.interceptors.request.eject(0)
 *    axios.interceptors.response.eject(0)
 */
instance.interceptors.request.use(requestInterceptor, (error) => {
  return Promise.reject(error)
})

instance.interceptors.response.use(responseInterceptor, error => {
  if (error.response && error.response.status === 401) {
    let href = window.location.href
    href = href.replace(/\?token=[a-z0-9\-A-Z]+/g, '')
    window.location.href = opRedirectUrl + '?url=' + window.btoa(href)
  }

  if (error.message.indexOf('timeout') !== -1) {
    Notice.error({
      title: '',
      desc: '请求超时'
    })
  }
  return Promise.reject(error)
})

export default instance
