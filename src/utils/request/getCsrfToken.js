import { appId, baseUrl } from '../../config/base'
import { uuid, wxFunc } from '../util'

let Cookies = -1

export default async function(headerIn) {
    const app = getApp()
    const { globalData = {} } = app
    if (!Cookies || Cookies === -1) {
        Cookies = uni.getStorageSync('cookies') || ''
    }

    let header = {
        'content-type': 'application/json',
        'csrf-token': globalData.csrfToken || '',
        requestId: uuid(),
        appId,
        ...headerIn
    }

    const { code, res = {} } = await wxFunc('request', {
        url: `${baseUrl}/user/getBaseInfo`,
        method: 'GET',
        header
    })

    if (code === 0 && res.data) {
        app.globalData.csrfToken = res.data.data.csrfToken || ''

        if (res && res.header) {
            let cookies = res.header['set-cookie'] || res.header['Set-Cookie'] || ''

            if (cookies) {
                cookies = cookies.match(/sc.sess=(\S*);/)[0] + cookies.match(/sc:sess.sig=(\S*);/)[0].split(';')[0]
                if (Cookies !== cookies) {
                    console.log('set Cookies')
                    Cookies = cookies
                    uni.setStorageSync('cookies', Cookies)
                }
            }
        }

        return {
            retcode: 0,
            retmsg: 'success'
        }
    }

    return {
        retcode: res.statusCode || '-1',
        retmsg: '请求返回异常(无scrftoken)'
    }
}
