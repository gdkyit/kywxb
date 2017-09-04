// dtxx.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questions: [],
    mode: ['（判断题）', '（单选题）', '（多选题）'],
    index: 0,
    quest: {},
    answers: [],
    feedbackUserRs: {},
    feedbackDans: {},
    feedbackRs: '',
    startTime: new Date(),
    score: 0,
    rightCount: 0,
    wrongCount: 0,
    last: false,
    iszan: false,
    next: false,
    dansGroup: ['', '', '', '', '', '']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let flid = options.flid
    this.getList(flid);
  },
  /**
   * 显示网络错误提示
   */
  showNetErr() {
    wx.showToast({
      title: '网络访问故障',
      image: '/resource/img/error.png',
      duration: 3000
    });
  },
  /**
   * 显示错误提示
   */
  showErr(content) {
    wx.showToast({
      title: content,
      image: '/resource/img/error.png',
      duration: 2000
    });
  },
  /**
   * 获取随机题目
   */
  getList: function (flid) {
    wx.showNavigationBarLoading()
    const token = wx.getStorageSync('token');
    wx.request({
      url: app.host + '/api/tk',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'x-auth-token': token
      }, // 设置请求的 header
      data: {
        tkflId: flid
      },
      success: (res) => {
        if (res.statusCode == '200') {
          this.setData({
            questions: res.data.data,
            index: 0
          })
          //渲染点赞状态
          let iszan = this.data.questions[0].SFDZ == 'Y' ? true : false;
          this.setData({
            iszan: iszan
          })
          //获取题目后先取第一题的选项
          let tkid = this.data.questions[0].ID_
          this.getAnswer(tkid);

        } else {
          this.showErr(res.data.error)
        }
      },
      fail: function () {
        this.showNetErr();
      },
      complete: function () {
        wx.hideNavigationBarLoading()
      }
    })
  },
  /**
   * 获取题目答案
   */
  getAnswer: function (tkid) {
    wx.showNavigationBarLoading()
    const token = wx.getStorageSync('token');
    wx.request({
      url: app.host + '/api/tkxzx',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'x-auth-token': token
      }, // 设置请求的 header
      data: {
        tkId: tkid
      },
      success: (res) => {
        if (res.statusCode == '200') {
          this.setData({
            answers: res.data.data,
            startTime: new Date()
          })

        } else {
          this.showErr(res.data.error)
        }
      },
      fail: function () {
        this.showNetErr();
      },
      complete: function () {
        wx.hideNavigationBarLoading()
      }
    })
  },
  /**
   * 提交答案
   */
  commitAnswer: function (e) {
    const token = wx.getStorageSync('token');
    let index = this.data.index;
    let mode = this.data.questions[index].MODE;
    let tkid = this.data.questions[index].ID_;
    let postdata = {
      startTime: this.data.startTime,
      endTime: new Date(),
      tkId: tkid,
    };
    if (mode == 0) {
      postdata.mode = "0";
      postdata.result = e.detail.value.yesno
    } else if (mode == 1) {
      postdata.mode = "1";
      postdata.result = e.detail.value.single
    } else if (mode == 2) {
      postdata.mode = "2";
      postdata.result = e.detail.value.multi.join(';')
    }
    wx.request({
      url: app.host + '/api/checkDtxx',
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'x-auth-token': token
      }, // 设置请求的 header
      data: postdata,
      success: (res) => {
        if (res.statusCode == '200' && res.data.code == '200') {
          let score = this.data.score;
          let wc = this.data.wrongCount;
          let rc = this.data.rightCount;
          let result = res.data.data.userRs.result;
          let dansGroup = this.data.dansGroup;
          let da
          if (result == 'Y') {
            score += res.data.data.userRs.resultScore;
            rc += 1
          } else {
            wc += 1
            let pointer = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 }
            let dans = res.data.data.dans;
            for (let prop in dans) {
              dansGroup[pointer[prop]] = 'dans-bg'
            }
          }
          this.setData({
            feedbackUserRs: res.data.data.userRs,
            feedbackDans: res.data.data.dans,
            feedbackRs: res.data.data.rs,
            score: score,
            wrongCount: wc,
            rightCount: rc,
            dansGroup: dansGroup
          })

        } else {
          this.showErr(res.data.error)
        }
      },
      fail: function () {
        this.showNetErr();
      },
      complete: () => {
        let last = false;
        if (index == this.data.questions.length - 1) {
          last = true
        }
        this.setData({
          last: last,
          next: true
        })
      }
    })
  },
  /**
   * 下一题
   */
  next: function () {
    if (!this.data.last) {
      let index = this.data.index + 1;
      let tkid = this.data.questions[index].ID_;
      let iszan = this.data.questions[index].SFDZ == 'Y' ? true : false;
      this.getAnswer(tkid);
      this.setData({
        index: index,
        next: false,
        iszan: iszan,
        feedbackUserRs: {},
        feedbackDans: {},
        feedbackRs: '',
        dansGroup: ['', '', '', '', '', ''],
      })
    } else {
      let options = {
        counts: this.data.questions.length,
        rightCount: this.data.rightCount,
        wrongCount: this.data.wrongCount,
        score: this.data.score
      }
      wx.redirectTo({
        url: '../dtxxjg/dtxxjg?counts='+options.counts+'&rightCount='+options.rightCount+'&wrongCount='+options.wrongCount+'&score='+options.score
      })
    }
  },
  /**
   * 点赞
   */
  bindZan() {
    const token = wx.getStorageSync('token');
    let index = this.data.index;
    let tkid = this.data.questions[index].ID_;
    let postdata = {
      zstkId: tkid,
      dzDate: new Date(),
      type: '1',
      remark: '赞'
    }
    wx.request({
      url: app.host + '/api/laudRecord',
      data: postdata,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'x-auth-token': token
      }, // 设置请求的 header
      success: (res) => {
        if (res.statusCode == '200' && res.data.code == '200') {
          this.setData({
            iszan: true
          })

        } else {
          this.showErr(res.data.error)
        }
      },
      fail: function () {
        this.showNetErr();
      },
      complete: function () {
        // complete
      }
    })
  },
  /**
   * 纠错
   */
  bindJiucuo() {
    let index = this.data.index;
    let tkid = this.data.questions[index].ID_;
    wx.navigateTo({
      url: '../jiucuo/jiucuo?tkid=' + tkid
    })
  },

})