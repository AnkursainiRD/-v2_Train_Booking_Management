import express from 'express'
import {registerController,loginController,logoutController, verifyOtpController} from "../controllers/authController.js"
import { auth } from '../middlewares/authMiddleware.js'
import { validateValues, valueValidateService } from '../middlewares/valuesValidator.js'
const router = express.Router()

router.route("/register").post(validateValues(),valueValidateService,registerController)
router.route("/verifyOtp").post(verifyOtpController)
router.route("/login").post(loginController)
router.route("/logout").post(auth,logoutController)

export default router;