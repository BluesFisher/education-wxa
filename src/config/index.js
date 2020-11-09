const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const ENV = process.env.NODE_ENV || 'production'

const config = (() => {
    let config = {}

    /**
     * default: production config
     */
    fs.readdirSync(__dirname)
        .filter(f => f.endsWith('.js'))
        .forEach(f => {
            let _config = require(__dirname + '/' + f)
            config = Object.assign({}, config, _config)
        })

    /**
     * merge env config
     */
    let envDir = path.normalize(__dirname + '/' + ENV)
    fs.existsSync(envDir) &&
        fs
            .readdirSync(envDir)
            .filter(f => f.endsWith('.js'))
            .forEach(f => {
                let _config = require(envDir + '/' + f)
                config = _.merge({}, config, _config)
            })

    return config
})()

module.exports = config
