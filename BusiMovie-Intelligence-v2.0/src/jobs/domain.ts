export type JobState="QUEUED"|"RUNNING"|"RETRY_WAIT"|"SUCCEEDED"|"FAILED"|"CANCELLED";
export interface JobRecord {jobId:string;request:unknown;state:JobState;attempt:number;maxAttempts:number;availableAt:string;leaseOwner?:string;leaseUntil?:string;lastError?:string}
export interface JobEvent {jobId:string;eventType:string;payload:Record<string,unknown>;occurredAt?:string}
export interface CreateJobInput {jobId:string;request:unknown;idempotencyKey:string;maxAttempts?:number}
export interface ClaimedJob extends JobRecord {leaseOwner:string;leaseUntil:string}
