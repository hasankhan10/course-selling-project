const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")
const{userRouter} = require('./routes/user')
const{courseRouter} = require('./routes/course')
const{adminRouter} = require('./routes/admin')

app.use(express.json())
app.use("/user",userRouter)
app.use("/course",courseRouter)
app.use("/admin",adminRouter)
async function main(){
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING)
        app.listen(process.env.PORT)
        console.log("DB connected and server start...");
        
    } catch (error) {
        console.log("db connection error...");
    }
}
main()