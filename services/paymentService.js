import razorpayInstance from "../config/razorpayConfig.js";
import ApiError from "../utils/errorResponse.js";
import ApiResponse from "../utils/apiResponse.js";

const createOrderService=async(req,res)=>{
    try {
        const {amount,currency} = req.body
        if(!amount || !currency){
            return res.status(400).send(new ApiError(400,"Amount are required!"))
        }

        const options={
            amount:amount*100,
            currency:currency,
            receipt:`reciept_${Date.now()}`,
            payment_capture:1,
            notes: {
                bookingId: req.body.bookingId, 
                userId: req.user.id
              },
        }

        const order = await razorpayInstance.orders.create(options)
        if(!order){
            return res.status(400).send(new ApiError(400,"Order creation failed in payment!"))
        }
        return res.status(200).send(new ApiResponse(order,200,"Order created successfully"))
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).send(new ApiError(500, 'Failed to create order'));
    }
}


export {createOrderService}