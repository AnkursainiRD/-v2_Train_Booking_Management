import mongoose from "mongoose";
import { Booking } from "../models/bookingModel.js";
import { Payment } from "../models/paymentModel.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/errorResponse.js";
import { releaseSeatService } from "./bookingService.js";

const handlePayment=async(req,res)=>{
    const {bookingId,paymentId,paymentStatus}=req.body
    if(paymentStatus!=="success"){
        return res.send(new ApiError(403,"Payment Verification Failed!"))
    }
    try {
        let booking;
        if(paymentStatus=="success"){
            booking=await Booking.findByIdAndUpdate(
                bookingId,
                {paymentStatus:'confirmed'},
                {new:true}
            )
        
        if(!booking){
            return res.send(new ApiError(404,"Booking Not Found!"))
        }
        return res.send(new ApiResponse(booking,200,"Booking Confirmed Successful"))
    }else{
        if(booking){
            const {trainId,journeyDate,seatNumber}=booking
            await releaseSeatService(trainId,journeyDate,seatNumber)
            return res.send(new ApiError(400,"Payment Failed! Ticket has been canceled!"))
        }
    }
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

export {handlePayment}