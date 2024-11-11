import { allUsersController,getUserController,updateUserController,deleteUserController } from "../controllers/userController.js";
import {auth,isAdmin} from "../middlewares/authMiddleware.js"
import express from 'express'
const router=express.Router()

router.route("/getUser").get(auth,getUserController)
router.route("/allUser").get(allUsersController)
router.route("/updateUser").patch(auth,updateUserController)
router.route("/deleteUser").delete(auth,deleteUserController)

export default router;