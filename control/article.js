const {db} = require("../Schema/config")

//通过db对象创建操作article数据库的模型对象
const ArticleSchema = require("../Schema/article")
const Article = db.model("articles",ArticleSchema)

//获取用户的Schema为了拿到操作users集合的实例对象
const UserSchema = require("../Schema/user")
const User = db.model("users",UserSchema)

const CommentSchema = require("../Schema/comment")
const Comment = db.model("comments", CommentSchema)

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
    data.commentNum = 0 //设置评论计数器初值为0

    await new Promise((resolve,reject) => {
        new Article(data).save((err,data) => {
            if(err) return(err)
            //更新用户文章计数
            User.update({_id:data.author},{$inc:{articleNum:1}},err => {
                if(err) return console.log(err)
            })
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
    // 查询每篇文章对应作者的头像
    // 获取动态id ctx.params.id
    let page = ctx.params.id || 1
    page--

    //获取当前数据库中文档的最大数量
    const maxNum = await Article.estimatedDocumentCount((err,num) => err ? console.log(err) : num)

     //查询文章数据库
    const artList = await Article
        .find()
        .sort("-created")    //根据文章发表时间倒序排序
        .skip(3*page)      //每次跳过5条翻页
        .limit(3)          //筛选每一页显示5条
        .populate({        // mongoose用于连表查询
            path:"author", //通过关联属性指定关联表
            select:"_id username avatar" //选择关联表下所需属性
        })
        .then(data => data)
        .catch(err => console.log(err))

    await ctx.render("index", {
        session:ctx.session,
        title:"博客首页",
        artList,
        maxNum
    })
}

//文章详情
exports.details = async ctx => {
    console.log(1)
    //获取动态路由里的id
    const _id=ctx.params.id

    const article = await Article
        .findById(_id)
        .populate("author","username")
        .then(data => data)
    
    //查找与当前文章关联的所有评论
    const comment = await Comment
        .find({article:_id})
        .sort("-created")
        .populate("reviewer", "username avatar")
        .then(data => data)
        .catch(err => {console.log(err)})

    await ctx.render("article",{
        title:article.title,
        article,
        comment,
        session:ctx.session
    })

}