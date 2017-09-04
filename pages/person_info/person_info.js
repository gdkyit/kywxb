// person_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    USER_NAME: '',
    BIRTHDAY: '',
    PHOTO: '',
    RZSJ: '',
    userScore: [],
    dept: '',
    parentDept: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let uid = options.uid;
    const app = getApp();
    wx.showNavigationBarLoading()
    const token = wx.getStorageSync('token');
    wx.request({
      url: app.host + '/api/personalInfo',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      data: {
        userId: uid
      },
      header: {
        'content-type': 'application/json',
        'x-auth-token': token
      }, // 设置请求的 header
      success: (res) => {
        if (res.statusCode == '200' && res.data.code == '200') {
          let {
            USER_NAME,
            BIRTHDAY,
            PHOTO,
            RZSJ
          } = res.data.data.userInfo;
          let userScore = res.data.data.userScore.map(item => {
            item.score = item.score.toFixed(2);
            return item
          });
          let dept = !!res.data.data.userInfo.dept?res.data.data.userInfo.dept.dept_name:'';
          let parentDept = !!res.data.data.userInfo.parentDept?res.data.data.userInfo.parentDept.dept_name:'';
          PHOTO = !!PHOTO ? PHOTO = app.host + '/images' + PHOTO : '../../resource/img/avatar.png';
          BIRTHDAY = Array.isArray(BIRTHDAY)?BIRTHDAY.split(" ")[0]:'';
          RZSJ = Array.isArray(RZSJ)?RZSJ.split(" ")[0]:'';
          
          this.setData({
            USER_NAME,
            BIRTHDAY,
            PHOTO,
            RZSJ,
            userScore,
            dept,
            parentDept
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
        wx.hideNavigationBarLoading()
      }
    })
  },
  onImageError(e) {
    this.setData({ PHOTO: '../../resource/img/avatar.png' })
  }

})