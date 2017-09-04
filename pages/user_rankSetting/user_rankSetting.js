var app = getApp();
Page({
    data:{
        selectItems: []
    },
    onLoad:function(option){
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            mask: true,
            duration: 50000
        })
        let that=this;
        wx.getStorage({//获取token
            key: 'token',
            success: function(res) {
                that.setData({
                    token:res.data
                })
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
                            if(reqRes.data.data.length>0){//判断是否已经加入群组
                                that.setData({
                                    selectItems:rs,
                                    userId:option.userId
                                })
                                wx.hideToast();
                            }else{
                                wx.hideToast();
                                wx.showModal({
                                    title: '未加入群组',
                                    content: '需先加入群组才能使用本功能',
                                    showCancel: false,
                                    confirmText: '去加入',
                                    success: res => {
                                        if(res.confirm) {
                                            wx.redirectTo({
                                                url: '../user_joinGroups/user_joinGroups',
                                            })
                                        }
                                    }
                                })
                            }
                        }else if(reqRes.data.code=="401"){
                            wx.hideToast();
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
                            wx.hideToast();
                            wx.showModal({
                                title: '后台服务错误',
                                content: reqRes.data.error,
                                showCancel: false,
                                confirmText: '返回',
                                success: res => {
                                    if(res.confirm) {
                                        wx.reLaunch({
                                            url: '../user_userMain/user_userMain'
                                        })
                                    }
                                }
                            })
                        }
                    
                    },
                    fail: e => {
                        wx.hideToast();
                        wx.showModal({
                            title: '网络访问故障',
                            content: e,
                            showCancel: false,
                            confirmText: '返回',
                            success: res => {
                                if(res.confirm) {
                                     wx.reLaunch({
                                        url: '../user_userMain/user_userMain'
                                    })
                                }
                            }
                        })
                    },
                })
            },
            fail:err =>{
                wx.hideToast();
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
    radioChange: function (e) {
        var radioItems = this.data.selectItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].is_default = radioItems[i].ID_ == e.detail.value?"Y":"";
        }
        this.setData({
            selectItems: radioItems,
        });
    },
    postSelected:function(value){
        this.setData({
            disableButton:true,
            loadingButton:true
        });
        let postData=value.detail.value;
        postData.userId=this.data.userId;
        wx.request({
            url: app.host + '/api/saveUserDefaultGroup',
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            data:postData,
            header: {
            'content-type': 'application/json',
            'x-auth-token': this.data.token
            }, // 设置请求的 header
            success: reqRes => {
                if(reqRes.data.code=="200"){
                    wx.showToast({
                            title: '设置成功',
                            icon: 'success',
                            mask:true,
                            duration: 2000
                        })
                    this.setData({
                        disableButton:false,
                        loadingButton:false
                    })
                }else if(reqRes.data.code=="401"){
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
                    wx.showModal({
                        title: '后台服务错误',
                        content: reqRes.data.error,
                        showCancel: false,
                        confirmText: '返回',
                        success: res => {
                            if(res.confirm) {
                                 wx.reLaunch({
                                    url: '../user_userMain/user_userMain'
                                })
                            }
                        }
                    })
                }
            
            },
            fail: e => {
                wx.showModal({
                    title: '网络访问故障',
                    content: e,
                    showCancel: false,
                    confirmText: '返回',
                    success: res => {
                        if(res.confirm) {
                            wx.reLaunch({
                                url: '../user_userMain/user_userMain'
                            })
                        }
                    }
                })
            }
        })
    },
    backTo:function(){
        wx.reLaunch({
              url: '../user_userMain/user_userMain'
            })
    }
})