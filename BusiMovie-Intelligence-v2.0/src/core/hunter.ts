import type {MediaRequest,VerificationReason} from "./domain.js";import {botsFor} from "./bots.js";import {EventLog} from "./events.js";import type {CanonicalResolver} from "./identity.js";import {verifyCandidate} from "./identity.js";import type {TelegramAcquisitionGateway} from "./telegram.js";import {AcquisitionVerifier} from "./pipeline.js";
export interface HuntResult{status:"ACQUIRED"|"NOT_FOUND"|"REJECTED";bot?:string;reason?:string;vault?:"MOVIE_VAULT"|"SERIES_VAULT"}
export class AcquisitionHunter{
 constructor(private readonly resolver:CanonicalResolver,private readonly gateway:TelegramAcquisitionGateway,private readonly verifier:AcquisitionVerifier,private readonly log=new EventLog()){}
 async hunt(request:MediaRequest):Promise<HuntResult>{
  const work=this.resolver.resolve(request.title,request.mediaType,request.year);if(!work)return{status:"REJECTED",reason:"CANONICAL_WORK_NOT_RESOLVED_OR_AMBIGUOUS"};
  const allowed=botsFor(request);if(!allowed.length)return{status:"REJECTED",reason:"NO_BOT_SUPPORTS_MEDIA_TYPE"};
  this.log.append({type:"MISSION_CREATED",requestId:request.requestId,mediaType:request.mediaType});
  for(let i=0;i<allowed.length;i++){const bot=allowed[i];this.log.append({type:"BOT_SELECTED",requestId:request.requestId,bot:bot.username,attempt:i+1});const candidates=await this.gateway.search(bot.username,request);
   for(const c of candidates){this.log.append({type:"CANDIDATE_OBSERVED",requestId:request.requestId,bot:bot.username,candidateId:c.candidateId});const d=verifyCandidate(work,c);if(d.status!=="VERIFIED"){this.log.append({type:"CANDIDATE_REJECTED",requestId:request.requestId,bot:bot.username,reason:d.reason});continue}
    const result=this.verifier.verifyAndIngest(request,work,c);if(result.verified){this.log.append({type:"ASSET_INGESTED",requestId:request.requestId,bot:bot.username,canonicalId:work.canonicalId,vault:result.vault!});return{status:"ACQUIRED",bot:bot.username,vault:result.vault}}
    this.log.append({type:"CANDIDATE_REJECTED",requestId:request.requestId,bot:bot.username,reason:result.reason as VerificationReason});
   }this.log.append({type:"BOT_EXHAUSTED",requestId:request.requestId,bot:bot.username});
  }return{status:"NOT_FOUND",reason:"ALL_ALLOWED_BOTS_EXHAUSTED"};
 }
 eventLog():EventLog{return this.log}
}
