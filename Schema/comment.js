//生成article的schema
const {Schema} = require("./config")
const ObjectId=Schema.Types.ObjectId

const CommentSchema = new Schema({
    content:String,
    reviewer:{  //评论者关联users的表
        type:ObjectId,
        ref:"users"
    },
    article:{   //关联到article集合
        type:ObjectId,
        ref:"articles"
    }
    },{versionKey:false, timestamps:{createdAt:"created"}
})

//设置comment的钩子函数
CommentSchema.post("remove",(doc) => {
    //当前这个回调函数一定在remove事件执行之前执行
    const Article = require('../models/article')
    const User = require("../models/user")

    const {reviewer,article} = doc
    //对应文章评论数-1
    Article.updateOne({_id:article},{$inc:{commentNum:-1}}).exec()
    //当前评论者的commentNum-1
    User.updateOne({_id:reviewer},{$inc:{commentNum:-1}}).exec()
})

module.exports = CommentSchema