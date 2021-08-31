// pages/user/user.js
const app = getApp()
const db = wx.cloud.database()

Page({

    /**
     * 页面的初始数据
     * 
     */
    data: {
        userPhoto: '/images/user/user-unlogin.jpg',
        nickName: " ",
        userInfo: {},
        hasUserInfo: false,
        canIUseGetUserProfile: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
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
    getUserProfile(e) {

        wx.getUserProfile({
            desc: '用ev于完善会员的资料',
            success: (res) => {
                // console.log(res)
                let userInfo = res.userInfo;
                if (!this.data.hasUserInfo && userInfo) {
                    db.collection('users').add({
                        data: {
                            userPhoto: userInfo.avatarUrl,
                            nickName: userInfo.nickName,
                            signature: '',
                            phoneNumber: '',
                            weixinNumber: '',
                            city: userInfo.city,
                            country: userInfo.country,
                            gender: userInfo.gender,
                            language: userInfo.language,
                            province: userInfo.province,
                            links: 0,
                            time: new Date()
                        }
                    }).then((res) => {
                        
                        db.collection("users").doc(res._id).get().then((res) => {
                            app.userInfo = Object.assign(app.userInfo, res.data);
                            console.log(res.data)
                            this.setData({
                                userPhoto: app.userInfo.userPhoto,
                                nickName: app.userInfo.nickName,
                                country:  app.userInfo.country,
                                hasUserInfo: true
                            })
                        })
                    })
                }
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        })
    },
    // getUserInfo(e) {
    //     this.setData({
    //         userInfo: e.detail.userInfo,
    //         hasUserInfo: true
    //     })
    // },



    // bindGetUser(ev) {
    //     console.log(ev);
    //     let userInfo = ev.detail.userInfo;
    //         if(!this.data.logged && userInfo){
    //             db.collection('users').add({
    //                 data: {
    //                     userPhoto: userInfo.avatarUrl,
    //                     nickName:  userInfo.nickName,
    //                     signature: '',
    //                     phoneNumber: '',
    //                     weixinNumber: '',
    //                     links: 0,
    //                     time: new Date()
    //                 }
    //             }).then((res) => {
    //                 // console.log(res)
    //                 db.collection('users').doc(res._id).get().then((res) =>{
    //                     app.userInfo = Object.assign(app.userInfo, res.data);
    //                     // 小程序是仿照React,用this.setData更新页面
    //                     this.setData({
    //                         userPhoto: app.userInfo.userPhoto,
    //                         nickName: app.userInfo.nickName,
    //                         logged: true
    //                     })
    //                 })
    //             })
    //         }
    // }
})