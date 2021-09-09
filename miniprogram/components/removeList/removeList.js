// components/removeList/removeList.js

const app = getApp()
const db  = wx.cloud.database()
// 增加运算的操作, 有了运算的能力
const _ = db.command

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        messageId : String,
        userMessage: {}
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleDelMessage(){
            wx.showModal({
                title: '提示信息',
                content: '删除消息',
                confirmText:  '删除',
                success: (res) => {
                    if(res.confirm){

                        this.removeMessage();
                        //  db.collection('message').where({
                        //      userId: app.userInfo._id
                        //  }).get().then((res) =>{
                        //      let list =  res.data[0].list;
                        //     //  console.log(list);
                        //      list = list.filter((val, i) =>{
                        //          return val != this.data.messageId
                        //      })
                        //     //  console.log(list);
                        //     // 过滤后就需要更新了，更新的时候就需要调用update云函数 wx.cloud.callFunction
                        //     wx.cloud.callFunction({
                        //         name: 'update',
                        //         data: {
                        //             collection: 'message',
                        //             where: {
                        //                 userId: app.userInfo._id
                        //             },
                        //             data: {
                        //                 list
                        //             }
                        //         }
                        //     }).then((res)=>{
                        //         this.triggerEvent('myevent', list)
                        //     })
                        //  })
                    }
                }
                
            })
        },
        handleAddFriend(){
            wx.showModal({
                title: '提示信息',
                content: '申请好友',
                confirmText:  '同意',
                success: (res) => {
                   if(res.confirm){
                       db.collection('users').doc(app.userInfo._id).update({
                           data: {
                            friendList: _.unshift(this.data.messageId)
                           }
                       }).then((res)=> {})
                    //    上面是更新的是自己的

                    //    以下是服务端的操作，在传统的客户端可以用app.userInfo._id和this.data.messageId颠倒的方式做，
                    //    但是在小程序端是不可以的，不可以在其他账号里去操作，只可以在服务器端进行更新操作
                    //    这是更新其他人的
                    wx.cloud.callFunction({
                        name: 'update',
                        data: {
                            collection: 'users',
                            doc: this.data.messageId,
                            data: `{
                                friendList: _.unshift('${app.userInfo._id}')
                            }`
                        }
                        
                    }).then((res)=>{});
                    this.removeMessage();
                      
                   } else if (res.cancel){
                        console.log('用户点击取消')
                   }
                }
                
            })
        },
        removeMessage(){
            db.collection('message').where({
                userId: app.userInfo._id
            }).get().then((res) =>{
                let list =  res.data[0].list;
               //  console.log(list);
                list = list.filter((val, i) =>{
                    return val != this.data.messageId
                })
               //  console.log(list);
               // 过滤后就需要更新了，更新的时候就需要调用update云函数 wx.cloud.callFunction
               wx.cloud.callFunction({
                   name: 'update',
                   data: {
                       collection: 'message',
                       where: {
                           userId: app.userInfo._id
                       },
                       data: {
                           list
                       }
                   }
               }).then((res)=>{
                   this.triggerEvent('myevent', list)
               })
            })
        }
    },
    lifetimes: {
        attached: function() {
          // 在组件实例进入页面节点树时执行   原来这是组件初始的渲染，当usermessage被置空就会再次执行，在删除一个元素后，列表清空，重新渲染
                db.collection('users').doc(this.data.messageId).field({
                    userPhoto: true,
                    nickName: true
                }).get().then((res) =>{
                    this.setData({
                      userMessage:  res.data
                    })
                })
        },
        // 上面是在list为空的时候可以更新
        // detached: function() {
        //   // 在组件实例被从页面节点树移除时执行
        // },
      },
})
