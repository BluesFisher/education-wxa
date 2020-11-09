/**
 *
 * @param {Function} func 需要单例执行的方法
 * @param {Array} args 方法执行需要的参数
 * @param {String} singletonKey 缓存时挂载的key值
 */
export default function AsyncSingletonLock(func, args = [], singletonKey) {
    singletonKey = singletonKey || '_asyncSingleton'
    if (func[singletonKey]) return func[singletonKey]

    func[singletonKey] = func(...args)
    if (func[singletonKey].then) {
        func[singletonKey].then(
        () => {
            func[singletonKey] = null
            delete func[singletonKey]
        },
        () => {
            func[singletonKey] = null
            delete func[singletonKey]
        }
      )
    } else {
        console.error('AsyncSingletonLock error: ', func, ' is not a Promise')
    }

    return func[singletonKey]
}
