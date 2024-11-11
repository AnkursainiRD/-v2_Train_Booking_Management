import {createScheduleController,allSchedulesController,scheduleByIdController,updateScheduleController,deleteScheduleController} from "../controllers/scheduleController.js"
import { isAdmin,auth } from "../middlewares/authMiddleware.js"
import { validateScheduleValues,valueValidateService } from "../middlewares/valuesValidator.js"
import express from 'express'
const router=express.Router()

router.route("/allSchedules").get(auth,allSchedulesController)
router.route("/getSchedule").get(auth,scheduleByIdController)
router.route("/updateSchedule").patch(auth,isAdmin,updateScheduleController)
router.route("/deleteSchedule").delete(auth,isAdmin,deleteScheduleController)
router.route("/createSchedule").post(auth,isAdmin,validateScheduleValues(),valueValidateService,createScheduleController)

export default router;