var app = getApp();
Page({
    data: {
        files: null,
        disableUserInfo:false,
        loadingUserInfo:false
    },
    onLoad:function(option){
        let urlHost=app.host+"/images";
        this.setData({
            oldValue:option,
            name:option.name,
            phone:option.phone,
            photo:option.photo,
            photo:option.photo!=null&&option.photo!=""&&option.photo!="null"?urlHost+option.photo+"?date="+new Date():"../../resource/img/avatar.png",
            birthday:option.birthday=="null"?'':this.formatDate(option.birthday),
            rzday:option.rzday=="null"?'':this.formatDate(option.rzday),
            userId:option.userId,
            endTime:new Date()
        })
    },
    chooseImage: function (e) {//上传照片
        var that = this;
        wx.chooseImage({
            count:1,//最多可以选择的图片张数，默认9
            sizeType: [ 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    files: res.tempFilePaths[0]
                });
            }
        })
    },
    previewImage: function(e){//点击照片放大
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: [this.data.files!=null?this.data.files:this.data.photo] // 需要预览的图片http链接列表
        })
    },
    bindBirthdayChange: function (e) {
        this.setData({
            birthday: e.detail.value
        })
    },
    bindRzdayChange: function (e) {
        this.setData({
            rzday: e.detail.value
        })
    },
    putUserInfo:function(value){
        this.setData({
            disableUserInfo:true,
            loadingUserInfo:true,
        })
        let newValue=value.detail.value,oldValue=this.data.oldValue;
        if(newValue.name==""||newValue.phone==""||newValue.birthday==""||newValue.rzday==""){
            //判断姓名手机是否为空
            wx.showToast({
                title: '以上信息均必须填写',
                image: '/resource/img/error.png',
                duration: 3000
            });
            this.setData({
                disableUserInfo:false,
                loadingUserInfo:false,
            })
        }else if(newValue.name==oldValue.name&&newValue.phone==oldValue.phone&&newValue.birthday==this.formatDate(oldValue.birthday)&&newValue.rzday==this.formatDate(oldValue.rzday)&&this.data.files==null){
            wx.showToast({
                title: '没有数据修改',
                image: '/resource/img/error.png',
                duration: 2000
            });
            this.setData({
                disableUserInfo:false,
                loadingUserInfo:false,
            })
        }else{
            const token = wx.getStorageSync('token');
            newValue.userId=this.data.userId//添加userID
            let that=this;
            wx.request({
                url: app.host + '/api/updateUser',
                data: newValue,
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                'content-type': 'application/json',
                'x-auth-token': token
                }, // 设置请求的 header
                success: res => {
                    if(res.statusCode == 200&&res.data.code=="200"){
                        
                        that.setData({
                            oldValue:newValue,//更新旧数据
                        })
                        if(that.data.files==null){//没有照片上传则停止等待
                            wx.showToast({
                                title: '修改成功',
                                icon: 'success',
                                mask:true,
                                duration: 2000
                            })
                            that.setData({
                                disableUserInfo:false,
                                loadingUserInfo:false,
                            })

                        }
                    }else{
                        wx.showToast({
                        title: '修改失败',
                        image: '/resource/img/error.png',
                        duration: 2000
                        });
                    }
                },
                fail: e => {
                    wx.showToast({
                        title: '网络访问故障',
                        image: '/resource/img/error.png',
                        duration: 3000
                    });
                }
            })
            if(that.data.files!=null){//判断是否上传照片
                   // 缩放上传图片
                that.drawCanvas();
            }

        }
    },
    backTo:function(){
        wx.reLaunch({
              url: '../user_userMain/user_userMain'
            })
    },
    formatDate:function(date){
        let newDate=new Date(date);
        return newDate.getFullYear()+"-"+(newDate.getMonth()+1)+"-"+newDate.getDate()
    },
  
    drawCanvas:function(){  // 缩放图片
        const ctx = wx.createCanvasContext('attendCanvasId');
        let that=this;
        wx.getImageInfo({
            src: that.data.files,
            success: function (res) {
                if(res.width>300||res.height>300){//判断图片是否超过500像素
                    let scale=res.width/res.height//获取原图比例
                    that.setData({//构造画板宽高
                        canWidth:200,
                        canHeight:200/scale
                    })
                    //画出压缩图片
                    ctx.drawImage(that.data.files, 0, 0, that.data.canWidth, that.data.canHeight);
                    ctx.draw();
                    //等待压缩图片生成
                    var st = setTimeout(function(){
                                that.prodImageOpt();
                                clearTimeout(st);
                            },3000);
                }else{
                    that.uploadFileOpt(that.data.files);
                }
            }
        })
    },              
    
    prodImageOpt:function(){// 获取压缩图片路径
        var that = this;
        wx.canvasToTempFilePath({ 
            canvasId: 'attendCanvasId',
            success: function success(res) {
                // 上传图片
                that.uploadFileOpt(res.tempFilePath);
            },
        });
    },
    
    uploadFileOpt:function(path){//上传图片
        let that=this;
        const token = wx.getStorageSync('token');
        wx.uploadFile({
            url: app.host + '/api/upload', 
            filePath: path,
            name: 'file',
            header: {
                'x-auth-token': token
            }, 
            success: function(res){
                // console.log(res);//因uploadFile无法在network中捕获故需打印返回内容
                if(res.statusCode==200){
                    wx.showToast({
                            title: '修改成功',
                            icon: 'success',
                            mask:true,
                            duration: 2000
                        })
                    that.setData({
                        files:null,//重置照片
                        photo:that.data.photo+"&date="+new Date(),//重新访问照片
                        disableUserInfo:false,
                        loadingUserInfo:false,
                    })
                }else{
                    wx.showToast({
                        title: '照片上传失败，错误代码：'+res.statusCode,
                        image: '/resource/img/error.png',
                        duration: 3000
                    });
                    that.setData({
                        files:null,//重置照片
                        photo:that.data.photo+"&date="+new Date(),//重新访问照片
                        disableUserInfo:false,
                        loadingUserInfo:false,
                    })
                }
            },
            fail:e=>{
                wx.showToast({
                    title: '照片上传失败',
                    image: '/resource/img/error.png',
                    duration: 3000
                });
            }
        })
    },
    onImageError(e){
        this.setData({PHOTO:'../../resource/img/avatar.png'})
    }
});