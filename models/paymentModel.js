import mongoose from "mongoose";

const paymentSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Booking",
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    paymentStatus:{
        type:String,
        enum:["pending","success","failed"],
        default:"pending"
    },
    paymentGatewayResponse:{
        type:Object
    }
},{timestamps:true})

export const Payment=mongoose.model("Payment",paymentSchema)