import redis from 'ioredis'
import {promisify} from 'util'

const redisClient=redis.createClient({
   host:process.env.REDIS_HOST,
   password:process.env.REDIS_PASSWORD,
   port:process.env.REDIS_PORT
});
const setAsync= promisify(redisClient.set).bind(redisClient)
const delAsync= promisify(redisClient.del).bind(redisClient)

const AquireSeatLock=async(trainId,scheduleId,seatNumber,journeyDate,userId)=>{
    const lockKey=`lock:seat:${trainId}=${scheduleId}=${seatNumber}=${journeyDate}=${userId}`
    const lockTime=20000;
    const lock= await setAsync(lockKey, 'locked', 'NX', 'PX', lockTime)
    console.log('lokced for',seatNumber,lock)

    if(lock === 'OK'){
        return true
    }else{
        return false
    }
}

export  {AquireSeatLock,setAsync,delAsync};