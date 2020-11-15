const ENV = process.env.NODE_ENV || 'production'
const PLATFORM = process.env.VUE_APP_PLATFORM || 'mp-weixin'

module.exports = {
    // 固定，后续可提取到common
    env: ENV,
    platform: PLATFORM,
    appId: 'wx4ca43a4bd45566da',
    baseUrl: ENV === 'test' ? 'http://localhost:3000' : 'https://www.yuqi.blue/api', //'http://localhost:3000', https://www.yuqi.blue/api
    barTitle: '服务平台'
}
