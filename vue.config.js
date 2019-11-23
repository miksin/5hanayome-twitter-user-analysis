module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? process.env.PUBLIC_PATH || '' : '',
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/styles/_variables.scss";
          @import "@/styles/_mixins.scss";
        `
      }
    }
  }
}
