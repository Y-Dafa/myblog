const { db } = require("../Schema/config")

const ArticleSchema = require("../Schema/article")
const Article = db.model("articles", ArticleSchema)

const UserSchema = require("../Schema/user")
const User = db.model("users", UserSchema)

const CommentSchema = require("../Schema/comment")
const comment = db.model("comments", CommentSchema)