const { db } = require("../Schema/config")

const ArticleSchema = require("../Schema/article")
const Article = db.model("articles", ArticleSchema)

const UserSchema = require("../Schema/user")
const User = db.model("users", UserSchema)

const CommentSchema = require("../Schema/comment")
const Comment = db.model("comments", CommentSchema)

//扩展当前登录评论者的id
//保存评论
exports.addComment = async ctx => {
    let message = {
        atatus: 0,
        msg:"登录才能发表"
    }
    //验证用户是否登录
    if(ctx.session.isNew)return ctx.body = message

    //用户登录了,先获取post传过来的数据再扩展添加当前登录的评论者的id
    const data = ctx.request.body
    data.reviewer = ctx.session.uid

    const _comment = new Comment(data)

    await _comment
        .save()
        .then(data => {
            message = {
                status: 1,
                msg:"评论成功"
            }
            //更新当前文章的评论计数器
            Article
                .update({_id:data.article}, {$inc:
                {commentNum: 1}}, err => {
                    console.log("评论计数器更新成功！")
                })
            //更新用户评论计数器
            User.update({_id:data.reviewer},{$inc:{commentNum:1}},err => {
                if(err) return console.log(err)
            })
        })
        .catch(err => {
            message = {
                status: 0,
                msg:err
            }
        })
    ctx.body = message
}