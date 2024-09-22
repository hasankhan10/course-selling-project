const {Router} = require("express")
const adminRouter = Router()
const{AdminModel} = require("../db")

adminRouter.post("/signup",(req,res)=>{
    res.json({
        messege:"Admin Signup endpoint"
    })
})

adminRouter.post("/signin",(req,res)=>{
    res.json({
        messege:"Admin Signin endpoint"
    })
})

adminRouter.post("/create",(req,res)=>{
    res.json({
        messege:"create a course endpoint"
    })
})

adminRouter.put("/edit",(req,res)=>{
    res.json({
        messege:"edit a course endpoint"
    })
})

adminRouter.delete("/delete",(req,res)=>{
    res.json({
        messege:"delete a course endpoint"
    })
})

adminRouter.get("/all",(req,res)=>{
    res.json({
        messege:"all courses course endpoint"
    })
})

module.exports = {
    adminRouter:adminRouter
}