import express from 'express'
import { auth } from '../middlewares/authMiddleware.js'
import { createOrderController, verifyPaymentController } from '../controllers/paymentController.js'
import { handlePaymentWebhook } from '../controllers/webhookController.js'
import crypto from 'crypto'
const router=express.Router()

router.route("/createOrder").post(auth,createOrderController)
router.route("/paymentWebhook").post(express.raw({type:'application/json'}), handlePaymentWebhook)
router.route('/verify-payment').post(auth,verifyPaymentController);
  
export default router;