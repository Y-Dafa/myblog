const {db} = require("../Schema/config")

//通过db对象创建操作users数据库的模型对象
const UserSchema = require("../Schema/user")
const User = db.model("users",UserSchema)

module.exports = User