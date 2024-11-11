import { getUserBookingService,createBookingService,canceledBookingService } from "../services/bookingService.js";

const getBookingController=async(req,res)=>{
    await getUserBookingService(req,res)
}

const createBookingController=async(req,res)=>{
    await createBookingService(req,res)
}

const cancelBookingController=async(req,res)=>{
    await canceledBookingService(req,res)
}

export {getBookingController,createBookingController,cancelBookingController}