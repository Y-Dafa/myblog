//生成user的schema
const {Schema} = require("./config")
const UserSchema = new Schema({
    username:String,
    password:String,
    role:{
        type:String,
        default:1, // 用户权限默认为1 为普通用户
    },
    articleNum:Number,
    commentNum:Number,
    avatar:{
        type:String,
        default:"/avatar/default.jpg",//默认头像
    }
},{versionKey:false})

module.exports = UserSchema