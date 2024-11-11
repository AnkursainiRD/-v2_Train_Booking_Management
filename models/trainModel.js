import mongoose from "mongoose";

const seatAvailiblitySchema=new mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    avalibleSeats:{
        type:Number,
        required:true
    },
    totalSeats:{
        type:Number,
        required:true
    },
    reservedSeats:{
        type:[String],
        default:[]
    }
},{_id:false});


const trainSchema=new mongoose.Schema({
    trainNumber:{
        type:String,
        required:true,
        unique:true
    },
    trainName:{
        type:String,
        required:true
    },
    schedule:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Schedule"
    },
    seatAvailiblity:[seatAvailiblitySchema]
},{timestamps:true})


export const Train=mongoose.model("Train",trainSchema)
