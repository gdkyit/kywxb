Page({
    data:{
        token:'',
        recordList:[]
    },
    onLoad:function(option){
    let app = getApp();
    let that=this;
    wx.showToast({
        title: '加载中',
        icon: 'loading',
        mask:true,
        duration: 50000
    })
    wx.getStorage({//获取token
        key: 'token',
        success: function(res) {
            that.setData({
                token:res.data
            })
            wx.request({
                url: app.host + '/api/exam?type=1',
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                'content-type': 'application/json',
                'x-auth-token': res.data
                }, // 设置请求的 header
                success: reqRes => {
                    if(reqRes.data.code=="200"){
                        that.setData({
                            recordList:reqRes.data.data,
                        })
                        wx.hideToast();
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
                                    wx.navigateBack({delta: 1})
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
                                wx.navigateBack({delta: 1})
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
    selectExam:function(event){
        wx.showModal({
                title: '备注',
                content: event.currentTarget.dataset.remark,
                confirmText: '开始考试',
                success: res => {
                    if(res.confirm) {
                        wx.redirectTo({
                            url: '../exam_examine_testing/exam_examine_testing?examId='+event.currentTarget.dataset.examid,
                        })
                    }
                }
            })
    }
})