// pages/index/index.js
const app = getApp()
const db = wx.cloud.database()


Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrls: [
            'https://gtms03.alicdn.com/tps/i3/TB1gXd1JXXXXXapXpXXvKyzTVXX-520-280.jpg',
            'https://gtms01.alicdn.com/tps/i1/TB1r4h8JXXXXXXoXXXXvKyzTVXX-520-280.jpg',
            'https://gtms02.alicdn.com/tps/i2/TB10vPXKpXXXXacXXXXvKyzTVXX-520-280.jpg'
        ],
        listData: [],
        current: 'links'

        
    },
    

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */

    //  请求数据库里面的数据用doc是_id, where()是_openid, 而field()是获取需要字段的数据
    onReady: function () {
        this.getListData();
        // this.getBannerList();
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
    handleLinks(ev){
        let id = ev.target.dataset.id;
        // db.collection('users').doc(id).update({
        //     data: {
        //         links: 5
        //     }
        // }).then((res)=>{
        //     console.log(res);
        // });
        // 调用写好的update云函数用wx.cloud.callFunction方法，用函数的调用写好，在云函数写好的基础上，我们需要用接口wx.cloud.callFunction去调用

        // 点赞功能实现
        wx.cloud.callFunction({
            name: 'update',
            data: {
                collection: 'users',
                doc: id,
                data: "{links: _.inc(1)}"

            }
        }).then((res)=> {
            // 这是需要做一个判断，判断是不是有更新，其次是克隆一个清单数据
            let updated = res.result.stats.updated;
            if(updated) {
                let cloneListData = [...this.data.listData];
                for( let i = 0; i < cloneListData.length; i++){
                    if(cloneListData[i]._id == id) {
                        cloneListData[i].links++;
                    }
                }
                this.setData({
                    listData: cloneListData
                })
            }
        })
    },
    // 首页的推荐和最新功能实现
    handleCurrent(ev) {
        // console.log(ev);
        let current = ev.target.dataset.current;
        // console.log(this.data.current );
        // 这里想不清楚，要及时的用console.log去校验，非常的有趣，这里的判断
        // 还是非常有必要的，然后再更新就比较安全了
        if(current == this.data.current ){  
            return false
        }
        
        this.setData({
            current
        }, () => {
            this.getListData();
        //   获取到用同样方法的time和links, 我不知道false返回的意义是什么，
        // 应该就是false后就跳转到其他最新上面的数据上了
        // 你回调了做好的getListData()方法，还是按照从times的大小来排序，
        // progress 越大越靠前，那就是时间越早越靠前的意思吗，
        // 小欣欣  Sep 02 2021 11:16:51
        // 小毕    Sep 02 2021 11:15:59
        // 龙龙    Sep 01 2021 15:01:46
        // 很明显是小欣欣的时间最大，OK，我明白了
        })
    },
    
    getListData() {
        db.collection('users')
        .orderBy(this.data.current,  "desc")
        .field({
            userPhoto: true,
            nickName: true,
            links: true
        })
        .get()
        .then((res)=>{
            
            this.setData({
                listData: res.data
            })
        })
    },
    // 详情页渲染数据和样式布局
    handleDetail(ev){
        let id = ev.target.dataset.id;
        wx.navigateTo({
            // 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 wx.navigateBack 可以返回到原页面。小程序中页面栈最多十层。
          url: '/pages/detail/detail?userId=' + id,
        })
    },
    // getBannerList(){
    //     db.collection('banner').get().then((res)=>{
    //         // console.log(res.data)
    //         this.setData({
    //             imgUrls: res.data
    //         }); 
    //     });
    // }
    
})