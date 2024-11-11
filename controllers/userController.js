import {getAllUsersService,getUserProfileService,updateUserProfileService,deleteUserProfileService } from "../services/userService.js"; 

const allUsersController=async(req,res)=>{
    await getAllUsersService(req,res)
}

const getUserController=async(req,res)=>{
    await getUserProfileService(req,res)
}

const updateUserController=async(req,res)=>{
    await updateUserProfileService(req,res)
}

const deleteUserController=async(req,res)=>{
    await deleteUserProfileService(req,res)
}

export {allUsersController,getUserController,updateUserController,deleteUserController}