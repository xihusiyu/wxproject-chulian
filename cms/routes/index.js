const router = require('koa-router')()
const config = require('../config.js');
const request =require('request-promise')
const fs = require('fs')


router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})
router.post('/uploadBannerImg',
async (ctx, next) => {
  
  var files = ctx.request.files;
  var file = files.file;
  // console.log(files);
  try {
    let options = {
      uri: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.appid + '&secret=' + config.secret + '',
      json: true
    }

  // 第一个接口是获取token的一个凭证

    let {access_token} = await request(options)
    let fileName = `${Date.now()}.jpg`;
    let filePath = `banner/${fileName}`;
    // console.log( access_token );
    options = {
      method: 'POST',
      uri: 'https://api.weixin.qq.com/tcb/uploadfile?access_token=' + access_token +
      '',
      body: {
        "env": 'cloud1-9gum387z2c645309',
        "path": filePath,
      },
      json: true
    }
    // 以上是用这个凭证拿到具体的一个信息
    let res = await request(options);
    let file_id = res.file_id;

    options = {
      method: 'POST',
      uri: 'https://api.weixin.qq.com/tcb/databaseadd?access_token=' + access_token +
      '',
      body: {
        "env": 'cloud1-9gum387z2c645309',
        "query": "db.collection(\"banner\").add({data: {fileId:\""+ file_id + "\"}})"
      },
      json: true
    }

    await request(options)
    // 通过add方法实现数据库的插入记录方法


    options = {
      method: 'POST',
      uri: res.url,
      formData: {
        "Signature": res.authorization,
        "key": filePath,
        "x-cos-security-token": res.token,
        "x-cos-meta-field": res.cos_file_id,
        "file": {
          value: fs.createReadStream(file.path),
          options: {
            fileName: fileName,
            contentType: file.type
          }
        }
      }
    }
    await request(options);
    ctx.body = res;
    // 以上就可以把整个调用可以做好，通过具体的信息完成上传的任务


  } catch (err) {
    console.log(err.stack)
  }


})



module.exports = router
