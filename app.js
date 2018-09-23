const Koa=require("koa")
const static=require("koa-static")
const views=require("koa-views")
const router=require("./routers/router")
const logger=require("koa-logger")
const body=require("koa-body")
const {join}=require("path")
const session=require("koa-session")
const compress=require("koa-compress")

//生成koa实例
const app=new Koa

app.keys=["签名的密钥"]

//session的配置对象
const CONFIG={
    key:"Sid",
    maxAge:36e5,
    overwrite:true,
    httpOnly:true,
    // signed:true,默认为true可省
    rolling:true,
}

//注册日志模块,必须写前面
app.use(logger())

//注册资源压缩模块compress
app.use(compress({
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}))

//注册session
app.use(session(CONFIG,app))

//注册koa-body处理post请求数据
app.use(body())

//配置静态资源目录
app.use(static(join(__dirname,"public")))

//配置视图模板
app.use(views(join(__dirname,"views"),{
    extension:"pug"
}))

//注册路由信息
app.use(router.routes()).use(router.allowedMethods())

//端口监听
app.listen(3001,() => {
    console.log("项目启动成功，监听在3001端口")
})

//创建管理员用户 如果管理员用户已存在则返回
{
    const {db} = require("./Schema/config")
    const UserSchema = require("./Schema/user")
    const User = db.model("users",UserSchema)
    const encrypt = require("./util/encrypt")
   
    User
        .find({username:"admin"})
        .then(data => {
            if(data.length === 0){
                //管理员不存在需创建
                new User({
                    username: "admin",
                    password:encrypt("admin"),
                    role:1996,
                    articleNum:0,
                    commentNum:0,
                })
                .save()
                .then(data => {
                    console.log("管理员用户名->admin，密码->admin")
                })
                .catch(err => {
                    console.log("管理员账号检查失败")
                })
            }else{
                //管理员存在
                console.log("管理员用户名->admin，密码->admin")
            }
        })
}