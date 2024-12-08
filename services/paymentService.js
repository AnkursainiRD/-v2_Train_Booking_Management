import razorpayInstance from "../config/razorpayConfig.js";
import ApiError from "../utils/errorResponse.js";
import ApiResponse from "../utils/apiResponse.js";
import Razorpay from "razorpay";
import crypto from 'crypto'

const createOrderService=async(req,res)=>{
    try {
        console.log(process.env.RAZORPAY_KEY_SECRET)
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
          });

        const {seatNumber,currency} = req.body
        let amount;
        seatNumber>20? amount=200 : amount=150
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
                userId: req?.user?.id
              },
        }

        const order = await razorpay.orders.create(options)
        if(!order){
            return res.status(400).send(new ApiError(400,"Order creation failed in payment!"))
        }
        return res.status(200).send(new ApiResponse(order,200,"Order created successfully"))
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).send(new ApiError(500, 'Failed to create order'));
    }
}


const verifyPaymentService=async (req, res) => {
   try {
     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

     const generatedSignature = crypto
       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
       .digest('hex');
   
     if (generatedSignature === razorpay_signature) {
        console.log("here at the payment verification")
       res.json({ success: true, message: 'Payment verified successfully' });
     } else {
       res.status(400).json({ success: false, message: 'Payment verification failed' });
     }
   } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).send(new ApiError(500, 'Failed to create order'));
   }
  }

export {createOrderService,verifyPaymentService}