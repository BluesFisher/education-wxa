import dayjs from 'dayjs'

/* eslint-disable no-plusplus */
// uuid params
let _nodeId
let _clockseq
let _lastMSecs = 0
let _lastNSecs = 0
let byteToHex = []
for (let i = 0; i < 256; ++i) {
    byteToHex[i] = (i + 0x100).toString(16).substr(1)
}

let requestTask = {}

export function debounce(fn, delay = 1000) {
    let timer

    // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 func 函数
    return function() {
        // 保存函数调用时的上下文和参数，传递给func
        var context = this
        var args = arguments

        // 函数被调用，清除定时器
        clearTimeout(timer)

        // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
        // 再过 delay 毫秒就执行 func
        timer = setTimeout(function() {
            fn.apply(context, args)
        }, delay)
    }
}

// wx func
export function wxFunc(funcName = '', option = {}, completeFunc) {
    const taskTag = dayjs().format('YYYYMMDD-hhmmss') + `${Math.random()}`.substring(3, 7)

    return new Promise((resolve, reject) => {
        option.success = res => {
            resolve({ code: 0, res })
        }
        option.fail = res => {
            const err = { code: -1, res }
            resolve(err)
        }
        option.complete = res => {
            delete requestTask[taskTag]
            completeFunc && completeFunc(res)
        }
        if (wx[funcName]) {
            if (funcName === 'request') {
                requestTask[taskTag] = wx[funcName](option)
            } else {
                wx[funcName](option)
            }
        }
    })
}
const bytesToUuid = buf => {
    let uuid = ''
    for (let i = 0; i < 16; i++) {
        uuid += byteToHex[buf[i]]
        if ([3, 5, 7, 9].indexOf(i) !== -1) {
            uuid += '-'
        }
    }
    uuid = uuid.substr(0, uuid.length - 1) + 'w' // mark uuid for wxa
    return uuid
}

export const uuid = () => {
    let i = 0
    let b = []
    let node = _nodeId
    let clockseq = _clockseq
    if (node == null || clockseq == null) {
        let seedBytes = `${Math.random()}`.substr(3, 19)
        if (node == null) {
            node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]]
        }
        if (clockseq == null) {
            clockseq = _clockseq = ((seedBytes[6] << 8) | seedBytes[7]) & 0x3fff
        }
    }
    let msecs = new Date().getTime()
    let nsecs = _lastNSecs + 1
    let dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000
    if (dt < 0) {
        clockseq = (clockseq + 1) & 0x3fff
    }
    if (dt < 0 || msecs > _lastMSecs) {
        nsecs = 0
    }
    if (nsecs >= 10000) {
        throw new Error("uuid: Can't create more than 10M uuids/sec")
    }
    _lastMSecs = msecs
    _lastNSecs = nsecs
    _clockseq = clockseq
    msecs += 12219292800000
    // `time_low`
    let tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000
    b[i++] = (tl >>> 24) & 0xff
    b[i++] = (tl >>> 16) & 0xff
    b[i++] = (tl >>> 8) & 0xff
    b[i++] = tl & 0xff
    // `time_mid`
    let tmh = ((msecs / 0x100000000) * 10000) & 0xfffffff
    b[i++] = (tmh >>> 8) & 0xff
    b[i++] = tmh & 0xff
    // `time_high_and_version`
    b[i++] = ((tmh >>> 24) & 0xf) | 0x10 // include version
    b[i++] = (tmh >>> 16) & 0xff
    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = (clockseq >>> 8) | 0x80
    b[i++] = clockseq & 0xff
    for (let n = 0; n < 6; ++n) {
        b[i + n] = node[n]
    }
    return bytesToUuid(b)
}
