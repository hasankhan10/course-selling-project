const {Router} = require("express")
const courseRouter = Router()
const{CourseModel,UserModel} = require("../db")
const { auth } = require("../middleware/auth")

courseRouter.get("/purchased",auth,async(req,res)=>{
    try {
        const userId = req.id
        if(userId){
            const user = await UserModel.findById({
                _id:userId
            })
            const usersCourses = user.courseId
            res.status(200).json({
                messege:"Here is your purchased Courses.",
                usersCourses:usersCourses
            })
        }
        
    } catch (error) {
        res.status(401).json({
            messege:"You are not authenticate."
        })
    }
})

courseRouter.get("/preview",async(req,res)=>{
    try {
        const allCourses = await CourseModel.find()
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