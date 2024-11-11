import mongoose from "mongoose";

const notificationSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    notificationType:{
        type:String,
        enum:["booking","cancellation","schedule"],
        required:true
    },
    message:{
        type:String,
        required:true
    }
},
{timestamps:true})

export const Notification=mongoose.model("Notification",notificationSchema)