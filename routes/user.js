const {Router} = require("express")
const userRouter = Router()
const{UserModel} = require("../db")

userRouter.post("/signup",(req,res)=>{
    res.json({
        messege:"User Signup endpoint"
    })
})

userRouter.post("/signin",(req,res)=>{
    res.json({
        messege:"User Signin endpoint"
    })
})

userRouter.get("/purchases",(req,res)=>{
    res.json({
        messege:"User purchases endpoint"
    })
})

module.exports = {
    userRouter:userRouter
}