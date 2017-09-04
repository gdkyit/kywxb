var common = require ('../../lib/common.js')
// dtjlmx.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app = getApp();
    const token = wx.getStorageSync('token');
    wx.showNavigationBarLoading();
    wx.request({
      url: app.host + '/api/dtxxRecordDetail',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      data:{day:options.day},
      header: {
        'content-type': 'application/json',
        'x-auth-token': token
      }, // 设置请求的 header
      success: (res) => {
        if (res.statusCode == '200' && res.data.code == '200') {
          this.setData({
            list: res.data.data,
          })

        } else {
          wx.showToast({
            title: res.data.error,
            image: '/resource/img/error.png',
            duration: 2000
          });
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络访问故障',
          image: '/resource/img/error.png',
          duration: 2000
        });
      },
      complete: function () {
        wx.hideNavigationBarLoading();
      }
    })
  },

  bindtouchstart(e) {
    common.bindtouchstart(e,this)
  },
  bindtouchend(e) {
   common.bindtouchend(e,this);
  }
})