const {Router} = require("express")
const userRouter = Router()
const{UserModel,PurchasesModel} = require("../db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {z} = require("zod")
const {userAuth} = require("../middleware/auth")

//full user signup route complete.
userRouter.post("/signup",async (req,res)=>{
    //adding zod validation.
    const userSignupSchema = z.object({
        email: z.string().email(),
        password: z.string().min(4),
        firstname: z.string().min(1),
        lastname: z.string().min(1)
    })
    const checkData = userSignupSchema.safeParse(req.body)
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
        //check if user is exist or not!
        const {email,password,firstname,lastname} = req.body
        const existUser = await UserModel.findOne({
            email:email
        })
        if(existUser){
            return res.json({
                messege:"User already exist."
            })
        }

        const encryptPassword = await bcrypt.hash(password,5)
        await UserModel.create({
            email:email,
            password:encryptPassword,
            firstName:firstname,
            lastName:lastname
        })
        res.status(200).json({
            messege:"Signup Successfully."
        })

    } catch (error) {
        res.status(500).json({
            messege:"Error while signin."
        })
    }
})

//full user signin route complete.
userRouter.post("/signin",async (req,res)=>{
    const userSiginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(4)
    })
    const checkData = userSiginSchema.safeParse(req.body)
    if(!checkData.success){
        const errorDetails = checkData.error.issues.map((issue)=>{
            return (issue.path+" "+issue.message)
        })
        return res.status(500).json({
            messege:"Format not matched.",
            error:errorDetails
        })
    }
    try {
        const {email,password} = req.body
        //check user is exist or not.
        const existUser = await UserModel.findOne({
            email:email
        })
        if(!existUser){
            res.status(500).json({
                messege:"User not found."
            })
            return
        }
        const matchedPassword = await bcrypt.compare(password,existUser.password)
        if(!matchedPassword){
            res.status(404).json({
                messege:"Password not matched."
            })
            return
        }
        const token = jwt.sign({id:existUser._id},process.env.JWT_USER_SECRET)
        res.status(200).json({
            messege:"Signin successfully",
            token:token
        })

    } catch (error) {
        res.status(404).json({
            messege:"Error while signin."
        })
    }
})

//full user purchased route complete.
userRouter.get("/purchased",userAuth,async(req,res)=>{
    try {
        const userId = req.id
        const purchasesCourse = await PurchasesModel.find({
            userId:userId
        })
        res.status(200).json({
            messege:"Here is all your purchases courses.",
            purchasesCourse
        })
    } catch (error) {
        res.status(401).json({
            messege:"You are not authenticate."
        })
    }
})

module.exports = {
    userRouter:userRouter
}