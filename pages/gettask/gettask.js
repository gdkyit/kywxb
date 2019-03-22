var app = getApp();
Page({
  data: {
    options: [
      {
        text: "价格",
        type: "sort"
      },
      {
        text: "面积",
        type: "sort"
      },
      {
        text: "完成日期",
        type: "sort"
      }
    ],
    tasks: [
      { room: 1205, area: 30, price: 40 },
      { room: 1206, area: 32, price: 42 },
      { room: 1207, area: 32, price: 42 },
      { room: 1208, area: 36, price: 45 },
      { room: 1209, area: 40, price: 50 },
      { room: 1210, area: 40, price: 50 },
    ]
  },
  handleChange(e) {
    console.log(e);
  }
  /*     onLoad: function (option) {

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
    }, */
});
