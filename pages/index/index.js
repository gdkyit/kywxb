var app = getApp();
Page({
    data: {

    },
    onLoad: function (option) {

        wx.getStorage({ //获取token
            key: 'token',
            success: function (res) {
                setTimeout(function(){
                    wx.reLaunch({
                        url: '../ranking/ranking'
                    })
                    app.getSysMsg();
                },3000)
            },
            fail: err => { //获取token失败
                setTimeout(function(){
                    wx.redirectTo({
                        url: '../login/login',
                    })
                },3000)
            }
        })
    },
    


});