import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number
    },
    accountStatus:{
        type:String,
        enum:["activated","deactivated"],
        default:"deactivated"
    },
    role:{
        type:String,
        enum:["passenger","admin"],
        default:"passenger"
    },
    bookingHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Booking"
        }
    ]
}, {timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        console.log("heree")
        return next()
    }
    this.password=await bcrypt.hash(this.password,10)
})

userSchema.methods.passwordCheck=async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateToken=function(){
    return jwt.sign(
        {
            id:this._id,
            email:this.email,
            role:this.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model("User",userSchema)