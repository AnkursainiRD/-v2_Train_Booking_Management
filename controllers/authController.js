import { registerUserService,loginUserService,logoutUserService,verifyOtpService } from "../services/authService.js";

const registerController=async(req,res)=>{
    await registerUserService(req,res)
}

const verifyOtpController=async(req,res)=>{
    await verifyOtpService(req,res)
}

const loginController=async(req,res)=>{
    await loginUserService(req,res)
}

const logoutController=async(req,res)=>{
    await logoutUserService(req,res)
}

export {registerController,loginController,logoutController,verifyOtpController}