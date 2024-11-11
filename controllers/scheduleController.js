import {createScheduleService,getAllSchedulesService,getScheduleByIdService,updateScheduleByIdService,deleteScheduleByIdService} from "../services/scheduleService.js"

const createScheduleController=async(req,res)=>{
    await createScheduleService(req,res)
}

const allSchedulesController=async(req,res)=>{
    await getAllSchedulesService(req,res)
}

const scheduleByIdController=async(req,res)=>{
    await getScheduleByIdService(req,res)
}

const updateScheduleController=async(req,res)=>{
    await updateScheduleByIdService(req,res)
}

const deleteScheduleController=async(req,res)=>{
    await deleteScheduleByIdService(req,res)
}

export {createScheduleController,allSchedulesController,scheduleByIdController,updateScheduleController,deleteScheduleController}