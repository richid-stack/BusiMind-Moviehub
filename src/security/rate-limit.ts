import {AppError} from "./errors.js";
interface Bucket{count:number;resetAt:number}
export class InMemoryRateLimiter{private buckets=new Map<string,Bucket>();constructor(private readonly limit:number,private readonly windowMs:number,private readonly now=()=>Date.now()){}
consume(key:string,cost=1){if(!key||cost<1||!Number.isInteger(cost))throw new AppError("VALIDATION_ERROR","Invalid rate-limit key or cost");const now=this.now();let b=this.buckets.get(key);if(!b||b.resetAt<=now){b={count:0,resetAt:now+this.windowMs};this.buckets.set(key,b)}if(b.count+cost>this.limit)throw new AppError("RATE_LIMITED","Rate limit exceeded",true,{retryAfterMs:b.resetAt-now});b.count+=cost;return{remaining:this.limit-b.count,resetAt:b.resetAt}}
prune(){const now=this.now();for(const [k,b] of this.buckets)if(b.resetAt<=now)this.buckets.delete(k)}}
