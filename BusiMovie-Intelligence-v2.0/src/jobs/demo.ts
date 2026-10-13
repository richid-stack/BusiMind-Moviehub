import {Pool} from "pg";import Redis from "ioredis";import {PostgresJobStore} from "./postgres-job-store.js";import {RedisLock} from "./redis-lock.js";
const pool=new Pool({connectionString:process.env.DATABASE_URL});const redis=new Redis(process.env.REDIS_URL??"redis://localhost:6379");
const store=new PostgresJobStore(pool);const lock=new RedisLock(redis);
const job=await store.create({jobId:`demo-${Date.now()}`,idempotencyKey:"demo-request-unique-key",request:{title:"The Incredible Hulk",year:2008,mediaType:"MOVIE"}});
console.log("Job:",job);
await lock.withLock(`job:${job.job.jobId}`,15000,async()=>{await store.appendEvent({jobId:job.job.jobId,eventType:"DEMO_LOCK_ACQUIRED",payload:{worker:process.env.WORKER_ID??"worker-local"}})});
console.log("Events:",await store.events(job.job.jobId));await redis.quit();await pool.end();
