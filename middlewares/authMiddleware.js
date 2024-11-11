import ApiError from "../utils/errorResponse.js";
import jwt from 'jsonwebtoken'

const auth=async(req,res,next)=>{
    try {
        const token=req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            return res.send(new ApiError(404,"Token not found! Try to login first"))
        }
        const decodedToken=jwt.verify(token,process.env.JWT_SECRET)
        if(!decodedToken){
            return res.send(new ApiError(403,"Invalid Token!"))
        }
        req.user=decodedToken
        next()
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}

const isAdmin=async(req,res,next)=>{
    try {
        if(req?.user?.role!="admin"){
            return res.send(new ApiError(403,"Protected Routes Only for Admin! Unauthorized Access!"))
        }
        next()
    } catch (error) {
        console.log(error)
        return res.send(new ApiError(500,{errors:error?.message}))
    }
}


export {auth,isAdmin}