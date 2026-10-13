import type {JobStore} from "./job-store.js";
export interface JobHandler{run(jobId:string,request:unknown):Promise<Record<string,unknown>>}
export class AcquisitionWorker{
 constructor(private readonly store:JobStore,private readonly handler:JobHandler,private readonly workerId:string,private readonly leaseSeconds=60){}
 async runOne():Promise<boolean>{
  const job=await this.store.claim(this.workerId,this.leaseSeconds);if(!job)return false;
  try{const result=await this.handler.run(job.jobId,job.request);const ok=await this.store.succeed(job.jobId,this.workerId,result);if(!ok)await this.store.appendEvent({jobId:job.jobId,eventType:"STALE_WORKER_RESULT_DISCARDED",payload:{workerId:this.workerId}})}
  catch(e){const message=e instanceof Error?e.message:String(e);await this.store.failOrRetry(job.jobId,this.workerId,message,Math.min(300,2**Math.max(0,job.attempt-1)))}
  return true;
 }
}
