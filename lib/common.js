module.exports = {
    /**
     * 水平滑动返回
     */
    bindtouchstart(e,that) {
        that.setData({
            clientx: e.changedTouches[0].clientX,
            clienty: e.changedTouches[0].clientY,
            timeStamp: e.timeStamp
        })
    },
    bindtouchend(e,that) {
        let lastx = e.changedTouches[0].clientX;
        let lasty = e.changedTouches[0].clientY;
        let lastTimeStamp = e.timeStamp;

        //滑动水平距离超过100个像素，水平夹角不超过15°（使用tan值做条件判断），判定为滑动翻页
        // 水平滑动距离判定条件值，可按需调整，当前取值100像素
        const conDisX = 100;
        //滑动水平夹角判定条件值，可按需调整,当前取值15度
        const conTanY = Math.tan(18 * Math.PI / 180);

        let distanceX = lastx - that.data.clientx;
        let tan = Math.abs((lasty - that.data.clienty) / distanceX)
        if (tan < conTanY && distanceX > conDisX) {
            wx.navigateBack();
        }
    }
}