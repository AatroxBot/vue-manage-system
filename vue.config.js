module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
     devServer: {
         proxy: {
             '/':{
                 target:'http://106.15.126.218:8201/',
                 changeOrigin:true
             }
         }
     }
}