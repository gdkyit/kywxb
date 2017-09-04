var app = getApp();
Page({
    data:{
        checkboxItems: [],
        userItems:[],
        disableButton:true,
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
                    url: app.host + '/api/messages/groupchange',
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    header: {
                    'content-type': 'application/json',
                    'x-auth-token': res.data
                    }, // 设置请求的 header
                    success: reqRes => {
                        let rs=reqRes.data.data;
                        let userItems=[];
                        if(reqRes.data.code=="200"){
                            that.setData({
                                checkboxItems:rs,
                                userItems:userItems,
                            })
                            wx.hideToast();
                        }else if(reqRes.data.code=="204"){
                            wx.hideToast();
                             wx.showModal({
                                content: '您不需要签到',
                                showCancel: false,
                                confirmText: '返回',
                                success: res => {
                                    if(res.confirm) {
                                        wx.navigateBack({delta: 1})
                                    }
                                }
                            })
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
        let postData='';
        for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
            for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                if(checkboxItems[i].id_ == values[j]){
                    newUserItems[i] = {id_:values[j]};//按排序号重构user已选list
                    if(postData.length>0){
                        postData +=','
                    }
                    postData+=values[j];
                    break;
                }
            }
        }
        this.setData({
            userItems: newUserItems,
            postData:postData,
            disableButton:postData==0,
        });
    },
    selectAll:function(){
        let postData='';
        let items=this.data.checkboxItems;
        for (var j = 0; j < items.length; j++) {
                    if(postData.length>0){
                        postData +=','
                    }
                    postData+=items[j].id_;
            }
        this.setData({
            userItems: items,
            postData:postData,
            disableButton:false,
        });
    },
    selectClear:function(){
        this.setData({
            userItems: [],
            postData:'',
            disableButton:true,
        });
    },
    putLearningList:function(value){
        this.setData({
            disableButton:true,
            loadingButton:true
        })
        wx.request({
            url: app.host + '/api/messages/groupsign',
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            data:{id:this.data.postData},
            header: {
            'content-type': 'application/json',
            'x-auth-token': this.data.token
            }, // 设置请求的 header
            success: reqRes => {
                if(reqRes.data.code=="200"){
                    wx.showModal({
                                content: '签到成功',
                                showCancel: false,
                                confirmText: '返回',
                                success: res => {
                                    if(res.confirm) {
                                        wx.navigateBack({delta: 1})
                                    }
                                }
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