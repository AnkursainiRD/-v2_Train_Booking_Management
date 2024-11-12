import { Schedule } from "../models/scheduleModel.js"
import { Train } from "../models/trainModel.js"
import ApiResponse from "../utils/apiResponse.js"
import ApiError from "../utils/errorResponse.js"


const createScheduleService=async(req,res)=>{
    try {
        const train=await Train.findOne({_id:req.body?.trainId})
        if(!train){
            return res.send(new ApiError(404,"Train Not Found! Invalid Train Id"))
        }
        const schedule=await Schedule.create(req.body)
        if(!schedule){
            return res.send(new ApiError(401,"Schedule Creation Failed! Try Again"))
        }

        train.schedule=schedule._id
        await train.save()
        return res.send(new ApiResponse(schedule,200,"Schedule Created Successfuly"))
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

const getAllSchedulesService=async(req,res)=>{
    try {
        const schedules=await Schedule.find()
        if(!schedules.length){
            return res.send(new ApiError(404,"NO Schedules Found!"))
        }
        return res.send(new ApiResponse(schedules,200,"Schedules Fetched"))
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

const getScheduleByIdService=async(req,res)=>{
    try {
        const scheduleId = req.query.id
        if(!scheduleId){
            return res.send(new ApiError(400,"Invalid Schedule Id! Try Again"))
        }
        const schedule=await Schedule.findById({_id:scheduleId})
        if(!schedule){
            return res.send(new ApiError(404,"NO Schedules Found!"))
        }
        return res.send(new ApiResponse(schedule,200,"Schedule Fetched"))
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

const updateScheduleByIdService=async(req,res)=>{
    try {
        const scheduleId = req.query.id
        const data=req.body
        if(!scheduleId){
            return res.send(new ApiError(400,"Invalid Schedule Id! Try Again"))
        }
        const schedule=await Schedule.findByIdAndUpdate({_id:scheduleId},data,{new:true})
        if(!schedule){
            return res.send(new ApiError(404,"NO Schedules Found!"))
        }
        return res.send(new ApiResponse(schedule,200,"Schedule Updated"))
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

const deleteScheduleByIdService=async(req,res)=>{
    try {
        const scheduleId = req.query.id
        if(!scheduleId){
            return res.send(new ApiError(400,"Invalid Schedule Id! Try Again"))
        }
        const schedule=await Schedule.findByIdAndDelete({_id:scheduleId})
        if(!schedule){
            return res.send(new ApiError(404,"NO Schedules Found!"))
        }
        return res.send(new ApiResponse(schedule,200,"Schedule Deleted"))
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

export {createScheduleService,getAllSchedulesService,getScheduleByIdService,updateScheduleByIdService,deleteScheduleByIdService}