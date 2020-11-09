import timeoutPromise from './timeout_promise'
import AsyncSingletonLock from './async_singleton_lock'
let networkType = null

const timeoutSetting = {
    getSetting: 5000,
    getLocation: 5000,
    getSystemInfo: 1000,
    getUserInfo: 5000,
    getNetworkType: 1000
}

async function GetNetworkType() {
    return new Promise((resolve, reject) => {
        wx.getNetworkType({
            success: async res => {
                resolve(res)
            }
        })
    })
}

export default {
    _getNetworkType: async function getNetworkType(params) {
        if (networkType) return networkType
        console.log('wxUtils._getNetworkType networkType is', networkType)
        try {
            let startTime = Date.now()
            let networkTypeRes = await timeoutPromise(timeoutSetting.getNetworkType, GetNetworkType()) // 系统调用时间再20ms~50ms左右
            networkType = networkTypeRes.networkType
            console.log('wxUtils._getNetworkType -> wxp.getNetworkType cost: ', Date.now() - startTime)
			console.log('wxUtils._getNetworkType -> wxp.getNetworkType paramObj: ', params)
        } catch (e) {
            return networkType
        } finally {
            wx.onNetworkStatusChange(res => {
                networkType = (res && res.networkType) || ''
            })
        }
        return networkType
    },

    getNetworkType: async function getNetworkType(params) {
        return AsyncSingletonLock(this._getNetworkType, [params || {}])
    },

    getCurrentPage: function getCurrentPage() {
        try {
            let pages = getCurrentPages()
            if (pages.length > 0) {
                return pages[pages.length - 1]
            }
        } catch (e) {
            console.error('wxUtils.getCurrentPage -> getCurrentPage error: ', e)
        }
        return null
    },

    getCurrentPath: function getCurrentPath() {
        let path = ''
        try {
            let pages = getCurrentPages()
            if (pages.length > 0) {
                path = pages[pages.length - 1].route
            }
            return path
        } catch (e) {
            console.error('wxUtils.getCurrentPath -> getCurrentPath error: ', e)
            return ''
        }
    },

    getPathInfo: function getPathInfo() {
        try {
            let pathInfo = {
                currentPath: '',
                currentQuery: '',
                referrerPath: ''
            }
            let pages = getCurrentPages()
            if (pages.length > 0) {
                pathInfo.currentPath = pages[pages.length - 1].route
                pathInfo.currentQuery = JSON.stringify(pages[pages.length - 1].options || {})
            }
            if (pages.length > 1) {
                pathInfo.referrerPath = pages[pages.length - 2].route || ''
            }
            return pathInfo
        } catch (e) {
            console.error('wxUtils.getPathInfo -> getPathInfo error: ', e)
            return {}
        }
    }
}
