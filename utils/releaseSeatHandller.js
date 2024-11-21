import { Train } from "../models/trainModel.js"
import {redisClient} from "../config/redisConfig.js";
import { Booking } from "../models/bookingModel.js";
import mongoose from "mongoose";

const releaseSeatHandller=async(trainId, journeyDate, seatNumber)=>{
    try {
        const train= await Train.findById(trainId)
        const booking = await Booking.findOne({
            $and: [
                { trainId: trainId },
                { journeyDate:`${journeyDate}:00:00.000+00:00`},
                { seatNumber: seatNumber },
              ]
          });
      
          if (booking) {
            console.log("Booking Found:", booking);
          } else {
            console.log("No Booking Found.");
          }

        
        if(!train || !booking){
            console.log("heree")
            return {
                success:false,
                message:"Train not found! Booking not exists!"
            }
        }
   
        const availbilty=train.seatAvailiblity.find((avail)=>avail.date.toISOString()===new Date(`${journeyDate}:00:00.000Z`).toISOString())
        if(availbilty && availbilty.reservedSeats.includes(seatNumber)){
            availbilty.reservedSeats=availbilty.reservedSeats.filter(seat=>seat!==seatNumber)
            availbilty.avalibleSeats +=1;
            await train.save()
            await booking.deleteOne()
            console.log("realeased")
            return true
        }
        return {
            success:false,
            message:"Failed to delete the invalid booking"
        }
    } catch (error) {
        console.log(error)
        return {
            success:false,
            message:error
        }
    }
}


const listenForExpiry=()=>{
    const redisSubscriber=redisClient.duplicate()

    redisSubscriber.psubscribe('__keyevent@0__:expired', (err,count)=>{
        if(err){
            console.error('Failed to subscribe to keyspace events:', err);
        }else{
            console.log(`Subscribed to ${count} keyspace events for lock expiry.`);
        }
    })

    redisSubscriber.on('pmessage', async(pattern,channel,expiredKey)=>{
        if(expiredKey.startsWith(`lock:seat:`)){
            const keyData=expiredKey.replace(/^lock:seat:/,'').split(':');
            await releaseSeatHandller(keyData[0], keyData[3], keyData[2]);
        }
    })
}

export { releaseSeatHandller ,listenForExpiry}