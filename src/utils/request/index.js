import { appId, baseUrl } from '../../config/base'
import { uuid, wxFunc } from '../util'
import store from '../../store'
import getCsrfToken from './getCsrfToken'
const R = require('ramda')

const _reqFunc = ({ headerIn, api, data }) => {
    const app = getApp()
    const { globalData = {} } = app

    let header = {
        ...headerIn,
        'content-type': 'application/json',
        'csrf-token': globalData.csrfToken || '',
        requestId: uuid(),
        appId,
        cookie: uni.getStorageSync('cookies') || '',
        Authorization: `Bearer ${uni.getStorageSync('jwt') || ''}`
    }

    return new Promise((resolve, reject) => {
        wx.request({
            url: `${baseUrl}${api}`,
            method: 'POST',
            header,
            data,
            success: async res => {
                if (res.statusCode === 200) {
                    let cookies = res.header['set-cookie'] || res.header['Set-Cookie'] || ''
                    cookies = (cookies.match(/token=(\S*);/) || [])[1]
                    if (cookies) {
                        console.log('set jwt')
                        uni.setStorageSync('jwt', cookies)
                    }
                    resolve(res.data)
                } else {
                    resolve({
                        retcode: res.statusCode || '-1',
                        retmsg: '请求返回异常'
                    })
                }
            },
            fail: res => {
                uni.showToast({
                    title: `${res.statusCode || '-1'}请求发生异常`,
                    icon: 'none',
                    duration: 2000
                })
            },
            complete: res => {}
        })
    })
}

export default async function apiReq(api, data) {
    const app = getApp()
    const { globalData = {} } = app

    let header = {
        'content-type': 'application/json',
        'csrf-token': globalData.csrfToken || '',
        requestId: uuid(),
        appId
    }

    let res = await _reqFunc({ header, api, data })

    // 如果没有csrf-token
    if (+res.retcode === 403) {
        res = await getCsrfToken(header, { api, data })

        if (res.retcode === 0) {
            res = await _reqFunc({ header, api, data })
        }
    }

    // 如果没有jwt token
    if (res.retcode === 401) {
        const code = R.path(['res', 'code'], await wxFunc('login'))

        if (code) {
            const { avatarUrl, gender, nickName } = store.state.baseInfo
            res = await _reqFunc({ header, api: '/user/getSid', data: { code, avatarUrl, gender, nickName } })

            if (res.code === 0) {
                uni.setStorageSync('jwt', R.path(['data', 'token'], res))
                res = await _reqFunc({ header, api, data })
            }
        }
    }

    return res
}
