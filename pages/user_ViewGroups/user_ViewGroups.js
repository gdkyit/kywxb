var app = getApp();
Page({
    data:{
        selectItems:[]
    },
    onLoad:function(option){
        wx.showNavigationBarLoading();
        let that=this;
        wx.getStorage({//获取token
            key: 'token',
            success: function(res) {
                wx.request({
                    url: app.host + '/api/userGroup',
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    header: {
                    'content-type': 'application/json',
                    'x-auth-token': res.data
                    }, // 设置请求的 header
                    success: reqRes => {
                        let rs=reqRes.data.data;
                        if(reqRes.data.code=="200"){
                            that.setData({
                                selectItems:rs,
                                totalSize:rs.length
                            })
                            wx.hideNavigationBarLoading();
                        }else if(reqRes.data.code=="401"){
                            wx.hideNavigationBarLoading();
                            wx.showModal({
                                title: '登陆过期',
                                content: '登陆信息已过期，你需要登录才能使用本功能',
                                showCancel: false,
                                confirmText: '去登录',
                                success: res => {
                                    if(res.confirm) {
                                        wx.redirectTo({
                                            url: '../login/login',
                                        })
                                    }
                                }
                            })
                        }else{
                            wx.hideNavigationBarLoading();
                            wx.showModal({
                                title: '后台服务错误',
                                content: reqRes.data.error,
                                showCancel: false,
                                confirmText: '返回',
                                success: res => {
                                    if(res.confirm) {
                                        wx.navigateBack({delta: 1})
                                    }
                                }
                            })
                        }
                    
                    },
                    fail: e => {
                        wx.hideNavigationBarLoading();
                        wx.showModal({
                            title: '网络访问故障',
                            content: e,
                            showCancel: false,
                            confirmText: '返回',
                            success: res => {
                                if(res.confirm) {
                                    wx.navigateBack({delta: 1})
                                }
                            }
                        })
                    },
                })
            },
            fail:err =>{
                wx.hideNavigationBarLoading();
                wx.showModal({
                    title: '尚未登录',
                    content: '你需要登录才能使用本功能',
                    showCancel: false,
                    confirmText: '去登录',
                    success: res => {
                        if(res.confirm) {
                            wx.redirectTo({
                                url: '../login/login',
                            })
                        }
                    }
                })
            }
        })
    },
    backTo:function(){
       wx.navigateBack({delta: 1})
    }
})