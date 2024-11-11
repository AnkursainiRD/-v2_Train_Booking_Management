import { getAllTrainService,createTrainService,getTrainByIdService,updateTrainService,deleteTrainService } from "../services/trainService.js";

const allTrainController=async(req,res)=>{
    await getAllTrainService(req,res)
}

const createTrainController=async(req,res)=>{
    await createTrainService(req,res)
}

const trainByIdControler=async(req,res)=>{
    await getTrainByIdService(req,res)
}

const updateTrainController=async(req,res)=>{
    await updateTrainService(req,res)
}

const deleteTrainController=async(req,res)=>{
    await deleteTrainService(req,res)
}

export {allTrainController,createTrainController,trainByIdControler,updateTrainController,deleteTrainController}