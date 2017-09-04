var app = getApp();
Page({
    data:{
        checkboxItems: [],
        userItems:[],
        disableButton:false,
        loadingButton:false
    },
    onLoad:function(option){
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            mask:true,
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
                    url: app.host + '/api/userTkfl',
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    data:{parentId:''},
                    header: {
                    'content-type': 'application/json',
                    'x-auth-token': res.data
                    }, // 设置请求的 header
                    success: reqRes => {
                        let rs=reqRes.data.data;
                        let userItems=[];
                        for(let i=0;i<rs.tkfl.length;i++){
                            for(let j=0;j<rs.userTkfldy.length;j++){
                                if(rs.tkfl[i].ID_ == rs.userTkfldy[j].ID_){
                                    userItems[rs.tkfl[i].pxh-1] = {ID_:rs.userTkfldy[j].ID_};//按排序号重构user已选list
                                    break;
                                }
                            }
                        }
                        if(reqRes.data.code=="200"){
                            that.setData({
                                checkboxItems:rs.tkfl,
                                userItems:userItems,
                                userId:option.userId
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
    checkboxChange: function (e) {
        var checkboxItems = this.data.checkboxItems, values = e.detail.value;
        let newUserItems=[];
        for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
            for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                if(checkboxItems[i].ID_ == values[j]){
                    newUserItems[checkboxItems[i].pxh-1] = {ID_:values[j]};//按排序号重构user已选list
                    break;
                }
            }
        }
        this.setData({
            userItems: newUserItems
        });
    },
    putLearningList:function(value){
        this.setData({
            disableButton:true,
            loadingButton:true
        })
        let selected =value.detail.value.subscription;
        let postList=[];
        for(let i=0;i<selected.length;i++){
            postList[i]={userId:this.data.userId,flId:selected[i]}
        }
        wx.request({
            url: app.host + '/api/tkfldy',
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            data:postList,
            header: {
            'content-type': 'application/json',
            'x-auth-token': this.data.token
            }, // 设置请求的 header
            success: reqRes => {
                if(reqRes.data.code=="200"){
                    wx.showToast({
                            title: '订阅成功',
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
                                wx.navigateBack({delta: 1})
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
                            wx.navigateBack({delta: 1})
                        }
                    }
                })
            },
        })
    },
    backTo:function(){
        wx.navigateBack({delta: 1})
    }
})