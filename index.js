import app from "./app.js";
import DatabaseConnect from "./config/databaseConfig.js";
import { redisConnect } from "./config/redisConfig.js";
import dotenv from "dotenv"
// import './utils/cronJobs.js'
import { listenForExpiry } from "./utils/releaseSeatHandller.js";
dotenv.config({path:"./.env"})

const port=process.env.PORT || 4000
// DatabaseConnect()
// .then(()=>{
//     redisConnect()
//     .then(()=>app.listen(process.env.PORT || 4000,()=>console.log("--Server Started--")))
// })

Promise.all([DatabaseConnect(), redisConnect()])
  .then(() => {
    listenForExpiry()
    app.listen(port, () => console.log("--Server Started--",port));
  })
  .catch((err) => console.log(err));
