const User = require("../models/user")
const Article = require("../models/article")
const Comment = require("../models/comment")

const fs = require("fs")
const {join} = require("path")

exports.index = async ctx => {
    if(ctx.session.isNew){
        //用户没有登录
        ctx.status = 404
        return await ctx.render("404", {title:"404"})
    }
    //用户登录，获取动态路由的id
    const id = ctx.params.id
    //借助fs文件系统读取admin文件夹下的所有文件
    const arr = fs.readdirSync(join(__dirname,"../views/admin"))
    let flag = false 
    arr.forEach(v => {
        const name = v.replace(/^(admin\-)|(\.pug)$/g, "")
        if(name === id){
            flag = true;
        }
    })
    if(flag){ //true登录成功
        await ctx.render("./admin/admin-" + id,{
            role:ctx.session.role
        })
    }else{
        ctx.status = 404
        await ctx.render("404", {title: "404"})
    }
}