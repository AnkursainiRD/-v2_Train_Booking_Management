import { User } from "../models/userModel.js";
import ApiError from "../utils/errorResponse.js";
import ApiResponse from "../utils/apiResponse.js";
import {redisClient} from "../config/redisConfig.js";

const getAllUsersService=async(req,res)=>{
    try {
        // const cachseUsers=await redisClient.get("users")
        // console.log("here")
        // if(cachseUsers){
        //    return res.send(new ApiResponse(JSON.parse(cachseUsers),200,"Users Fetched from Cache")) 
        // }
        const users=await User.find()
        if(!users){
            return res.send(new ApiError(404,"No User Found!"))
        }
        // await redisClient.set("users",JSON.stringify(users))
        return res.send(new ApiResponse(users,200,"Users Fetched"))
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

const getUserProfileService=async(req,res)=>{
    try {
        const userId=req?.user?.id
        const user=await User.findById({_id:userId}).select('-password')
        if(!user){
            return res.send(new ApiError(404,"User Not Found!"))
        }
        return res.send(new ApiResponse(user,200,"User Fetched"))
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

const updateUserProfileService=async(req,res)=>{
    try {
        const userId=req?.user?.id
        const data=req.body
        // const updatedData={userName,email,password}
        // console.log(updatedData)
        const updatedUser=await User.findByIdAndUpdate(userId,data,{new:true,runValidators:true}).select('-password')
        if(!updatedUser){
            return res.send(new ApiError(403,"User Updation Failed!"))
        }
        return res.send(new ApiResponse(updatedUser,200,"User Updated"))
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

const deleteUserProfileService=async(req,res)=>{
    try {
        const userId=req?.user?.id
        const deletedUser=await User.findByIdAndUpdate(userId,{accountStatus:"deactivated"})

        if(!deletedUser){
            return res.send(new ApiError(404,"User Not Exists!"))
        }

        return res.send(new ApiResponse(deletedUser,200,"User Deleted"))
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

export {getAllUsersService,getUserProfileService,updateUserProfileService,deleteUserProfileService}