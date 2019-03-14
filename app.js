    //app.js

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
  },
  onShow: function () {
    let pages = getCurrentPages();
    if (pages.length > 0 && pages[pages.length - 1].route != 'pages/index/index') {
     // this.getSysMsg();
    }
  },
  globalData: {},
  host: "https://apps.gdkyit.com/kxb-backend",
  uploadHost: 'https://apps.gdkyit.com/kxb-backend',
  launching: false
})