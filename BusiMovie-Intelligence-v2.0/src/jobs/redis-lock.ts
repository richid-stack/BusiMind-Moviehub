import Redis from "ioredis";
import {randomUUID} from "node:crypto";
export class RedisLock{
 constructor(private readonly redis:Redis){}
 async withLock<T>(key:string,ttlMs:number,work:()=>Promise<T>):Promise<T|undefined>{
  const token=randomUUID();const ok=await this.redis.set(key,token,"PX",ttlMs,"NX");if(ok!=="OK")return undefined;
  try{return await work()}finally{await this.redis.eval("if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",1,key,token)}
 }
}
