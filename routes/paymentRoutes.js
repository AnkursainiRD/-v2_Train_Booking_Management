import express from 'express'
import { auth } from '../middlewares/authMiddleware.js'
import { createOrderController } from '../controllers/paymentController.js'
import { handlePaymentWebhook } from '../controllers/webhookController.js'
const router=express.Router()

router.route("/createOrder").post(auth,createOrderController)
router.route("/paymentWebhook").post(express.raw({type:'application/json'}), handlePaymentWebhook)
router.get("/cp",(req,res)=>{
    res.send
})
export default router;