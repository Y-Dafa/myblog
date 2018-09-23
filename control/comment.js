const User = require("../models/user")
const Article = require("../models/article")
const Comment = require("../models/comment")

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

//后台：查询用户所有评论
exports.commentList = async ctx => {
    const uid = ctx.session.uid
    const data = await Comment.find({reviewer:uid}).populate("article","title")
    console.log(data)

    //返回数据
    ctx.body = {
        code: 0,
        count:data.length,//确定表格数据行数
        data
    }
}

//后台删除对应id的评论
exports.del = async ctx => {
    //获取评论id
    const commentId = ctx.params.id
    
    let res = {
        state: 1,
        message: "删除成功"
    }

    await Comment.findById(commentId)
        .then(data => data.remove())
        .catch(err => {
            res = {
                state: 0,
                message: err
            }
        })
    ctx.body = res
}
