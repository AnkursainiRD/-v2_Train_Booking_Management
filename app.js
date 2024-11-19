import cookieParser from 'cookie-parser'
import ApiResponse from './utils/apiResponse.js'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express()

app.use(express.json())
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send(new ApiResponse("This is Health Check",200))
})

app.get("/py",(req,res)=>{
    res.sendFile(path.join(__dirname, 'static', 'home.html'));
})

import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"
import trainRoutes from "./routes/trainRoutes.js"
import scheduleRoutes from "./routes/scheduleRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"

app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/user",userRoutes)
app.use("/api/v1/booking",bookingRoutes)
app.use("/api/v1/train",trainRoutes)
app.use("/api/v1/schedule",scheduleRoutes)
app.use("/api/v1/payment",paymentRoutes)

export default app;