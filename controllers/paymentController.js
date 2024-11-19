import { createOrderService,verifyPaymentService } from "../services/paymentService.js";

const createOrderController=async(req,res)=>{
    await createOrderService(req,res)
}

const verifyPaymentController=async(req,res)=>{
    verifyPaymentService(req,res)
}
export {createOrderController,verifyPaymentController}