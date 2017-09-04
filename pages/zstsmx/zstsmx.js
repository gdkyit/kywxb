var common = require('../../lib/common.js')
// zstsmx.js
var WxParse = require('../../lib/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    date: '',
    title: '',
    clientx: 0,
    clienty: 0,
    timeStamp: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let index = options.i;
    let zsts = wx.getStorageSync('zsts');
    let content = zsts[index].CONTENT;
    let title = zsts[index].TITLE;
    let date = zsts[index].DATE;
    WxParse.wxParse('article', 'html', content, this);
    this.setData({
      date: date,
      title: title
    })
  },
  bindtouchstart(e) {
    common.bindtouchstart(e, this)
  },
  bindtouchend(e) {
    common.bindtouchend(e, this);
  }
})