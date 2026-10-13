import {redact} from "./redaction.js";
type Level="debug"|"info"|"warn"|"error";
const rank:Record<Level,number>={debug:10,info:20,warn:30,error:40};
export class Logger{constructor(private readonly minLevel:Level="info",private readonly sink:(line:string)=>void=(line)=>process.stdout.write(line+"\n")){}
log(level:Level,event:string,fields:Record<string,unknown>={}){if(rank[level]<rank[this.minLevel])return;this.sink(JSON.stringify({timestamp:new Date().toISOString(),level,event,fields:redact(fields)}))}
info(event:string,fields?:Record<string,unknown>){this.log("info",event,fields)}warn(event:string,fields?:Record<string,unknown>){this.log("warn",event,fields)}error(event:string,fields?:Record<string,unknown>){this.log("error",event,fields)}}
