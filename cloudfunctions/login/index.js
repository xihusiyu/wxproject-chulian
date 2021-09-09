// 云函数
// 部署: 在 cloud-function/login 文件夹右击选择 "上传部署"

const cloud = require('wx-server-sdk')

// 初始化 cloud   dynamic current
cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: "cloud1-9gum387z2c645309"
})

// 这个示例将经自动鉴权过的小程序用户  openid 返回给小程序端
//    event 参数包含小程序端调用传入的 data 

exports.main  = async (event, context) => {
    console.log(event)
    console.log(context)
   let {OPENID, APPID, UNIONID, ENV} = await cloud.getWXContext()

    // 可执行其他自定义逻辑
    // console.log 的内容可以在云开发云函数调用日志查看
    // 获取 WX Context (微信调用上下文), 包括 OPENID、APPID、 
    // 及UNIONID(需满足 UNIONID 获取条件)等信息

    // const dbResult = await cloud.database().collection("text").get()

    return {
        // dbResult,
        // event,
        // openid: wxContext.OPENID,
        // appid: wxContext.APPID,
        // unionid: wxContext.UNIONID,
        // env: wxContext.ENV
        event,
        OPENID,
        APPID,
        UNIONID,
        ENV,
     
    }
}
