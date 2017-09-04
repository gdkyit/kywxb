Page({
    data: {
        token: '',
        recordMap: {},
        userName: "",
        IUrl: "",
        contribution: 0,
    },
    onShow: function (option) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            mask: true,
            duration: 50000
        })
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
                                recordMap: rs.userInfo,
                                userName: rs.userInfo.USER_NAME,
                                IUrl: !!rs.userInfo.PHOTO ? urlHost + rs.userInfo.PHOTO + "?date=" + new Date().getTime() : '../../resource/img/avatar.png',
                                contribution: !rs.userGxz.gxz ? rs.userGxz.count : rs.userGxz.gxz,
                                scoreRank: rs.userScoreRank,
                                totalScore:typeof rs.userScoreRank=="string"?"无": rs.userScoreRank.score.toFixed(2),
                                totalUserResult: rs.totalUserResult,
                                rightPersent: rs.userScoreRank==null?"无":!rs.userScoreRank.score&&rs.userScoreRank.score!=0 ? "无" : (rs.totalUserResult.totalRightCount / rs.totalUserResult.totalCount * 100).toFixed(2) + '%'
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
                });
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
    checkIn:function(){
        wx.navigateTo({
            url: '../user_CheckIn/user_CheckIn'
        })
    },
    loginOut: function () {
        wx.removeStorageSync('token');
        wx.showModal({
            title: '消息',
            content: '成功退出',
            showCancel: false,
            confirmText: '返回登陆',
            success: res => {
                if (res.confirm) {
                    wx.redirectTo({
                        url: '../login/login',
                    })
                }
            }
        });
    },
    onImageError(e){
        this.setData({PHOTO:'../../resource/img/avatar.png'})
    }
})