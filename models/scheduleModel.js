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
    routeName:{
        type:String,
        required:true
    },
    routeCode:{
        type:String,
        required:true
    },
    stations:[
        {
           stationCode:{
            type:String,
            required:true
           },
           stationName:{
            type:String,
            required:true
           },
           location:{
                type:{
                    type:String,
                    enum:["Point"],
                    required:true,
                    default:"Point"
                },
                coordinates:{
                    type:[Number],
                    required:true
                }
           },
           stopNumber:{
            type:Number,
            required:true
           },
           arrivalTime:{
            type:String
           },
           departureTime:{
            type:String
           }
        }
    ]
})

scheduleSchema.index({'stations.location': '2dsphere'})

export const Schedule= mongoose.model("Schedule",scheduleSchema)