const CONFIG = process.env.config
import apiReq from '../utils/request/index'

export default {
    onLoad() {},
    onShow() {},
    onHide() {},
    onUnload() {},
    onShareAppMessage() {
        return {
            title: CONFIG.mini.barTitle,
            path: '/pages/index/index'
        }
    },
    methods: {
        apiReq,
        /**
         * 点击事件上报
         * @param {String} eventName 事件key
         * @param {Object} extra 自定义上报内容
         * @postscript Vue.directive 微信小程序不支持
         */
        async clickStat(eventName, extra = {}) {}
    }
}
