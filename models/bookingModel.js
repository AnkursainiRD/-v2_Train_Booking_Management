import mongoose from "mongoose";

const bookingSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    trainId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Train",
        required:true
    },
    scheduleId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Schedule",
        required:true
    },
    seatNumber:{
        type:String,
        required:true
    },
    boardingStation:{
        type:Number,
        required:true
    },
    destinationStation:{
        type:Number,
        required:true
    },
    journeyDate:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["pending","confirmed","canceled"],
        default:"pending"
    },
    paymentStatus:{
        type:String,
        enum:["pending","success","failed"],
        default:"pending"
    }
},{timestamps:true})

export const Booking=mongoose.model("Booking",bookingSchema )