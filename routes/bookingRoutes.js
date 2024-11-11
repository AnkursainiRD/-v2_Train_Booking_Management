import { cancelBookingController, createBookingController, getBookingController } from "../controllers/bookingController.js"
import {auth} from "../middlewares/authMiddleware.js"
import express from 'express'
const router=express.Router()

router.route("/getBookings").get(auth,getBookingController)
router.route("/createBooking").post(auth,createBookingController)
router.route("/cancelBooking").patch(auth,cancelBookingController)


export default router;