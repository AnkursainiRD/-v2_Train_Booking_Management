import redis from 'ioredis'
import {promisify} from 'util'

const redisClient=redis.createClient({
   host:process.env.REDIS_HOST,
   password:process.env.REDIS_PASSWORD,
   port:process.env.REDIS_PORT
});
const setAsync= promisify(redisClient.set).bind(redisClient)
const delAsync= promisify(redisClient.del).bind(redisClient)

const AquireSeatLock=async(trainId,scheduleId,seatNumber)=>{
    const lockKey=`lock:seat:${trainId}:${scheduleId}:${seatNumber}`
    const lockTime=10000;
    const lock= await setAsync(lockKey, 'locked', 'NX', 'PX', lockTime)
    console.log(lock)

    if(lock === 'OK'){
        return true
    }else{
        return false
    }
}

export  {AquireSeatLock,setAsync,delAsync};