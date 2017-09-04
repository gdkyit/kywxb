// login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  formSubmit(e) {
    let that = this;
    let username = e.detail.value.username;
    let password = e.detail.value.password;
    /* 测试使用账户，正式环境去掉 */
    // username = '13829397905';
    // password = '666666'
    /* ====================================  */
    if (!!username && !!password) {
      let app = getApp();
      that.setData({
        loading: true
      });
      wx.request({
        url: app.host + '/api/auth',
        data: {
          username: username,
          password: password
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/json'
        }, // 设置请求的 header
        success: res => {
          if(res.statusCode == 200 && !!res.data.token){
            wx.setStorageSync('token', res.data.token)
            wx.reLaunch({
              url: '../ranking/ranking'
            })
          }else if(res.statusCode == 200 && res.data.code == '500'){
            wx.showModal({
              title:'登录失败',
              content:res.data.error,
              showCancel:false
            })
          }
          
        },
        fail: e => {
          wx.showToast({
            title: '网络访问故障',
            image: '/resource/img/error.png',
            duration: 3000
          });
        },
        complete: e => {
          that.setData({
            loading: false
          })
        }
      })
    }
  }


})