import {allTrainController,createTrainController,trainByIdControler,updateTrainController,deleteTrainController,findTrainBetweenStaionController} from "../controllers/trainController.js"
import {auth,isAdmin} from "../middlewares/authMiddleware.js"
import {validateTrainValues,valueValidateService} from "../middlewares/valuesValidator.js"
import express from 'express'
const router=express.Router()

router.route("/allTrain").get(auth,allTrainController)
router.route("/getTrain").get(auth,trainByIdControler)
router.route("/findTrain").get(auth,findTrainBetweenStaionController)
router.route("/updateTrain").patch(auth,isAdmin,updateTrainController)
router.route("/deleteTrain").delete(auth,isAdmin,deleteTrainController)
router.route("/createTrain").post(auth,isAdmin,validateTrainValues(),valueValidateService,createTrainController)

export default router;