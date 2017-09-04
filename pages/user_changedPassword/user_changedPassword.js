var app = getApp();
Page({
    data: {
        disablePassword:false,
        loadingPassword:false,

    },
    onLoad:function(option){
        this.setData({
            userId:option.userId,
        })
    },
    putPassword:function(value){
        this.setData({
            disablePassword:true,
            loadingPassword:true,
        })
        let newPassword=value.detail.value;
        if(newPassword.password==""||newPassword.secandPassword==""){
            //判断密码是否为空
            wx.showToast({
                title: '请填写密码',
                image: '/resource/img/error.png',
                duration: 3000
            });
        }else if(newPassword.password!=newPassword.secandPassword){
            wx.showToast({
                title: '两次密码不一致',
                image: '/resource/img/error.png',
                duration: 3000
            });
        }else{
            const token = wx.getStorageSync('token');
            newPassword.userId=this.data.userId;
            let that=this
            wx.request({
                url: app.host + '/api/updateUserPwd',
                data: newPassword,
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                'content-type': 'application/json',
                'x-auth-token': token
                }, // 设置请求的 header
                success: res => {
                    if(res.statusCode == 200&&res.data.code=="200"){
                        wx.showModal({
                            title: '密码修改成功',
                            content:'请返回登陆页面重新登陆',
                            showCancel: false,
                            confirmText: '去登陆',
                            success: res => {
                                if(res.confirm) {
                                    wx.redirectTo({
                                        url: '../login/login',
                                    })
                                }
                            }
                        })
                    }else{
                        that.setData({
                            disablePassword:false,
                            loadingPassword:false,
                        })
                        wx.showToast({
                        title: '修改失败',
                        image: '/resource/img/error.png',
                        duration: 2000
                        });
                    }
                },
                fail: e => {
                    that.setData({
                        disablePassword:false,
                        loadingPassword:false,
                    })
                    wx.showToast({
                        title: '网络访问故障',
                        image: '/resource/img/error.png',
                        duration: 3000
                    });
                }
            })
        }
    },
    backTo:function(){
        wx.navigateBack({delta: 1})
    }
});