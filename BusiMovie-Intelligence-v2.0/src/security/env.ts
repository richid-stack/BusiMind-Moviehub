import {AppError} from "./errors.js";
export function requireEnv(name:string,env:NodeJS.ProcessEnv=process.env){const v=env[name]?.trim();if(!v)throw new AppError("VALIDATION_ERROR",`Missing required environment variable: ${name}`);return v}
export function parseLogLevel(v=process.env.LOG_LEVEL):"debug"|"info"|"warn"|"error"{return v==="debug"||v==="info"||v==="warn"||v==="error"?v:"info"}
