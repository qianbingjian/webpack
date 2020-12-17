import configLocal from './config-local'

export default {
  async config () {
    let origin = location.origin || (location.protocol + '//' + location.host)
    const localOrigin = origin

    // 本地开发环境
    const devOrigin = location.protocol + '//' + 'dev.zqlian.com'
    const isLocalhost = /localhost|127|192|(\D:\d+)/.test(origin)
    if (isLocalhost) origin = devOrigin
    const isDev = isLocalhost || origin.indexOf('//dev') > -1
    let BASE_LRON_BONES

    if (isLocalhost) {
      if (configLocal) {
        if (configLocal.origin) origin = configLocal.origin
        BASE_LRON_BONES = configLocal.BASE_LRON_BONES
      }
    }

    const isDevOrigin = origin.indexOf('dev.zqlian.com') > -1
    window.CONFIG = {
      isDevOrigin,
      isLocalhost,
      isDev,
      BASE_LRON_BONES,
      API_URL: origin + '/api',
      BASE_USER_URL: isLocalhost ? 'http://localhost:8010/#' : localOrigin + '/#',
      ...window.CONFIG
    }
    return origin
  }
}
