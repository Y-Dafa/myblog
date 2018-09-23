const {db} = require("../Schema/config")

//通过db对象创建操作article数据库的模型对象
const ArticleSchema = require("../Schema/article")
const Article = db.model("articles",ArticleSchema)

module.exports = Article