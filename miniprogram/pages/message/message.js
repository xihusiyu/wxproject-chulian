// pages/message/message.js

const app = getApp()
const db = wx.cloud.database()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userMessage: [],
        logged: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
            // console.log(1);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        // console.log(2);
    },
            // 记录： tab页面不会重复触发onReady， 普通页面会重复触发onReady
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // console.log(3);
        if(app.userInfo._id){
            this.setData({
                logged: true,
                userMessage: app.userMessage
            })
        }
        else{
            wx.showToast({
              title: '请先登录',
              duration: 2000,
              icon: 'none',
              success: () => {
                  setTimeout(() =>{
                      wx.switchTab({
                        url: '/pages/user/user',
                      }, 2000);
                  })
              }
            })
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        // console.log(4);
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        // console.log(5);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        // console.log(6);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        // console.log(7);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        // console.log(8);
    },
    onMyEvent(ev) {
        this.setData({
            userMessage: []
            // 由于   lifetimes: attach: function(){}那个 生命周期不会在删除一个元素不会触发，所以并没有更新
              // 在组件实例进入页面节点树时执行  就是上面的attach
            // 所以usermessage不会再次做组件的渲染。就是那个removeList组件
            // 上面就是方法置空

        },  () => {
            this.setData({
                userMessage: ev.detail
            })
        })
    
    //    子父组件更新就是先父亲监听，然后儿子触发，再就是要在父亲这里更新这个对象
    }
})