//生成user的schema
const {Schema} = require("./config")
const UserSchema = new Schema({
    username:String,
    password:String,
    avatar:{
        type:String,
        default:"/avatar/default.jpg",//默认头像
    }
},{versionKey:false})

module.exports = UserSchema