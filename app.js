const Koa=require("koa")
const static=require("koa-static")
const views=require("koa-views")
const router=require("./routers/router")
const logger=require("koa-logger")
const body=require("koa-body")
const {join}=require("path")
const session=require("koa-session")
const conpress=require("koa-compress")

//生成koa实例
const app=new Koa

//session的配置对象

//注册日志模块
app.use(logger())

//注册资源压缩模块compress

//注册session

//注册koa-body处理post请求数据

//配置静态资源目录
app.use(static(join(__dirname,"public")))

//配置视图模板
app.use(views(join(__dirname,"views"),{
    extension:"pug"
}))

//注册路由信息
app.use(router.routes()).use(router.allowedMethods())

//端口监听
app.listen(3001,()=>{
    console.log("项目启动成功，监听在3001端口")
})

//创建管理员用户 如果管理员用户已存在则返回