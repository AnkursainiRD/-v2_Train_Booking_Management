import { Worker } from "bullmq";
import { redisClient } from "../config/redisConfig.js";
import mailSenderService from "../utils/mailSender.js";


const notificationWorker=new Worker('notificationQueue',async(job)=>{
    const {user,template}=job.data
    console.log("At worker",job.data)

    const notification=await mailSenderService(user?.email,template)
},{
    connection: {
      host: 'localhost',
      port: 6379,
    },
  })


notificationWorker.on('completed',(job)=>{
    console.log("Job Completed:",job.id)
})

notificationWorker.on('failed',(job,err)=>{
    console.log("Job failed:",job.id,err.message)
})


