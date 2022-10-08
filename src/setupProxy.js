const proxy = require('http-proxy-middleware')

module.exports=function(app){
    app.use(
        proxy.createProxyMiddleware('/api',{
            target:'http://127.0.0.1:8890',
            changeOrigin:true,
            pathRewrite:{'^/api':''}
        }),
        // proxy.createProxyMiddleware('ws',{
        //     target:'ws://127.0.0.1:8890',
        //     changeOrigin:true,
        //     pathRewrite:{'^ws':''}
        // }),
    )
}