//app.js

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
  },
  onShow: function () {
    let pages = getCurrentPages();
    if (pages.length > 0 && pages[pages.length - 1].route != 'pages/index/index') {
      this.getSysMsg();
    }
  },
  getSysMsg() {
    const token = wx.getStorageSync('token');
    wx.request({
      url: this.host + '/api/messages/groupchange',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'x-auth-token': token
      }, // 设置请求的 header
      success: (res) => {
        if (res.statusCode == '200') {
          if (res.data.code == '200') {
            let groups = res.data.data.map((item)=>{
              return '你已加入'+item.groupname;
            });
            let content = groups.join('\r\n')

            wx.showModal({
              title: '已被加入新的群组',
              content: content,
              showCancel: false,
              mask: true
            });
          }
        } else if (res.statusCode == '401') {
          wx.removeStorageSync('token')
          wx.reLaunch({
            url: '../login/login',
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络访问故障',
          image: '/resource/img/error.png',
          duration: 3000
        });
      },
      complete: function () {
      }
    })
  },
  globalData: {},
  host: "https://app.gdkyit.com/kxb",
  uploadHost: 'https://app.gdkyit.com/kxb',
  launching: false
})