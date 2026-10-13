export type ErrorCode="VALIDATION_ERROR"|"AUTH_ERROR"|"RATE_LIMITED"|"TELEGRAM_TIMEOUT"|"TELEGRAM_REJECTED"|"IDENTITY_REJECTED"|"STORAGE_ERROR"|"INTERNAL_ERROR";
export class AppError extends Error {constructor(public readonly code:ErrorCode,message:string,public readonly retryable=false,public readonly safeDetails?:Record<string,string|number|boolean>){super(message);this.name="AppError"}}
export function safeErrorCode(e:unknown):ErrorCode {return e instanceof AppError?e.code:"INTERNAL_ERROR"}
