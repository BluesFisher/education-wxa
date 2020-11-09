const _config = require('./src/config/index')

const path = require("path");
 
function resolve(dir) {
  return path.join(__dirname, dir);
}


module.exports = {
    chainWebpack: config => {
        config.plugin('define').tap(args => {
            args[0]['process.env'].config = JSON.stringify(_config)
            return args
        })
    },
    // 路径别名
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
  },
}
