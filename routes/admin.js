const {Router} = require("express")
const adminRouter = Router()
const {adminAuth} = require("../middleware/auth")
const{AdminModel,CourseModel, UserModel} = require("../db")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { z, string } = require("zod")
const { default: mongoose } = require("mongoose")
const course = require("./course")

//full Admin signup route done with zod validation.
adminRouter.post("/signup",async (req,res)=>{
    // adding validation
    const signupAdminSchema = z.object({
        email: z.string().email(),
        password: z.string().min(4),
        firstname: z.string().min(1),
        lastname: z.string().min(1)
    })
    const checkData = signupAdminSchema.safeParse(req.body)
    if(!checkData.success){
        const errorDetails = checkData.error.issues.map((issue)=>{
            return (issue.path+" "+issue.message)
        })
        return res.status(404).json({
            messege:"Incorrect format.",
            error:errorDetails
        })
    }
    try {
        const {email,password,firstname,lastname} = req.body
        //check if Admin/creator already present in the DB.
        const existAdmin = await AdminModel.findOne({email:email})
        if(existAdmin){
            res.json({
                messege:"Admin already exist."
            })
            return
        }
        //if admin/creator not in the DB then hass the pw and store in DB.
        const encryptPassword = await bcrypt.hash(password,5)
        await AdminModel.create({
            email:email,
            password:encryptPassword,
            firstName:firstname,
            lastName:lastname
        })
        res.status(200).json({
            messege:"Signup successfully completed."
        })
    } catch (error) {
        res.status(500).json({
            messege:"Error while signup."
        })
    }
})

//full Admin signin route done with zod validation.
adminRouter.post("/signin",async (req,res)=>{
    //adding validation.
    const adminSigninSchema = z.object({
        email: z.string().email(),
        password: z.string().min(4)
    })
    const checkData = adminSigninSchema.safeParse(req.body)
    if(!checkData.success){
        const errorDetails = checkData.error.issues.map((issue)=>{
            return (issue.path+" "+issue.message)
        })
        return res.status(404).json({
            messege:"Incorrect format.",
            error:errorDetails
        })
    }
    try {
        //check the admin/creator exist in DB.
        const {email,password} = req.body
        const existAdmin = await AdminModel.findOne({
            email:email,
        })
        //if not found then return no found
        if(!existAdmin){
            return res.status(404).json({
                messege:"User not found."
            })
        }
        //if found then check the pw
        const matchedPassword = await bcrypt.compare(password,existAdmin.password)
        //if pw not matched the retun pw not matched
        if(!matchedPassword){
            res.status(404).json({
                messege:"Password not matched."
            })
            return
        }
        //if pw matched then return the token to the admin.
        const token = jwt.sign({id:existAdmin._id},process.env.JWT_ADMIN_SECRET)
        res.status(200).json({
            messege:"Signin successfully.",
            token:token
        })
    } catch (error) {
        res.status(404).json({
            messege:"Error while signin."
        })
    }
})

//full Admin create course route done with zod validation.
adminRouter.post("/course/create",adminAuth,async(req,res)=>{
    //adding validation.
    const courseCreateSchema = z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        price: z.number().min(1),
        imageUrl: z.string().min(1)
    })
    const checkData = courseCreateSchema.safeParse(req.body)
    if(!checkData.success){
        const errorDetails = checkData.error.issues.map((issue)=>{
            return (issue.path+" "+issue.message)
        })
        return res.status(404).json({
            message:"Incorrect format.",
            error:errorDetails
        })
    }
    try {
        const adminId = req.id
        const { title, description, price, imageUrl } = req.body
        //create a course and stored in DB.
        const createdCourse = await CourseModel.create({
            title,
            description,
            price,
            imageUrl,
            creatorId:adminId
        })
        // stored the course id to the creator model
        await AdminModel.findByIdAndUpdate(adminId,{
            $push: {courseId:createdCourse._id}
        })
        res.status(200).json({
            messege:"Course created Done."
        })
    } catch (error) {
        res.status(401).json({
            messege:"You are not authenticate."
        })
    }
})

//full Admin course edit route done with zod validation.
adminRouter.patch("/course/edit",adminAuth,async(req,res)=>{
    //adding zod validation.
    const courseEditSchema = z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        price: z.number().min(1),
        imageUrl: z.string().min(1),
        courseId: z.string()
    })
    const checkData = courseEditSchema.safeParse(req.body)
    if(!checkData.success){
        const errorDetails = checkData.error.issues.map((issue)=>{
            return (issue.path+" "+issue.message)
        })
        return res.status(404).json({
            message:"Incorrect format.",
            error:errorDetails
        })
    }
    try {
        const adminId = req.id
        const { title, description, price, imageUrl, courseId } = req.body
        
        const course = await CourseModel.updateOne({
            _id:courseId,
            creatorId:adminId
        },{
            title,
            description,
            price,
            imageUrl
        })
        if(!course){
            return res.status(500).json({
                messege:"Course not found according to creator."
            })
        }
        res.status(200).json({
            messege:"Course is updated."
        })
    } catch (error) {
        res.status(401).json({
            messege:"You are not authenticate."
        })
    }
})
//full Admin course delete route done with zod validation.
adminRouter.delete("/course/delete",adminAuth,async(req,res)=>{
    //adding zod validation.
    const courseDeleteSchema = z.object({
        courseId: z.string().min(1)
    })
    const checkData = courseDeleteSchema.safeParse(req.body)
    if(!checkData.success){
        const errorDetails = checkData.error.issues.map((issue)=>{
            return (issue.path+" "+issue.message)
        })
        return res.status(404).json({
            messege:"Incorrect format.",
            error:errorDetails
        })
    }
    try {
        const adminId = req.id
        const { courseId } = req.body

        await AdminModel.updateOne({
            _id:adminId
        },{
            $pull:{courseId:courseId}
        })

        const isDelete = await CourseModel.deleteOne({
            _id:courseId,
            creatorId:adminId
        })
        
        if(!isDelete){
            return res.status(404).json({
                messege:"Course not found."
            })
        }
        res.status(200).json({
            messege:"Course is deleted."
        })

    } catch (error) {
        console.log(error);
        
        res.status(401).json({
            messege:"You are not authenticate."
        })
    }
})

//full Admin fet all course route done.
adminRouter.get("/course/all",adminAuth,async(req,res)=>{
    try {
        const adminId = req.id
        
        const courses = await CourseModel.find({
            creatorId:adminId
        })
        res.status(200).json({
            messege:"Here is your all courses.",
            courses:courses
        })
    } catch (error) {
        res.status(401).json({
            messege:"You are not authenticate."
        })
    }
})

module.exports = {
    adminRouter:adminRouter
}