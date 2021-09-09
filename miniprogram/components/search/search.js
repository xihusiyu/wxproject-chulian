// components/search/search.js

const app = getApp()
const db = wx.cloud.database()

Component({
    /**
     * 组件的属性列表
     */

    options: {
        styleIsolation: 'apply-shared'
      },
      
    properties: {
        
    },

    /**
     * 组件的初始数据
     */
    data: {
        isFocus:  false,
        historyList: [],
        searchList: []
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleFocus(){

          wx.getStorage({
            key: "searchHistory",
            success: (res) => {
                this.setData({
                  historyList: res.data
                })
            }
          })

           this.setData({
            isFocus: true,
            
           })
        },
        handleCancel() {
          this.setData({
            isFocus: false
           })
        },
        handleConfirm(ev){
          let value = ev.detail.value;
            // console.log( ev.detail.value);
            // 去除数组的重复成员[...new Set(array)]  这是方法是ES6 set方法  去重
            let cloneHistoryList = [...this.data.historyList];
            cloneHistoryList.unshift(value);
            wx.setStorage({
              key:"searchHistory",
              data: [...new Set(cloneHistoryList)]
            })
            this.changeSearchList(value);
        },
        handleHistoryDelete() {
          wx.removeStorage({
            key: 'searchHistory',
            success: (res)=> {
                this.setData({
                  historyList: []
                })
            }
          })
        },
        changeSearchList(value){
          // 以下是正则方法可以模糊搜索，构造正则表达式，仅需在普通 js 正则表达式无法满足的情况下使用， 实现模糊匹配
            db.collection('users').where({
              nickName: db.RegExp({
                regexp: value,
                options: 'i',
              })
            }).field({
              userPhoto: true,
              nickName: true
            }).get().then((res)=> {
              // console.log(res);
                this.setData({
                  searchList: res.data
                })
            })
        },
        handleHistoryItemDel(ev) {
            // console.log(ev)
            // 当在控制台没有看到想要的属性的时候，学会使用自定义属性方
            let value = ev.target.dataset.text;
            this.changeSearchList(value);

        }

    },
   
})
