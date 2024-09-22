const {Router} = require("express")
const userRouter = Router()
const{UserModel} = require("../db")

    userRouter.post("/signup",(req,res)=>{
        res.json({
            messege:"Signup endpoint"
        })
    })
    
    userRouter.post("/signin",(req,res)=>{
        res.json({
            messege:"Signin endpoint"
        })
    })
    
    userRouter.get("/purchases",(req,res)=>{
        res.json({
            messege:"purchases endpoint"
        })
    })

module.exports = {
    userRouter:userRouter
}