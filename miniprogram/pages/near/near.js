// pages/near/near.js

const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // userInfo: {},
        // hasUserInfo: false,
        // canIUseGetUserProfile: false,
        longitude: '',
        latitude: '',
        markers: []
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // if (wx.getUserProfile) {
        //     this.setData({
        //       canIUseGetUserProfile: true
        //     })
        //   }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
            this.getLocation();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getLocation();
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
    getLocation() {
        wx.getLocation({
            type: 'gcj02',
            success: (res) => {
              const latitude = res.latitude
              const longitude = res.longitude
            //   这里有一个this指向的问题，这里的success是回调的
                this.setData({
                    longitude,
                    latitude,
                })
                this.getNearUsers();
            }
           })
    },
    getNearUsers() {
        db.collection('users').where({
            location: _.geoNear({
              geometry: db.Geo.Point(this.data.longitude, this.data.latitude),
              minDistance: 0,
              maxDistance: 50000,
            }),
            isLocation: true
          }).field({
              longitude: true,
              latitude: true,
              userPhoto: true
          }).get().then((res)=> {
                    // console.log(res.data)这里就是那些在地图上显示的人
                    let data = res.data;
                    let result  = [];
                    if(data.length) {
                        for( let i=0; i< data.length; i++){
                            if(data[i].userPhoto.includes('cloud://')){
                                wx.cloud.getTempFileURL({
                                    fileList: [ data[i].userPhoto],
                                    success: res => {
                                        result.push({
                                            iconPath: res.fileList[0].tempFileURL,
                                            id: data[i]._id,
                                            latitude: data[i].latitude,
                                            longitude: data[i].longitude,
                                            width: 30,
                                            height: 30
                                        })
                                        // 以上代码块是异步操作，可以联系下面代码一起实现，
                                        // 也可以用promise和settimeout实现异步操作
                                        this.setData({
                                            markers: result
                                        })

                                     
                                    }
                                  })
                                 
                            }
                            else{
                                result.push({
                                    iconPath: data[i].userPhoto,
                                    id: data[i]._id,
                                    latitude: data[i].latitude,
                                    longitude: data[i].longitude,
                                    width: 30,
                                    height: 30
                                })
                            }
                            
                        }
                       
                    }

          })
    },
    markertap(ev){
        wx.navigateTo({
            url: '/pages/detail/detail?userId=' + ev.markerId
        })
    }

    

    // getUserProfile(e) {
    //     // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    //     // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    //     wx.getUserProfile({
    //       desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    //       success: (res) => {
    //         this.setData({
    //           userInfo: res.userInfo,
    //           hasUserInfo: true
    //         })
    //       }
    //     })
    //   },
    //   getUserInfo(e) {
    //     // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    //     this.setData({
    //       userInfo: e.detail.userInfo,
    //       hasUserInfo: true
    //     })
    //   },
    

   
    
})