var common = require ('../../lib/common.js')
// xdjl.js
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
   * 获取知识库列表
   */
  getList: function () {
    const app = getApp();
    wx.showNavigationBarLoading()
    const token = wx.getStorageSync('token');
    wx.request({
      url: app.host + '/api/userXdjlTs',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'x-auth-token': token
      }, // 设置请求的 header
      success: (res) => {
        if (res.statusCode == '200') {
          let location = '/sxb-backend/ueditorupload'
          let data = res.data.data.map(item => {
            item.CONTENT = item.CONTENT.replace(/\/sxb-backend\/ueditorupload/g, app.uploadHost + location);
            return item;
          })
          wx.setStorageSync('xdjl', data)
          this.setData({
            list: data,
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
        wx.hideNavigationBarLoading()
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