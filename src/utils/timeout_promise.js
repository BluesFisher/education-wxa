/**
 * promise 超时处理
 * @param {int} ms 设置超时时间
 * @param {promise} promise 传入需要执行的promise
 * @return promise race
 */

const promiseTimeout = function(ms, promise) {
  // Create a promise that rejects in <ms> milliseconds
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id)
            reject('Timed out in ' + ms + 'ms.')
        }, ms)
    })

  // Returns a race between our timeout and the passed in promise
    return Promise.race([
        promise,
        timeout
    ])
}

export default promiseTimeout
