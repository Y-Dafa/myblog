//生成article的schema
const {Schema} = require("./config")
const ObjectId=Schema.Types.ObjectId

const ArticleSchema = new Schema({
    title:String,
    content:String,
    author:{
        type:ObjectId,
        ref:"users"
    },//关联users的表
    tips:String,
    commentNum:Number,
    },{versionKey:false,
    timestamps:{createdAt:"created"}
})

ArticleSchema.post("remove",doc => {
    const Comment = require('../models/comment')
    const User = require("../models/user")

    const {articleId:artId, author:authorId} = doc
 
    //用户的articleNum-1
    User.findByIdAndUpdate(authorId,{$inc:{articleNum:-1}}).exec()
    //找到当前文章相关的所有评论，依次调用评论的remove
    Comment.find({article:artId},)
        .then(data => { //此时得到的data是一个数组
            data.forEach(v => v.remove())
        })
})

module.exports = ArticleSchema