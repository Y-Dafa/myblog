const Router = require('koa-router')
//拿到操作user、article、comment集合的逻辑对象
const user = require("../control/user")
const article = require("../control/article")
const comment = require("../control/comment")
const admin = require("../control/admin")
const upload = require("../util/upload")

//实例化Router
const router = new Router

//设计主页
router.get("/", user.keepLog, article.getList)

//用正则表达式匹配路由,主要用来处理用户登录 用户注册
router.get(/^\/user\/(?=reg|login)/, async (ctx) => {
    //show为true显示注册，false则显示登录
    const show = /reg$/.test(ctx.path)
    await ctx.render("register",{show}) //渲染到页面
})

//处理用户注册的post请求
router.post("/user/reg", user.reg)

//处理用户登录的post请求
router.post("/user/login", user.login)

//用户退出
router.get("/user/logout", user.logout)

//文章发表的页面
router.get("/article", user.keepLog, article.addPage)

//文章添加路由
router.post("/article", user.keepLog, article.add)

//文章分页路由,默认查找第一页
router.get("/page/:id", article.getList)

//文章详情页 路由
router.get("/article/:id", user.keepLog, article.details)

//发表评论 路由
router.post("/comment", user.keepLog, comment.addComment)

//admin后台页面 动态路由绑定（用户，文章，评论，头像）
router.get("/admin/:id", user.keepLog, admin.index)

//头像上传
router.post("/upload", user.keepLog, upload.single('file'), user.upload)

//获取后台用户所有评论
router.get("/user/comments", user.keepLog, comment.commentList)

//后台 删除用户评论
router.del("/comment/:id", user.keepLog, comment.del)

//获取后台用户所有文章
router.get("/user/articles", user.keepLog, article.artList)
//后台 删除用户文章
router.del("/article/:id", user.keepLog, article.del)

//当以上路由为正确获取是跳转到404页面
router.get("*",async ctx => {
    await ctx.render("404", {
        title:"404",
    })
})

module.exports = router

/*
    动态路由:id处理登录，注册，退出 文章分页
    router.get("/user/:id", async(ctx) => {
        // ctx.params = { //params为一个对象，里面的属性为动态id
        //     id:"/login"
        // }
        ctx.body=ctx.params.id
    })

    对用户的动作： /user
    登录    /user/login
    注册    /user/reg
    退出    /user/logout

    超级管理员对用户的操作：
    新增用户 POST > /user --->新增用户信息
    删除用户 DELETE > /user ---->带上需要删除的用户的id
    修改用户 PUT
    查询用户 GET
*/