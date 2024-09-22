const {Router} = require("express")
const courseRouter = Router()
const{CourseModel} = require("../db")

courseRouter.post("/purchased",(req,res)=>{
    res.json({
        messege:"course purchased endpoint"
    })
})

courseRouter.get("/preview",(req,res)=>{
    res.json({
        messege:"all courses preview endpoint"
    })
})

module.exports = {
    courseRouter:courseRouter
}