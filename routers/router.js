const Router = require('koa-router')

const router = new Router

//设计主页
router.get("/",async(ctx)=>{
    ctx.body="index"
})

module.exports = router