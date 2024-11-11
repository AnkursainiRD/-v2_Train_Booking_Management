import {User} from "../models/userModel.js"
import ApiError from "../utils/errorResponse.js"
import ApiResponse from "../utils/apiResponse.js"
import mailSenderService from "../utils/mailSender.js"
import { redisClient } from "../config/redisConfig.js"

const registerUserService=async(req,res)=>{
    try {
        const {userName,password,email,phone,role}=req.body
        
        const existedUser=await User.findOne({email:email})
        if(existedUser){
            return res.send(new ApiError(409,"User Already Exists!"))
        }
        const otp=await mailSenderService(email)
        await redisClient.setex(email,300,JSON.stringify(otp))

        const user=await User.create({userName,password,email,phone,role})
        if(!user){
            return res.send(new ApiError(400,"User Creation Failed!"))
        }

        return res.send(new ApiResponse(user,201))
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

const verifyOtpService=async(req,res)=>{
    try {
        const {email,userOtp}=req.body
        if(!userOtp){
            return res.send(new ApiError(404,"OTP not found!"))
        }
        const otp=await redisClient.get(email)
        if(!otp && JSON.parse(otp)!==userOtp){
            await User.findOneAndDelete({email:email})
            return res.send(new ApiError(403,"Invalid OTP! or Otp might be expired!"))
        }
        await User.findOneAndUpdate({email:email},{accountStatus:"activated"})
        return res.send(new ApiResponse(null,200,"User Registered Successfuly!"))
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

const loginUserService=async(req,res)=>{
    try {
        const {email,password}=req.body
        if(!email && !password){
            return res.send(new ApiError(400,"Credntials are missing!"))
        }
        const user= await User.findOne({email:email})
        console.log(email)
        if(user?.accountStatus=="deactivated" || !user){
            return res.send(new ApiError(404,"User Not Exists!"))
        }
        if(!await user.passwordCheck(password)){
            return res.send(new ApiError(400,"Invalid Password!"))
        }
        const token=user.generateToken()
        if(!token){
            return res.send(new ApiError(403,"Token Creation Failed!"))
        }
        const options={
            httpOnly:true,
            secure:true
        }
        return res.cookie("token",token,options).send(new ApiResponse(200,"User Logged In"))
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

const logoutUserService=async(req,res)=>{
    try {
        const userId=req?.user?.id
        if(!userId){
            return res.send(new ApiError(404,"User Id not found!"))
        }
        const options={
            httpOnly:true,
            secure:true
        }
        return res.clearCookie("token",options).send(new ApiResponse(200,"User Logout Successfuly"))
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

export {registerUserService,loginUserService,logoutUserService,verifyOtpService}