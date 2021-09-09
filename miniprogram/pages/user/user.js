// pages/user/user.js
const app = getApp()
const db = wx.cloud.database()

Page({

    /**
     * 页面的初始数据
     * 
     */
    data: {
        userPhoto : '/images/user/user-unlogin.jpg',
        nickName: " ",
        userInfo: {},
        hasUserInfo: false,
        canIUseGetUserProfile: false,
        disabled: true,
        id: ''
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

        this.getLocation();

        wx.cloud.callFunction({
            name: 'login',
            data: {}
        }).then((res) => {
           
            db.collection("users").where({
                _openid: res.result.OPENID,    
            }).get().then((res) => {
                if(res.data.length){
                    app.userInfo = Object.assign(   app.userInfo , res.data[0]);
                this.setData({
                    userPhoto:  app.userInfo.userPhoto,
                    nickName:  app.userInfo.nickName,
                    hasUserInfo:  true,
                    id: app.userInfo._id
                })
                this.getMessage();
                }
                else{
                    this.setData({
                        disabled: false
                    })
                }
                
            })
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            userPhoto: app.userInfo.userPhoto,
            nickName: app.userInfo.nickName,
            id: app.userInfo._id
        });
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
                            time: new Date(),
                            isLocation: true,
                            longitude: this.longitude,
                            latitude:  this.latitude,
                            friendList: [],
                            location: db.Geo.Point(this.longitude, this.latitude)
                            // 如存储地理位置信息的字段有被查询的需求，务必对字段建立地理位置索引
                        }
                    }).then((res) => {
                      
                        db.collection("users").doc(res._id).get().then((res) => {
                            app.userInfo = Object.assign(app.userInfo, res.data);
                            // console.log(res.data)
                            this.setData({
                                userPhoto: app.userInfo.userPhoto,
                                nickName: app.userInfo.nickName,
                                country:  app.userInfo.country,
                                hasUserInfo: true,
                                id: app.userInfo._id
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
    // 添加好友功能之监听message信息
    getMessage() {
        db.collection('message').where({
            userId: app.userInfo._id
        }).watch({
            onChange: function (snapshot) {
                 if(  snapshot.docChanges.length ) {
                        let list = snapshot.docChanges[0].doc.list;
                        if ( list.length) {
                            wx.showTabBarRedDot({
                              index: 2
                            })
                            app.userMessage = list;
                        }
                        else {
                            wx.hideTabBarRedDot({
                              index: 2,
                            })
                            app.userMessage = [];
                        }
                 }
            },
            onError: function(err) {
                console.error('the watch closed because of error', err)
              }
        })
    },
    getLocation() {
        wx.getLocation({
            type: 'gcj02',
            success: (res) => {
              this.latitude = res.latitude
              this.longitude = res.longitude
            //   这里的经纬度不需要渲染，只是在获取经纬度的数据，就不要再次的更新页面
            //   这里有一个this指向的问题，这里的success是回调的
                
            }
           })
    }
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