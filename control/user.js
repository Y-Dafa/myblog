const {db}=require("../Schema/config")
const UserSchema=require("../Schema/user")
const encrypt=require("../util/encrypt")

//通过db 对象创建操作user数据库的模型对象
const User=db.model("users",UserSchema)

/*
    导出用户注册
    用户注册时：
      1.去数据库user先查询当前发过来的username是否存在
*/
exports.reg = async ctx => {
    //用户注册时post发过来的数据
    const user=ctx.request.body
    const username=user.username
    const password=user.password
    
    await new Promise((resolve,reject) => {
        //去数据库user查询
        User.find({username},(err,data) => {
            if(err)return reject(err)
            //数据库查询没有出错时，还可能是数据库内没有数据
            if(data.length!==0){
                //查询到数据---> 用户名已存在
                return resolve("")
            }
            //用户名不存在 需要存到数据库,存到数据库之前需要先加密,encrypt是自定义的加密模块
            const _user=new User({
                username,
                password:encrypt(password)
            })
            _user.save((err,data) => {
                if(err){  //保存过程中可能出错
                    reject(err)
                }else{  //保存成功
                    resolve(data)
                }
            })
        })
    })
    //对上面的promise进行监听
    .then(async data => {
        if(data){
            //注册成功
            await ctx.render("isOk",{
                status:"注册成功！"
            })
        }else{
            //用户名已存在
            await ctx.render("isOk",{
                status:"用户名已存在"
            })
        }
    })
   .catch(async err => {
        await ctx.render("isOk",{
            status:"注册失败，请重试！"
        })
   })
}

//用户登录
exports.login = async ctx => {
    //拿到post数据
    const user = ctx.request.body
    const username = user.username
    const password = user.password

    await new Promise((resolve,reject) => {
        User.find({username},(err,data) => {
            if(err)return reject(err)
            if(data.length === 0) return reject("用户名不存在")
            //把用户传过来的密码加密后跟数据库的对比
            if(data[0].password === encrypt(password)){
                return resolve(data) //密码正确，登录成功
            }
            resolve("") //密码错误
        })
    })
    .then(async data => {
        if(!data){
            return ctx.render("isOk",{
                status:"密码不正确，登录失败！"
            })
        }
        //用户登录成功之前，让用户在cookie里设置username，password加密后的密码，权限
        ctx.cookies.set("username",username,{
            domain:"localhost", //挂载的主机名
            path:"/",
            maxAge:36e5,
            httpOnly:true,//true不让客户端访问这个cookie
            overwrite:false,//不覆盖，为第一次存值
        })

        //存一个用户在数据库的_id
        ctx.cookies.set("uid",data[0]._id,{
            domain:"localhost", //挂载的主机名
            path:"/",
            maxAge:36e5,
            httpOnly:true,//true不让客户端访问这个cookie
            overwrite:false,//不覆盖，为第一次存值
        })

        ctx.session={
            username,
            uid:data[0]._id,
            avatar:data[0].avatar,
        }
        //登陆成功
        await ctx.render("isOk",{
            status:"登录成功！"
        })
    })
    .catch(async err => {
        await ctx.render("isOk",{
            status:"登录失败"
        })
    })
}

//确定用户的状态，以及保持用户状态session
exports.keepLog=async (ctx, next) => {
    if(ctx.session.isNew){ //session没有为true,没有登录
        if(ctx.cookies.get("userrname")){ //cookies存在
            ctx.session={
                username:ctx.cookies.get("username"),
                uid,
            }
        }
    }
    await next()
}

//用户退出的中间件
exports.logout=async ctx => {
    ctx.session = null
    ctx.cookies.set("username",null,{
        maxAge:0
    })
    ctx.cookies.set("uid",null,{
        maxAge:0
    })
    //在后台做重定向到根
    ctx.redirect("/")
}