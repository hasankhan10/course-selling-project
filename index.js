const express = require("express")
const app = express()
const mongoose = require("mongoose")
const{userRouter} = require('./routes/user')
const{courseRouter} = require('./routes/course')
const{adminRouter} = require('./routes/admin')
const port = 3000

app.use("/user",userRouter)
app.use("/course",courseRouter)
app.use("/admin",adminRouter)
async function main(){
    try {
        await mongoose.connect("mongodb://localhost:27017/course-selling")
        app.listen(port)
        console.log("server start...");
        
    } catch (error) {
        console.log("db connection error...");
    }
}