layui.use(['form','layedit','element'],function(){
    const form=layui.form;
    const layedit=layui.layedit;
    const $=layui.$

    const index=layedit.build("article-content",{
        hideTool:[
            'image' //插入图片
        ]
    });//建立编辑器

    form.on("submit(send)",(res)=>{
        const {tips,title}=res.field
        if(layedit.getText(index).trim().length === 0)return layer.alert("请输入内容")
        const data={
            tips,
            title,
            content:layedit.getContent(index)
        }
        $.post("/article",data,(msg)=>{
            if(msg.status){
                layer.alert('发表成功',(res)=>{
                    location.href="/"
                })
            }else{
                layer.alert(`发表失败，失败信息：${msg.msg}`)
            }
        })
    })
});