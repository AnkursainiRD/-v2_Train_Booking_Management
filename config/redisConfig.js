import Redis from 'ioredis'
let redisClient;
const redisConnect=async()=>{

        // if(!redisClient){
            
        //     redisClient=redis.createClient({
        //         url:"redis://:tQKQg5FcDQN1m4gs6Za7S11G8hocygoK@redis-14467.c89.us-east-1-3.ec2.redns.redis-cloud.com:14467",
        //         password:"tQKQg5FcDQN1m4gs6Za7S11G8hocygoK",
        //         port:14467
        //         })
            
        //     redisClient.on("connect",()=>{console.log("---Redis Server Started---")})
        //     redisClient.on('error', (err) => {console.error('Redis error:', err);})

        //     if (!redisClient || redisClient.status !== 'ready') {
        //         return console.log("Redis client is not ready or closed");
        //     }
        // }

      try {
          if (!redisClient) {
              redisClient = new Redis();
      
              redisClient.on('connect', () => {
                  console.log('Connected to Redis',redisClient.status);
              });
      
              redisClient.on('error', (err) => {
                  console.error('Redis connection error:', err);
                  process.exit(1)
              });
             
          }
          if (!redisClient || redisClient.status !== 'ready') {
              console.log("Redis client is not ready or closed");
         }

         
          return redisClient
      } catch (error) {
            console.log(error)
            process.exit(1)
      }
}
export {redisConnect,redisClient}