import mongoose from "mongoose";
import { Train } from "../models/trainModel.js";
import {Schedule} from "../models/scheduleModel.js"
import ApiError from "../utils/errorResponse.js";
import { Booking } from "../models/bookingModel.js";
import ApiResponse from "../utils/apiResponse.js";
import {AquireSeatLock,delAsync} from "../utils/concurrecntHandller.js";


const getUserBookingService=async(req,res)=>{
    try {
        const userID=req?.user?.id
        const bookings=await Booking.aggregate([
            {
                $match:{userId:new mongoose.Schema.ObjectId(userID)}
            },
            {
                $lookup:{
                    from:"schedules",
                    foreignField:"_id",
                    localField:"scheduleId"
                }
            }
        ])
        if(!bookings.length){
            return res.send(new ApiError(404,"No Boooking Availble"))
        }
        return res.send(new ApiResponse(2))
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

const createBookingService=async(req,res)=>{
    const {trainId,scheduleId,seatNumber,date,boardingStation,destinationStation}=req.body
    const isLocked= await AquireSeatLock(trainId,scheduleId,seatNumber)
    if(!isLocked){
        return res.send(new ApiError(400,"Currently Another User is Booking This Seat! Please try again!"))
    }
    const session=await mongoose.startSession();
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    session.startTransaction()
    try {
        const train=await Train.findById({
            _id:trainId,
            'seatAvailiblity.date':date
        }).session(session)
        
        let booking= await Booking.findOne({
            trainId:trainId,
            seatNumber:seatNumber
        })
        if(!train){
            await delAsync(`lock:seat:${trainId}:${scheduleId}:${seatNumber}`)
            return res.send(new ApiError(404,"Train not found! Check your date"))
        }
        const availbilty= train.seatAvailiblity.find((avail)=>avail.date.toISOString()===new Date(date).toISOString())

        if(!availbilty || availbilty.avalibleSeats <=0){
            await delAsync(`lock:seat:${trainId}:${scheduleId}:${seatNumber}`)
            return res.send(new ApiError(400,"No Seats Are Availbe For This Date! Try different deat"))
        }
        if(availbilty.reservedSeats.includes(seatNumber) && booking?.destinationStation>boardingStation){
            await delAsync(`lock:seat:${trainId}:${scheduleId}:${seatNumber}`)
            return res.send(new ApiError(400,"Seat Already Reserved! Try different seat"))
        }
        
        availbilty.reservedSeats.push(seatNumber)
        if(!availbilty.reservedSeats.includes(seatNumber)){
            availbilty.avalibleSeats -=1;
        }
        await train.save()
        await delay(4000) //For Testing Purpose---
        if(!booking){
            booking=new Booking({
                userId:req?.user?.id,
                trainId,
                scheduleId,
                seatNumber,
                journeyDate:date,
                boardingStation,
                destinationStation
            })
            await booking.save()
            await session.commitTransaction()
            session.endSession()
            await delAsync(`lock:seat:${trainId}:${scheduleId}:${seatNumber}`)
            return res.send(new ApiResponse(booking,200,"Seat Boooked Successfuly"))
        }
    } 
    catch (error) {
        await session.abortTransaction()
        session.endSession()
        await delAsync(`lock:seat:${trainId}:${scheduleId}:${seatNumber}`)
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

const releaseSeatService=async(trainId,journeyDate,seatNumber)=>{
    try {
        const train= await Train.findById(trainId)
        if(!train){
            return false
        }
        const availbilty=train.seatAvailiblity.find((avail)=>avail.journeyDate.toISOString()===new Date(journeyDate).toISOString())
        if(availbilty && availbilty.reservedSeats.includes(seatNumber)){
            availbilty.reservedSeats=availbilty.reservedSeats.filter(seat=>seat!==seatNumber)
            availbilty.avalibleSeats +=1;
            await train.save()
            return true
        }
        return false
    } catch (error) {
        console.log(error)
    }
}


const canceledBookingService=async(req,res)=>{
    try {
        const bookingId=req.params.bookingId
        const userId=req?.user?.id
        const booking=await Booking.findByIdAndUpdate({_id:bookingId,userId:userId},{status:"canceled"},{new:true})
        if(!booking){
            return res.send(new ApiError(404,"Booking Not Found! Or Already Canceled!"))
        }
        return res.send(booking,200,"Booking Canceled Successfuly")
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}


export {getUserBookingService,createBookingService,canceledBookingService,releaseSeatService}