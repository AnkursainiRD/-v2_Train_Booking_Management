import { cancelBookingController, createBookingController, getBookingController, releaseLockController, releaseSeatController } from "../controllers/bookingController.js"
import {auth} from "../middlewares/authMiddleware.js"
import express from 'express'
const router=express.Router()

router.route("/getBookings").get(auth,getBookingController)
router.route("/releaseSeat").post(auth,releaseSeatController)
router.route("/releaseLock").post(auth,releaseLockController)
router.route("/createBooking").post(auth,createBookingController)
router.route("/cancelBooking").patch(auth,cancelBookingController)


export default router;