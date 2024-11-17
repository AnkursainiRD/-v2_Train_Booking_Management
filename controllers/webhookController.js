import crypto from 'crypto'
import ApiError from '../utils/errorResponse.js'
import { Booking } from '../models/bookingModel.js'

const handlePaymentWebhook=async(req,res)=>{
    try {
        const secret=process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req.headers['x-razorpay-signature']
        const body = JSON.stringify(req.body)

        const expectedSignature = crypto.createHmac('sha256',secret).update(body).digest('hex')

        if(signature !== expectedSignature){
            return res.status(400).send(new ApiError(400,"Invalid signature!"))
        }
        
        const event=req.body.event
        const payload=req.body.payload

        if(event === 'payment.captured'){
            const payment=payload.payment.entity;
            await Booking.findByIdAndUpdate(payment.notes.bookingId,{
                status:"confirmed"
            })
        }
        return res.status(200).send({success:true})
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).send(new ApiError(500, 'Webhook processing failed'));   
    }
}

export { handlePaymentWebhook }