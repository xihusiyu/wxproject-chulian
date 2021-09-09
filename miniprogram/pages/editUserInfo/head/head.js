// pages/editUserInfo/head/head.js

const app = getApp()
const db = wx.cloud.database()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userPhoto: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        if (wx.getUserProfile) {
            this.setData({
              canIUseGetUserProfile: true,
              userPhoto: app.userInfo.avatarUrl
            })
          }
        },
    

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    handleUploadImage() {
        wx.chooseImage({
            count: 1,
            sizeType: [ 'compressed' ],
            sourceType: ['album', 'camera'],
          
          }).then((res) => {
            // success (res) {
            //     // tempFilePath可以作为img标签的src属性显示图片
            //     const tempFilePaths = res.tempFilePaths
            //   }
            const tempFilePaths = res.tempFilePaths[0]
            this.setData({
                userPhoto: tempFilePaths
            })
          
          })
    },
    handleBtn() {
        wx.showLoading({
            title: '上传中'
        })
        let cloudPath = "userPhoto/" + app.userInfo._openid + Date.now() + ".jpg"
        wx.cloud.uploadFile({
            cloudPath,
            filePath: this.data.userPhoto, // 文件路径
            // success是支持promise方法
           
          }).then((res)=>{
              
            //   console.log(res);
            let fileID = res.fileID;
            if(fileID){
                db.collection('users').doc(app.userInfo._id).update({
                    data: {
                        userPhoto: fileID
                    }
                }).then((res)=>{
                    wx.hideLoading();
                    wx.showToast({
                      title: '上传并更新成功',
                    });
                    app.userInfo.userPhoto = fileID;
                  });
            }
          })
    },
    getUserProfile(ev) {
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              let userInfo = res.userInfo;
              this.setData({
                userPhoto: userInfo.avatarUrl,
                hasUserInfo: true
              //   二次函数，实现回调函数
              }, ()=>{
                //   this.updateUserPhoto();
                wx.showLoading({
                    title: '上传中'
                })
                db.collection('users').doc(app.userInfo._id).update({
                    data: {
                        userPhoto: userInfo.avatarUrl
                    }
                }).then((res)=>{
                    wx.hideLoading();
                    wx.showToast({
                      title: '上传并更新成功',
                    });
                    app.userInfo.userPhoto = userInfo.avatarUrl;
                  });

              },
              )
            }
          })
    }
})
// ETag是HTTP协议提供的一些实例中的一种Web检测验证，并且允许客户端进行视图协商。这看起来更高效，而且节省了时间。资源的内容如果没有发生更改，Web服务器不会需要发送一个完整的响应。ETag的也可用于乐观并发控制，作为一种防止资源同步更新而相互覆盖的方法。