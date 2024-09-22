const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId


const UserSchema = new Schema({
    email:{type:String, unique:true},
    password:String,
    firstName:String,
    lastName:String,
    role:{type:String,enum:["User", "Admin"],default:"User"}
})

const AdminSchema = new Schema({
    email:{type:String, unique:true},
    password:String,
    firstName:String,
    lastName:String,
})

const CourseSchema = new Schema({
    title:String,
    description:String,
    price:Number,
    imageUrl:String,
    creatorId:ObjectId
})

const PurchasesSchema = new Schema({
    userId:ObjectId,
    courseId:ObjectId
})

const UserModel = mongoose.model("user",UserSchema)
const AdminModel = mongoose.model("admin",AdminSchema)
const CourseModel = mongoose.model("course",CourseSchema)
const PurchasesModel = mongoose.model("purchase",PurchasesSchema)

module.exports ={
    UserModel,
    AdminModel,
    CourseModel,
    PurchasesModel
}