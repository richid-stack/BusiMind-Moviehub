import type {CreateJobInput,JobEvent,JobRecord,ClaimedJob} from "./domain.js";
export interface JobStore {
 create(input:CreateJobInput):Promise<{job:JobRecord;created:boolean}>;
 claim(workerId:string,leaseSeconds:number):Promise<ClaimedJob|undefined>;
 heartbeat(jobId:string,workerId:string,leaseSeconds:number):Promise<boolean>;
 succeed(jobId:string,workerId:string,result:Record<string,unknown>):Promise<boolean>;
 failOrRetry(jobId:string,workerId:string,error:string,retryDelaySeconds:number):Promise<"RETRY_WAIT"|"FAILED"|"LEASE_LOST">;
 recoverExpiredLeases():Promise<number>;
 appendEvent(event:JobEvent):Promise<void>;
 events(jobId:string):Promise<JobEvent[]>;
}
