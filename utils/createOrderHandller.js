import razorpayInstance from "../config/razorpayConfig.js";

const createOrderHandller=async(seatNumber,bookingId,userId,scheduleId)=>{
    try {
    
        let amount;
        seatNumber>20? amount=200 : amount=150
        if(!amount){
            return false
        }

        const options={
            amount:amount*100,
            currency:'INR',
            receipt:`reciept_${Date.now()}`,
            payment_capture:1,
            notes: {
                bookingId: bookingId, 
                userId: userId,
                scheduleId:scheduleId
              },
        }

        const order = await razorpayInstance.orders.create(options)
        if(!order){
            return {
                success: false,
                message: "Failed to initiate payment. Please try again later.",
            }
        }
        return {
            success: true,
            data:order,
            seatNumber:seatNumber
        }
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return {
            success: false,
            messaged: "Internal server error!. Please try again later.",
        }
    }
}

export default createOrderHandller