const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  proxy: {
    "/api": {
      "target": "http://api.passport.aiblogs.cn/api/",   //代理后转发规则（api）会拼接在url后边
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "" }
    },
    "/app": {
      "target": "http://api.app.aiblogs.cn/api/",   //代理后转发规则（api）会拼接在url后边
      "changeOrigin": true,
      "pathRewrite": { "^/app" : "" }
    },

  },
  externals: {
    '@antv/data-set': 'DataSet',
    rollbar: 'rollbar',
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableDynamicImport: true,
  publicPath: '/',
  hash: true,
};
