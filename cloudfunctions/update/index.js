// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    // const wxContext = cloud.getWXContext()

    // return {
    //     event,
    //     openid: wxContext.OPENID,
    //     appid: wxContext.APPID,
    //     unionid: wxContext.UNIONID,
    // }

    try {
      // 将字符串解析成JSon语句的方法就是用eval()
      if( typeof event.data == 'string' ){
        event.data  =  eval('('+event.data+')');
            // 以上方法就是在服务器端将字符串解析成Json语句的具体做法,
            // 然后将解析的结果进行重新的赋值，然后就可以拿到inc这个方法，
            // 这个方法主要的作用就是更新操作符，原子操作，用于指示字段自增
      }


      if(event.doc){
        return await db.collection(event.collection)
        .doc(event.doc)
        // 获取集合中指定记录的引用。方法接受一个 id 参数，指定需引用的记录的 _id。 doc
        .update({
            data: {
            ...event.data
          }
        })
      }
      else{
        return await db.collection(event.collection)
        .where({...event.where})
        // 指定查询条件，返回带新查询条件的新的集合引用  where
        .update({
            data: {
            ...event.data
          }
        })
      }
      
      } catch(e) {
        console.error(e)
      }
       
}