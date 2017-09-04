Page({
    onReady: function (e) {
        const token = wx.getStorageSync('token');
        if (!token) {
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
    }
})