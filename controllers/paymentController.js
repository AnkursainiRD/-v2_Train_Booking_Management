import { createOrderService } from "../services/paymentService.js";

const createOrderController=async(req,res)=>{
    await createOrderService(req,res)
}

export {createOrderController}