import crypto from 'crypto'
import ApiError from '../utils/errorResponse.js'
import { Booking } from '../models/bookingModel.js'
import { Payment } from '../models/paymentModel.js'
import { delAsync } from '../utils/concurrecntHandller.js'
import { releaseSeatHandller } from '../utils/releaseSeatHandller.js'
import addNotificationJob from '../config/bullmqConfig.js'
import { User } from '../models/userModel.js'
import { ticketHtmlTemplate } from '../static/mailTemplates.js'

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
        const bookingId=payload.payment.entity.notes.bookingId
        const booking= await Booking.findById(bookingId)
        const user=await User.findById(booking.userId)
       


        console.log("at webhook",booking)

        if(event === 'payment.captured'){
            
            const payment=payload.payment.entity
            booking.status="confirmed",
            booking.paymentStatus="success"
            await booking.save()
            console.log(payment)

            await Payment.create({
                bookingId:payment.notes.bookingId,
                userId:payment.notes.userId,
                amount:payment.amount/100,
                paymentStatus:"success",
                paymentGatewayResponse:payment
            })
            // await delAsync(`lock:seat:${booking.trainId}:${booking.scheduleId}:${booking.seatNumber}:${booking.journeyDate}`)
            await addNotificationJob(user,ticketHtmlTemplate)
            return res.status(200).send({success:true})
        }else if(event==='payment.failed'){
            // await delAsync(`lock:seat:${booking.trainId}:${booking.scheduleId}:${booking.seatNumber}:${booking.journeyDate}`)
            await releaseSeatHandller(booking.trainId, booking.journeyDate, booking.seatNumber,booking.userId)
            return res.send(new ApiError(400,"Booking failed due to failed payment!"))
        }else{
            // await delAsync(`lock:seat:${booking.trainId}:${booking.scheduleId}:${booking.seatNumber}:${booking.journeyDate}`)
            await releaseSeatHandller(booking.trainId, booking.journeyDate, booking.seatNumber,booking.userId)
            return res.send(new ApiError(400,"Invalid payment type!"))
        }

    } catch (error) {
        console.error('Error handling webhook:', error);
        return res.status(500).send(new ApiError(500, 'Webhook processing failed'));   
    }
} 

export { handlePaymentWebhook }