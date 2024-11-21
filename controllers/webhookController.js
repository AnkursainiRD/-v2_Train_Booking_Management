import crypto from 'crypto'
import ApiError from '../utils/errorResponse.js'
import { Booking } from '../models/bookingModel.js'
import { Payment } from '../models/paymentModel.js'
import { delAsync } from '../utils/concurrecntHandller.js'
import { releaseSeatHandller } from '../utils/releaseSeatHandller.js'

const handlePaymentWebhook=async(req,res)=>{
    try {
        console.log("first")
        const secret=process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req.headers['x-razorpay-signature']
        const body = JSON.stringify(req.body)

        const expectedSignature = crypto.createHmac('sha256',secret).update(body).digest('hex')

        if(signature !== expectedSignature){
            return res.status(400).send(new ApiError(400,"Invalid signature!"))
        }
        
        const event=req.body.event
        const payload=req.body.payload

        // const booking=
        let booking;
        if(event === 'payment.captured'){
            const payment=payload.payment.entity;
            booking=await Booking.findByIdAndUpdate(payment.notes.bookingId,{
                status:"confirmed",
                paymentStatus:"success"
            })
            console.log(payment)

            await Payment.create({
                bookingId:payment.notes.bookingId,
                userId:payment.notes.userId,
                amount:payment.amount/100,
                paymentStatus:"success",
                paymentGatewayResponse:payment
            })
            await delAsync(`lock:seat:${booking.trainId}:${booking.scheduleId}:${booking.seatNumber}:${booking.journeyDate}`)
            return res.status(200).send({success:true})
        }else if(event==='payment.failed'){
            await delAsync(`lock:seat:${booking.trainId}:${booking.scheduleId}:${booking.seatNumber}:${booking.journeyDate}`)
            await releaseSeatHandller(booking.trainId, booking.journeyDate, booking.seatNumber)
            return res.send(new ApiError(400,"Booking failed due to failed payment!"))
        }else{
            await delAsync(`lock:seat:${booking.trainId}:${booking.scheduleId}:${booking.seatNumber}:${booking.journeyDate}`)
            await releaseSeatHandller(booking.trainId, booking.journeyDate, booking.seatNumber)
            return res.send(new ApiError(400,"Invalid payment type!"))
        }

    } catch (error) {
        console.error('Error handling webhook:', error);
        return res.status(500).send(new ApiError(500, 'Webhook processing failed'));   
    }
} 

export { handlePaymentWebhook }