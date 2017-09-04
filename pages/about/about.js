var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
    data: {
        qrcodeurl: ''
    },
    onLoad: function () {
        var that = this;
        const app = getApp();
        this.setData({
            qrcodeurl: app.host + '/images/wxappqrcode.jpg?t=' + new Date().getTime()
        })
    },
    onImageError(e) {
        this.setData({
            qrcodeurl: ''
        })
    }

});