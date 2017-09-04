var common = require ('../../lib/common.js')
// dtjl.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },

  /**
   * 获取答题记录列表
   */
  getList: function () {
    const app = getApp();
    const token = wx.getStorageSync('token');
    wx.request({
      url: app.host + '/api/dtxxRecordList',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'x-auth-token': token
      }, // 设置请求的 header
      success: (res) => {
        if (res.statusCode == '200') {
          this.setData({
            list: res.data.data,
          })

        } else {
          wx.showToast({
            title: res.data.error,
            image: '/resource/img/error.png',
            duration: 3000
          });
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
        // complete
      }
    })
  },
  bindtouchstart(e) {
    common.bindtouchstart(e, this)
  },
  bindtouchend(e) {
    common.bindtouchend(e, this);
  }
})