const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId


const UserScheama = new Schema({
    email:{type:String, unique:true},
    password:String,
    firstName:String,
    lastName:String,
    role:"User"|"Admin"
})

const AdminScheama = new Schema({
    email:{type:String, unique:true},
    password:String,
    firstName:String,
    lastName:String,
})

const CourseScheama = new Schema({
    title:String,
    description:String,
    price:Number,
    imageUrl:String,
    creatorId:ObjectId
})

const PurchasesScheama = new Schema({
    userId:ObjectId,
    courseId:ObjectId
})

const UserModel = mongoose.model("user",UserScheama)
const AdminModel = mongoose.model("admin",AdminScheama)
const CourseModel = mongoose.model("course",CourseScheama)
const PurchasesModel = mongoose.model("purchase",PurchasesScheama)

module.exports ={
    UserModel,
    AdminModel,
    CourseModel,
    PurchasesModel
}