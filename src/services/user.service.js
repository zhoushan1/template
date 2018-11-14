import localStorage from './localStorage.service'

export default{
  getToken () {
    return localStorage.get('token') || ''
  },
  saveToken (token) {
    localStorage.set('token', token)
  },
  removeToken () {
    localStorage.remove('token')
  },
  getUserInfo () {
    return localStorage.get('user')
  },
  saveUserInfo (userInfo) {
    localStorage.set('user', userInfo)
  },
  removeUserInfo () {
    localStorage.remove('user')
  },
  goLogin (noGoBack) {
    window.localStorage.clear()
    window.location.href = `${window.location.origin}/user/login`
  },
  saveLoginWay (loginWay) {
    localStorage.set('loginWay', loginWay)
  },
  getLoginWay () {
    return localStorage.get('loginWay')
  }
}
