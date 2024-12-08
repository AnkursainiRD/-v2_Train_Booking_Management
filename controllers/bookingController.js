import { getUserBookingService,createBookingService,canceledBookingService, releaseLockService, releaseSeatService } from "../services/bookingService.js";

const getBookingController=async(req,res)=>{
    await getUserBookingService(req,res)
}

const createBookingController=async(req,res)=>{
    await createBookingService(req,res)
}

const cancelBookingController=async(req,res)=>{
    await canceledBookingService(req,res)
}

const releaseLockController=async(req,res)=>{
    await releaseLockService(req,res)
}

const releaseSeatController=async(req,res)=>{
    await releaseSeatService(req,res)
}

export {getBookingController,createBookingController,cancelBookingController,releaseLockController,releaseSeatController}