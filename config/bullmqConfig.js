import { Queue } from "bullmq";
import { redisClient } from "./redisConfig.js";

const notificationQueue=new Queue('notificationQueue',{
    connection:redisClient
})


const addNotificationJob=async(user,template)=>{
    await notificationQueue.add('sendNotification',{user,template})
    // await checkDelayJobs()
    console.log("Notification added to queue")
}

const checkDelayJobs=async () => {
    const waitingJobs = await notificationQueue.getJobs(['waiting']); // Jobs waiting to be processed
    const activeJobs = await notificationQueue.getJobs(['active']);   // Jobs currently being processed
    const completedJobs = await notificationQueue.getJobs(['completed']); // Successfully processed jobs
    const failedJobs = await notificationQueue.getJobs(['failed']);   // Jobs that failed
  
    console.log('Waiting Jobs:', waitingJobs);
    console.log('Active Jobs:', activeJobs);
    console.log('Completed Jobs:', completedJobs);
    console.log('Failed Jobs:', failedJobs);
  };

export default addNotificationJob