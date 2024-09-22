const {Router} = require("express")
const adminRouter = Router()
const {auth} = require("../middleware/auth")
const{AdminModel} = require("../db")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

adminRouter.post("/signup",async (req,res)=>{
    
    try {
        const {email,password,firstname,lastname} = req.body
        if (!email || !password || !firstname || !lastname) {
            return res.status(400).json({ message: "Missing required fields in the request body." });
        }
        const existAdmin = await AdminModel.findOne({email:email})
        if(existAdmin){
            res.json({
                messege:"Admin already exist."
            })
            return
        }
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

adminRouter.post("/signin",async (req,res)=>{
    
    try {
        const {email,password} = req.body
         if(!email || !password){
            return res.status(400).json({ message: "Missing required fields in the request body." });
        }
        const existAdmin = await AdminModel.findOne({
            email:email,
        })

        if(!existAdmin){
            res.status(404).json({
                messege:"User not found."
            })
            return
        }
        const matchedPassword = await bcrypt.compare(password,existAdmin.password)

        if(!matchedPassword){
            res.status(404).json({
                messege:"Password not matched."
            })
            return
        }
        const token = jwt.sign({id:existAdmin._id},process.env.JWT_SECRET)
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

adminRouter.post("/create",auth,(req,res)=>{
    const adminId = req.id
    try {
        if(adminId){
            res.status(200).json({
                messege:"You can create your course"
            })
        }
    } catch (error) {
        res.status(401).json({
            messege:"You are not authenticate."
        })
    }
})

adminRouter.put("/edit",auth,(req,res)=>{
    const adminId = req.id
    try {
        if(adminId)[
            res.status(200).json({
                messege:"You can edit your course"
            })
        ]
    } catch (error) {
        res.status(401).json({
            messege:"You are not authenticate."
        })
    }
})

adminRouter.delete("/delete",auth,(req,res)=>{
    const adminId = req.id
    try {
        if(adminId)[
            res.status(200).json({
                messege:"You can delete your course"
            })
        ]
    } catch (error) {
        res.status(401).json({
            messege:"You are not authenticate."
        })
    }
})

adminRouter.get("/all",auth,(req,res)=>{
    const adminId = req.id
    try {
        if(adminId)[
            res.status(200).json({
                messege:"You can access your course."
            })
        ]
    } catch (error) {
        res.status(401).json({
            messege:"You are not authenticate."
        })
    }
})

module.exports = {
    adminRouter:adminRouter
}