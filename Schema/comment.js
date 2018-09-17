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
        ref:"article"
    }
    },{versionKey:false, timestamps:{createdAt:"created"}
})

module.exports = CommentSchema