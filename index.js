import app from "./app.js";
import DatabaseConnect from "./config/databaseConfig.js";
import { redisConnect } from "./config/redisConfig.js";
import dotenv from "dotenv"
dotenv.config({path:"./.env"})

DatabaseConnect()
.then(()=>{
    redisConnect()
    .then(()=>app.listen(process.env.PORT || 4000,()=>console.log("--Server Started--")))
})
.catch((err)=>console.log(err))