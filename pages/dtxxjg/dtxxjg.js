// dtxxjg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score:0,
    counts:0,
    rightCount:0,
    wrongCount:0  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      score:options.score,
      counts:options.counts,
      rightCount:options.rightCount,
      wrongCount:options.wrongCount
    })
  },
  bindback(){
    wx.reLaunch({
      url:'../learning/learning'
    })
  }
})