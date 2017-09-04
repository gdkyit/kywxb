// jiucuo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    charts:0,
    tkid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tkid = options.tkid
    this.setData({tkid:tkid})
  },

  bindinput(e){
    let value = e.detail.value;
    let length = value.length;
    this.setData({charts:length})
  },
  back(){
    wx.navigateBack()
  },
   /**
   * 显示网络错误提示
   */
  showNetErr() {
    wx.showToast({
      title: '网络访问故障',
      image: '/resource/img/error.png',
      duration: 3000
    });
  },
  /**
   * 显示错误提示
   */
  showErr(content) {
    wx.showToast({
      title: content,
      image: '/resource/img/error.png',
      duration: 2000
    });
  },
  formSubmit(e){
    const app = getApp();
    const token = wx.getStorageSync('token');
    let tkid = this.data.tkid;
    let value = e.detail.value;
    let text = value.text;
    if(text.length>0){
      let postdata = {
      zstkId: tkid,
      dzDate: new Date(),
      type: '2',
      remark: text
    }
      wx.request({
      url: app.host + '/api/laudRecord',
      data: postdata,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'x-auth-token': token
      }, // 设置请求的 header
      success: (res) => {
        if (res.statusCode == '200' && res.data.code == '200') {
          wx.navigateBack()
        } else {
          this.showErr(res.data.error)
        }
      },
      fail: ()=> {
        this.showNetErr();
      },
      complete: function () {
      }
    })
    }
  }
})