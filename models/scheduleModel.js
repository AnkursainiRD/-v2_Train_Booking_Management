import mongoose from "mongoose";

const scheduleSchema=new mongoose.Schema({
    trainId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Train"
    },
    trainNumber:{
        type:String,
        required:true
    },
    trainName:{
        type:String,
        required:true
    },
    routes:[
        {
            station:String,
            arrivalTime:String,
            departureTime:String
        }
    ]
})

export const Schedule= mongoose.model("Schedule",scheduleSchema)