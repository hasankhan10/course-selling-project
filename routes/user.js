const {Router} = require("express")
const userRouter = Router()
const{UserModel,PurchasesModel} = require("../db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {userAuth} = require("../middleware/auth")

userRouter.post("/signup",async (req,res)=>{
    try {
        const {email,password,firstname,lastname} = req.body
        if(!email || !password || !firstname || !lastname){
            res.status(400).json({
                messege:"Missing require field in the request body."
            })
            return
        }
        const existUser = await UserModel.findOne({
            email:email
        })
        if(existUser){
            res.json({
                messege:"User already exist."
            })
            return
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

userRouter.post("/signin",async (req,res)=>{
    try {
        const {email,password} = req.body
        if(!email || !password){
            res.status(400).json({
                messege:"Missing require field in the request body."
            })
        }
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

userRouter.get("/purchases",userAuth,async(req,res)=>{
    try {
        const userId = req.id
        if(userId){
            const purchasesCourse = await PurchasesModel.find({
                userId
            })
        }
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