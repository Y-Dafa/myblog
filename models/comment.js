const {db} = require("../Schema/config")

//通过db对象创建操作comments数据库的模型对象
const CommentSchema = require("../Schema/comment")
const Comment = db.model("comments",CommentSchema)

module.exports = Comment