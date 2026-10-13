import {Pool} from "pg";
import type {CreateJobInput,JobEvent,JobRecord,ClaimedJob} from "./domain.js";
import type {JobStore} from "./job-store.js";
const mapJob=(r:any):JobRecord=>({jobId:r.job_id,request:r.request_json,state:r.state,attempt:r.attempt,maxAttempts:r.max_attempts,availableAt:new Date(r.available_at).toISOString(),leaseOwner:r.lease_owner??undefined,leaseUntil:r.lease_until?new Date(r.lease_until).toISOString():undefined,lastError:r.last_error??undefined});
export class PostgresJobStore implements JobStore{
 constructor(private readonly pool:Pool){}
 async create(i:CreateJobInput){
  const c=await this.pool.connect();try{await c.query("BEGIN");
   const old=await c.query("SELECT j.* FROM idempotency_keys k JOIN acquisition_jobs j ON j.job_id=k.job_id WHERE k.idempotency_key=$1 FOR UPDATE",[i.idempotencyKey]);
   if(old.rowCount){await c.query("COMMIT");return{job:mapJob(old.rows[0]),created:false}}
   const q=await c.query("INSERT INTO acquisition_jobs(job_id,request_json,max_attempts,state) VALUES($1,$2,$3,'QUEUED') RETURNING *",[i.jobId,JSON.stringify(i.request),i.maxAttempts??5]);
   await c.query("INSERT INTO idempotency_keys(idempotency_key,job_id) VALUES($1,$2)",[i.idempotencyKey,i.jobId]);
   await c.query("INSERT INTO acquisition_events(job_id,event_type,payload) VALUES($1,'JOB_CREATED',$2)",[i.jobId,JSON.stringify({idempotencyKey:i.idempotencyKey})]);
   await c.query("COMMIT");return{job:mapJob(q.rows[0]),created:true}
  }catch(e){await c.query("ROLLBACK");throw e}finally{c.release()}
 }
 async claim(workerId:string,leaseSeconds:number):Promise<ClaimedJob|undefined>{
  const c=await this.pool.connect();try{await c.query("BEGIN");
   const q=await c.query(`SELECT * FROM acquisition_jobs WHERE state IN ('QUEUED','RETRY_WAIT') AND available_at<=NOW() ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1`);
   if(!q.rowCount){await c.query("COMMIT");return undefined}
   const r=await c.query(`UPDATE acquisition_jobs SET state='RUNNING',attempt=attempt+1,lease_owner=$2,lease_until=NOW()+($3 * INTERVAL '1 second'),updated_at=NOW() WHERE job_id=$1 RETURNING *`,[q.rows[0].job_id,workerId,leaseSeconds]);
   await c.query("INSERT INTO acquisition_events(job_id,event_type,payload) VALUES($1,'JOB_CLAIMED',$2)",[q.rows[0].job_id,JSON.stringify({workerId,attempt:r.rows[0].attempt})]);
   await c.query("COMMIT");return {...mapJob(r.rows[0]),leaseOwner:workerId,leaseUntil:new Date(r.rows[0].lease_until).toISOString()}
  }catch(e){await c.query("ROLLBACK");throw e}finally{c.release()}
 }
 async heartbeat(jobId:string,workerId:string,leaseSeconds:number){const q=await this.pool.query("UPDATE acquisition_jobs SET lease_until=NOW()+($3 * INTERVAL '1 second'),updated_at=NOW() WHERE job_id=$1 AND lease_owner=$2 AND state='RUNNING' AND lease_until>NOW()",[jobId,workerId,leaseSeconds]);return !!q.rowCount}
 async succeed(jobId:string,workerId:string,result:Record<string,unknown>){const c=await this.pool.connect();try{await c.query("BEGIN");const q=await c.query("UPDATE acquisition_jobs SET state='SUCCEEDED',lease_owner=NULL,lease_until=NULL,updated_at=NOW() WHERE job_id=$1 AND lease_owner=$2 AND state='RUNNING' AND lease_until>NOW() RETURNING job_id",[jobId,workerId]);if(!q.rowCount){await c.query("ROLLBACK");return false}await c.query("INSERT INTO acquisition_events(job_id,event_type,payload) VALUES($1,'JOB_SUCCEEDED',$2)",[jobId,JSON.stringify(result)]);await c.query("COMMIT");return true}catch(e){await c.query("ROLLBACK");throw e}finally{c.release()}}
 async failOrRetry(jobId:string,workerId:string,error:string,delay:number):Promise<"RETRY_WAIT"|"FAILED"|"LEASE_LOST">{const c=await this.pool.connect();try{await c.query("BEGIN");const q=await c.query("SELECT * FROM acquisition_jobs WHERE job_id=$1 AND lease_owner=$2 AND state='RUNNING' AND lease_until>NOW() FOR UPDATE",[jobId,workerId]);if(!q.rowCount){await c.query("ROLLBACK");return"LEASE_LOST"}const r=q.rows[0];const next=r.attempt<r.max_attempts?"RETRY_WAIT":"FAILED";await c.query("UPDATE acquisition_jobs SET state=$2,available_at=NOW()+($3 * INTERVAL '1 second'),last_error=$4,lease_owner=NULL,lease_until=NULL,updated_at=NOW() WHERE job_id=$1",[jobId,next,delay,error]);await c.query("INSERT INTO acquisition_events(job_id,event_type,payload) VALUES($1,$2,$3)",[jobId,next==="FAILED"?"JOB_FAILED":"JOB_RETRY_SCHEDULED",JSON.stringify({error,attempt:r.attempt,delaySeconds:delay})]);await c.query("COMMIT");return next}catch(e){await c.query("ROLLBACK");throw e}finally{c.release()}}
 async recoverExpiredLeases(){const c=await this.pool.connect();try{await c.query("BEGIN");const q=await c.query("SELECT job_id,attempt,max_attempts FROM acquisition_jobs WHERE state='RUNNING' AND lease_until<NOW() FOR UPDATE SKIP LOCKED");for(const r of q.rows){const state=r.attempt<r.max_attempts?"RETRY_WAIT":"FAILED";await c.query("UPDATE acquisition_jobs SET state=$2,lease_owner=NULL,lease_until=NULL,available_at=NOW(),last_error='Worker lease expired',updated_at=NOW() WHERE job_id=$1",[r.job_id,state]);await c.query("INSERT INTO acquisition_events(job_id,event_type,payload) VALUES($1,'LEASE_EXPIRED',$2)",[r.job_id,JSON.stringify({nextState:state,attempt:r.attempt})])}await c.query("COMMIT");return q.rowCount??0}catch(e){await c.query("ROLLBACK");throw e}finally{c.release()}}
 async appendEvent(e:JobEvent){await this.pool.query("INSERT INTO acquisition_events(job_id,event_type,payload) VALUES($1,$2,$3)",[e.jobId,e.eventType,JSON.stringify(e.payload)])}
 async events(jobId:string):Promise<JobEvent[]>{const q=await this.pool.query("SELECT event_type,payload,occurred_at FROM acquisition_events WHERE job_id=$1 ORDER BY event_id",[jobId]);return q.rows.map(r=>({jobId,eventType:r.event_type,payload:r.payload,occurredAt:new Date(r.occurred_at).toISOString()}))}
}
