var app = getApp();
Page({
    data:{
        token:'',
        examList:[],
        userRsList:[],
        selectItems: [],
        rs:"",
        answerStyle:[],
        buttonLoading:false,
        rightCount:0,
        worngCount:0,
        totalScore:0.00,
        totalTime:0,
        endExam:false
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
            //获取全部试题
            wx.request({
                url: app.host + '/api/examDetail?examId='+option.examId,
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                'content-type': 'application/json',
                'x-auth-token': res.data
                }, // 设置请求的 header
                success: reqRes => {
                    let currIndex=0;
                    let examList=reqRes.data.data.examDetail;
                    let userRsList=reqRes.data.data.userRs;
                    let currContext=examList[currIndex];
                    let score=0,tTime=0,errCount=0,rightCount=0;
                    for(var i=0;i<userRsList.length;i++){
                        let result = userRsList[i];
                        score +=result.resultScore;
                        tTime +=result.resultTime;
                        if('Y' == result.result){
                            rightCount+=1;
                        }else{
                            errCount+=1;
                        }
                    }
                    if(reqRes.data.code=="200"){
                        //获取答案选项
                        wx.request({
                            url: app.host + '/api/tkxzx?tkId='+currContext.ID_,
                            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                            header: {
                            'content-type': 'application/json',
                            'x-auth-token': res.data
                            }, // 设置请求的 header
                            success: reqResAnswer => {
                                if(reqResAnswer.data.code=="200"){
                                    that.setData({
                                        examList:examList,
                                        currIndex:currIndex,
                                        currContext:currContext,
                                        selectItems:reqResAnswer.data.data,
                                        startTime:new Date(),
                                        rightCount:rightCount,
                                        worngCount:errCount,
                                        totalScore:score.toFixed(2),
                                        totalTime:tTime,
                                        totalIss:examList.length+userRsList.length,
                                        finishIss:userRsList.length,
                                        num:userRsList.length+1
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
                                    //获取答案选项错误
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
                                //获取答案选项错误
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
                    }else{
                        //获取全部试题错误
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
                    //获取全部试题错误
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
            //获取token错误
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
    onUnload: function () {//返回触发事件
        console.log(this.data.finishIss,this.data.totalIss)
        if(this.data.finishIss!=this.data.totalIss){

            wx.showModal({
                    title: '重新进入考试可继续完成未完成考试',
                    showCancel: false,
                    confirmText: '确定',
                })


        }
    },
    backTo:function(){//返回按钮事件
       wx.navigateBack({delta: 1})
    },
    radioChange: function (e) {//单选事件
        var radioItems = this.data.selectItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].XZ_KEY == e.detail.value;
        }
        this.setData({
            selectItems: radioItems,
            rs:e.detail.value+""
        });
    },
    checkboxChange: function (e) {//多选事件
        var checkboxItems = this.data.selectItems, values = e.detail.value;
        let rs="";
        for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
            checkboxItems[i].checked = false;

            for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                if(checkboxItems[i].XZ_KEY == values[j]){
                    checkboxItems[i].checked = true;
                    if(rs.length>0){
                        rs +=';'
                    }
                    rs += values[j];
                    break;
                }
            }
        }
        this.setData({
            selectItems: checkboxItems,
            rs:rs
        });
    },
    putAnswer:function(event){
        //提交答案方法
        this.setData({buttonLoading:true,buttonDisable:true})
        let answers=event.detail.value.selectedAnswer;
        let that=this;
        if(answers.length>0){//判断是否选择答案
            let currContext=this.data.currContext;
            let rs = this.data.rs;
            let examItem ={//构造post参数
                tkId:currContext.ID_,
                result:rs,
                startTime:this.data.startTime,
                endTime:new Date(),
                mode:currContext.MODE,
                examDetailId:currContext.detailId
            };
            wx.request({
                //post答案
                url: app.host + '/api/checkExamItem',
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                data: examItem,
                header: {
                'content-type': 'application/json',
                'x-auth-token': this.data.token
                }, // 设置请求的 header
                success: reqResAnswer => {
                    let nowFinish=that.data.finishIss+1;  
                    if(reqResAnswer.data.code=="200"){
                        let answerStyle=[];
                        let selectItems=that.data.selectItems;
                        let rAnswers=reqResAnswer.data.data.dans;
                        for(let i=0;i<selectItems.length;i++){//反馈回答情况
                            answerStyle[i]=rAnswers.hasOwnProperty(selectItems[i].XZ_KEY)?'greenSel':(answers.includes(selectItems[i].XZ_KEY)?'redSel':'')
                        }
                        let param=reqResAnswer.data.data.userRs;
                        let vCount=param.result;
                        let tTime=that.data.totalTime+param.resultTime;
                        let tScore=(Number(that.data.totalScore) +param.resultScore).toFixed(2);
                        that.setData({
                                rsText:reqResAnswer.data.data.rs,
                                answerComparison:reqResAnswer.data.data.dans,
                                answerStyle:answerStyle,
                                finishIss:nowFinish,
                                totalScore:tScore,
                                rightCount:that.data.rightCount+ (vCount=="Y"?1:0),
                                worngCount:that.data.worngCount+ (vCount=="N"?1:0),
                                totalTime:tTime,
                            })
                            if(nowFinish==that.data.totalIss){//判断是否完成全部试题
                                setTimeout(function(){
                                    that.setData({
                                        endExam:true,
                                        rightPersent:(that.data.rightCount/that.data.totalIss*100).toFixed(2)
                                    })
                                },1000)
                            }else{
                                setTimeout(function(){
                                    that.completePOST();
                                },1000)
                            }
                    }else if(reqResAnswer.data.code=="400"){//无答案处理
                        if(nowFinish==that.data.totalIss){//判断是否完成全部试题
                                setTimeout(function(){
                                    that.setData({
                                        endExam:true,
                                        rightPersent:(that.data.rightCount/that.data.totalIss*100).toFixed(2)
                                    })
                                },1000)
                            }else{
                                setTimeout(function(){
                                    that.noAnswer(nowFinish);
                                },1000)
                            }
                    }else{
                        //post答案错误
                        wx.showModal({
                            title: '后台服务错误',
                            content: '已做题目将保存并退出考试',
                            showCancel: false,
                            confirmText: '退出考试',
                            success: res => {
                                if(res.confirm) {
                                   wx.navigateBack({delta: 1})
                                }
                            }
                        })
                    }
                
                },
                fail: e => {
                    //post答案错误
                    wx.showModal({
                        title: '网络访问故障',
                        content: '已做题目将保存并退出考试',
                        showCancel: false,
                        confirmText: '退出考试',
                        success: res => {
                            if(res.confirm) {
                                wx.navigateBack({delta: 1})
                            }
                        }
                    })
                },
            })
        }else{
            wx.showToast({
            title: '请选择答案',
            image: '/resource/img/error.png',
            duration: 1000
          });
          this.setData({
                buttonLoading:false,
                buttonDisable:false
          })
        }
    },
    completePOST:function(){
        //下一题操作
        let index=this.data.currIndex;
        let examList=this.data.examList;
        let that=this;
        wx.request({
            //获取答案选项
            url: app.host + '/api/tkxzx?tkId='+examList[index+1].ID_,
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
            'content-type': 'application/json',
            'x-auth-token': this.data.token
            }, // 设置请求的 header
            success: reqResAnswer => {
                if(reqResAnswer.data.code=="200"){
                    that.setData({
                        currIndex:index+1,
                        currContext:examList[index+1],
                        selectItems:reqResAnswer.data.data,
                        startTime:new Date(),
                        rs:"",
                        rsText:"",
                        answerStyle:[],
                        num:that.data.num+1,
                        buttonLoading:false,
                        buttonDisable:false
                    })
                }else{
                    //获取答案选项错误
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
                //获取答案选项错误
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
    noAnswer:function(nowFinish){
        //下一题操作
        let index=this.data.currIndex;
        let examList=this.data.examList;
        let that=this;
        wx.request({
            //获取答案选项
            url: app.host + '/api/tkxzx?tkId='+examList[index+1].ID_,
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
            'content-type': 'application/json',
            'x-auth-token': this.data.token
            }, // 设置请求的 header
            success: reqResAnswer => {
                if(reqResAnswer.data.code=="200"){
                    that.setData({
                        currIndex:index+1,
                        currContext:examList[index+1],
                        selectItems:reqResAnswer.data.data,
                        startTime:new Date(),
                        rs:"",
                        rsText:"",
                        answerStyle:[],
                        finishIss:nowFinish,
                        num:that.data.num+1,
                        buttonLoading:false,
                        buttonDisable:false
                    })
                }else{
                    //获取答案选项错误
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
                //获取答案选项错误
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
        
    }
})