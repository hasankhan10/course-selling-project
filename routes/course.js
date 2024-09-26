const {Router} = require("express")
const courseRouter = Router()
const{CourseModel,PurchasesModel} = require("../db")
const { userAuth } = require("../middleware/auth")

courseRouter.get("/purchased",userAuth,async(req,res)=>{
    try {
        const userId = req.id
        const courseId = req.body.courseId
       // use zod here

       //check the user already bought the course or not.
       const boughtCourse = await PurchasesModel.findOne({
            userId,
            courseId
       })
       if(boughtCourse){
        res.status(200).json({
            messege:"You have already bought this course."
        })
        return
       }
       await PurchasesModel.create({
            userId,
            courseId
       })
       res.status(200).json({
        messege:"You succesffully bought this course."
       })
    } catch (error) {
        res.status(401).json({
            messege:"You are not authenticate."
        })
    }
})

courseRouter.get("/preview",async(req,res)=>{
    try {
        const allCourses = await CourseModel.find({})
        res.status(200).json({
            messege:"Here is all the courses.",
            allCourses:allCourses
        })
    } catch (error) {
        res.status(5000).json({
            messege:"Error while fething Courses."
        })
    }
})

module.exports = {
    courseRouter:courseRouter
}