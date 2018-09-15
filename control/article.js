const {db} = require("../Schema/config")
const ArticleSchema = require("../Schema/article")
//获取用户的Schema为了拿到操作users集合的实例对象
const UserSchema = require("../Schema/user")
const User = db.model("users",UserSchema)

//通过db对象创建操作article数据库的模型对象
const Article = db.model("articles",ArticleSchema)

//返回文章发表页
exports.addPage = async (ctx) => {
    await ctx.render("add-article",{
        title:"文章发表页",
        session:ctx.session,
    })
}

//文章的发表，保存到数据库
exports.add = async ctx => {
    if(ctx.session.isNew){
        //true 没登录 就不用查询数据库
        return ctx.body = {
            msg:"用户未登录",
            status:0
        }
    }
    //用户已登录：接收post发过来的数据
    const data = ctx.request.body
    //添加文章作者
    data.author = ctx.session.uid

    await new Promise((resolve,reject) => {
        new Article(data).save((err,data) => {
            if(err) return(err)
            resolve(data)
        })
    })
    .then(data => {
        ctx.body={
            msg:"发表成功",
            status: 1
        }
    })
    .catch(err => {
        ctx.body = {
            msg:"发表失败",
            status:0
        }
    })
}

//获取文章列表
exports.getList = async ctx => {
    //查询每篇文章对应作者的头像
    await ctx.render("index",{
        session:ctx.session,
        title:"博客首页",
    })
}