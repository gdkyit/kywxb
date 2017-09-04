// ranking.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    view: '0',
    current: 0,
    phblist: ['积分榜', '群组榜', '考试榜', '业务榜'],
    userScoreRank: {},
    scoreRank: [],
    phbSubList: [],
    userExam: [],
    userExamRank: {},
    examRank: [],
    groupName:'',
    currentSubCat:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getJfb();
    this.getUserInfo();
  },
  
  getUserInfo() {
    let app = getApp();
    let that = this;
    let urlHost = app.host + "/images";
    // let urlHost = "http://202.104.10.34:83" + "/images";
    wx.getStorage({ //获取token
      key: 'token',
      success: function (res) {
        wx.request({
          url: app.host + '/api/currentUser',
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type': 'application/json',
            'x-auth-token': res.data
          }, // 设置请求的 header
          success: reqRes => {
            if (reqRes.data.code == "200") {
              let rs = reqRes.data.data;
              that.setData({
                personScoreRank: rs.userScoreRank,
                recordMap: rs.userInfo,
                userName: rs.userInfo.USER_NAME,
                groupName:rs.group.GROUP_NAME,
                IUrl: !!rs.userInfo.PHOTO ? urlHost + rs.userInfo.PHOTO + "?date=" + new Date().getTime() : '../../resource/img/avatar.png',
                contribution: !rs.userGxz.gxz ? rs.userGxz.count : rs.userGxz.gxz,
                totalScore: typeof rs.userScoreRank == "string" ? "无" : rs.userScoreRank.score.toFixed(2),
                totalUserResult: rs.totalUserResult,
                rightPersent: rs.userScoreRank == null ? "无" : !rs.userScoreRank.score && rs.userScoreRank.score != 0 ? "无" : (rs.totalUserResult.totalRightCount / rs.totalUserResult.totalCount * 100).toFixed(2) + '%'
              })
              wx.hideToast();
            } else if (reqRes.data.code == "401") {
              wx.hideToast();
              wx.showModal({
                title: '登陆过期',
                content: '登陆信息已过期，你需要登录才能使用本功能',
                showCancel: false,
                confirmText: '去登录',
                success: res => {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '../login/login',
                    })
                  }
                }
              })
            } else {
              wx.hideToast();
              wx.showToast({
                title: '后台服务错误',
                image: '/resource/img/error.png',
                duration: 3000
              });
            }

          },
          fail: e => {
            wx.hideToast();
            wx.showToast({
              title: '网络访问故障',
              image: '/resource/img/error.png',
              duration: 3000
            });
          },
        })
      },
      fail: err => { //获取token失败
        wx.hideToast();
        wx.showModal({
          title: '尚未登录',
          content: '你需要登录才能使用本功能',
          showCancel: false,
          confirmText: '去登录',
          success: res => {
            if (res.confirm) {
              wx.redirectTo({
                url: '../login/login',
              })
            }
          }
        })
      }
    })
  },

  getJfb: function () {
    wx.showNavigationBarLoading()
    const token = wx.getStorageSync('token');
    wx.request({
      url: app.host + '/api/jfb',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'x-auth-token': token
      }, // 设置请求的 header
      success: (res) => {
        if (res.statusCode == '200') {
          if (res.data.code == '200') {
            res.data.data.userScoreRank.score = res.data.data.userScoreRank.score.toFixed(2)
            for (let i = 0; i < res.data.data.scoreRank.length; i++) {
              let user = res.data.data.scoreRank[i];
              user.score = user.score.toFixed(2);
            }
            this.setData({
              userScoreRank: res.data.data.userScoreRank,
              scoreRank: res.data.data.scoreRank
            })
          } else if (res.data.error == '没设置默认积分榜') {
            this.setData({
              userScoreRank: {
                isNull: true,
                tips: '未设置默认积分榜,请先到个人管理页设置默认积分榜'
              },
              scoreRank: []
            })
          }


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
  /**
   * 获取群组榜列表
   */
  getQzbList: function () {
    wx.showNavigationBarLoading()
    const token = wx.getStorageSync('token');
    wx.request({
      url: app.host + '/api/userGroup',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'x-auth-token': token
      }, // 设置请求的 header
      success: (res) => {
        if (res.statusCode == '200') {
          this.setData({
            phbSubList: res.data.data,
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
  /**
   * 获取特定群组榜单
   */
  getQzb: function (gid) {
    wx.showNavigationBarLoading()
    const token = wx.getStorageSync('token');
    wx.request({
      url: app.host + '/api/qzb',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      data: {
        groupId: gid
      },
      header: {
        'content-type': 'application/json',
        'x-auth-token': token
      }, // 设置请求的 header
      success: (res) => {
        if (res.statusCode == '200') {
          if (res.data.code == '200' && !!res.data.data.userScoreRank) {
            res.data.data.userScoreRank.score = res.data.data.userScoreRank.score.toFixed(2)
            for (let i = 0; i < res.data.data.scoreRank.length; i++) {
              let user = res.data.data.scoreRank[i];
              user.score = user.score.toFixed(2);
            }
            this.setData({
              userScoreRank: res.data.data.userScoreRank,
              scoreRank: res.data.data.scoreRank
            })
          } else if (res.data.code == '200' && !res.data.data.userScoreRank) {
            this.setData({
              userScoreRank: {
                isNull: true,
                tips: '未加入任何群组,请先到个人管理页申请加入群组'
              },
              scoreRank: []
            })
          }
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
  /**
   * 获取考试榜列表
   */
  getKsbList: function () {
    wx.showNavigationBarLoading()
    const token = wx.getStorageSync('token');
    wx.request({
      url: app.host + '/api/userExam',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'x-auth-token': token
      }, // 设置请求的 header
      success: (res) => {
        if (res.statusCode == '200') {
          this.setData({
            phbSubList: res.data.data,
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
  /**
   * 获取特定考试榜单
   */
  getKsb: function (eid) {
    wx.showNavigationBarLoading()
    const token = wx.getStorageSync('token');
    wx.request({
      url: app.host + '/api/ksb',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      data: {
        examId: eid
      },
      header: {
        'content-type': 'application/json',
        'x-auth-token': token
      }, // 设置请求的 header
      success: (res) => {
        if (res.statusCode == '200') {
          res.data.data.userExamRank.score = Math.round(res.data.data.userExamRank.score)
          for (let i = 0; i < res.data.data.examRank.length; i++) {
            let user = res.data.data.examRank[i];
            user.score = Math.round(user.score);
          }
          this.setData({
            userExamRank: res.data.data.userExamRank,
            examRank: res.data.data.examRank
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
  /**
   * 获取业务榜列表
   */
  getFlpmList: function () {
    wx.showNavigationBarLoading()
    const token = wx.getStorageSync('token');
    wx.request({
      url: app.host + '/api/tkfl',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'x-auth-token': token
      }, // 设置请求的 header
      success: (res) => {
        if (res.statusCode == '200') {
          this.setData({
            phbSubList: res.data.data,
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
  /**
   * 获取特定分类业务榜单
   */
  getFlpm: function (eid) {
    wx.showNavigationBarLoading()
    const token = wx.getStorageSync('token');
    wx.request({
      url: app.host + '/api/flpm',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      data: {
        flId: eid
      },
      header: {
        'content-type': 'application/json',
        'x-auth-token': token
      }, // 设置请求的 header
      success: (res) => {
        if (res.statusCode == '200') {
          /*res.data.data.userDtxxRank.score = res.data.data.userDtxxRank.score.toFixed(2)
          for (let i = 0; i < res.data.data.dtxxRank.length; i++) {
            let user = res.data.data.dtxxRank[i];
            user.score = user.score.toFixed(2);
          }*/
          this.setData({
            userScoreRank: res.data.data.userDtxxRank[0],
            scoreRank: res.data.data.dtxxRank
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
  bindUserGroup(e) {
    let gid = e.currentTarget.dataset.gid
    let scat = e.currentTarget.dataset.scat
    this.getQzb(gid);
    this.setData({
      view: '12',
      currentSubCat:scat
    })
  },
  bindUserExam(e) {
    let eid = e.currentTarget.dataset.eid
    let scat = e.currentTarget.dataset.scat
    this.getKsb(eid);
    this.setData({
      view: '22',
      currentSubCat:scat
    })
  },
  bindUserFlpm(e) {
    let eid = e.currentTarget.dataset.eid
    let scat = e.currentTarget.dataset.scat
    this.getFlpm(eid);
    this.setData({
      view: '32',
      currentSubCat:scat
    })
  },
  bindPhbChange: function (e) {
    let phb =  e.currentTarget.dataset.phb
    this.setData({
      current: phb,
      currentSubCat:''
    })
    if (phb == 0) {
      this.getJfb();
      this.setData({
        view: '0'
      })
    } else if (phb == 1) {
      this.getQzbList();
      this.setData({
        view: '11'
      })
    } else if (phb == 2) {
      this.getKsbList();
      this.setData({
        view: '21'
      })
    } else if (phb == 3) {
      this.getFlpmList();
      this.setData({
        view: '31'
      })
    }
  },
  bindback(e) {
    let pv = e.currentTarget.dataset.pv;
    if (!!pv) {
      this.setData({
        view: pv
      })
    }
  }

})