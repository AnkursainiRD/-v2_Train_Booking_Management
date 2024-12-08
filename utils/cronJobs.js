import cron from 'node-cron'
import { Booking } from '../models/bookingModel.js'

cron.schedule('* * * * *', async()=>{
    try {
        const time = new Date(Date.now()- 60*1000)
        const expiredBookings=await Booking.deleteMany({
            status:'pending',
            createdAt:{ $lt:time}
        })
        console.log("Expired bookings deleted",expiredBookings)
    } catch (error) {
        console.log(error)
    }
})