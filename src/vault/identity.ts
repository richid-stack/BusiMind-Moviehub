import type {CandidateEvidence,CanonicalWork,MediaRequest} from "./domain.js";
import {titleMatches} from "./normalize.js";
export type IdentityResult={status:"VERIFIED";reason:"MATCH"}|{status:"UNKNOWN";reason:"INSUFFICIENT_IDENTITY_EVIDENCE"}|{status:"REJECTED";reason:"CANONICAL_ID_MISMATCH"|"EPISODE_FOR_MOVIE"|"SERIES_FOR_MOVIE"|"MOVIE_FOR_SERIES"|"DIFFERENT_YEAR"|"DIFFERENT_WORK"};
export function verifyCandidate(work:CanonicalWork,e:CandidateEvidence):IdentityResult{
 if(e.canonicalId&&e.canonicalId!==work.canonicalId)return{status:"REJECTED",reason:"CANONICAL_ID_MISMATCH"};
 if(e.mediaType==="EPISODE"&&work.mediaType==="MOVIE")return{status:"REJECTED",reason:"EPISODE_FOR_MOVIE"};
 if(e.mediaType==="SERIES"&&work.mediaType==="MOVIE")return{status:"REJECTED",reason:"SERIES_FOR_MOVIE"};
 if(e.mediaType==="MOVIE"&&work.mediaType==="SERIES")return{status:"REJECTED",reason:"MOVIE_FOR_SERIES"};
 if(work.mediaType==="MOVIE"&&(e.season!==undefined||e.episode!==undefined))return{status:"REJECTED",reason:"EPISODE_FOR_MOVIE"};
 if(e.year!==undefined&&work.year!==undefined&&e.year!==work.year)return{status:"REJECTED",reason:"DIFFERENT_YEAR"};
 if(!e.title&&!e.canonicalId)return{status:"UNKNOWN",reason:"INSUFFICIENT_IDENTITY_EVIDENCE"};
 if(e.title&&!titleMatches(e.title,work.title,work.alternateTitles??[]))return{status:"REJECTED",reason:"DIFFERENT_WORK"};
 if(e.year===undefined&&work.year!==undefined&&!e.canonicalId)return{status:"UNKNOWN",reason:"INSUFFICIENT_IDENTITY_EVIDENCE"};
 return{status:"VERIFIED",reason:"MATCH"};
}
export function toAssetRecord(request:MediaRequest,work:CanonicalWork,e:CandidateEvidence,fingerprint:string){
 const mediaType=e.mediaType??work.mediaType;
 const vaultKind=work.mediaType==="MOVIE"?"MOVIE_VAULT":"SERIES_VAULT";
 return {canonicalId:work.canonicalId,mediaType,vaultKind,title:work.title,year:work.year,season:e.season,episode:e.episode,sourceChatId:e.chatId,sourceMessageId:e.messageId,sourceBot:e.botUsername,filename:e.filename,mimeType:e.mimeType,sizeBytes:e.sizeBytes,fingerprint,verificationStatus:"VERIFIED" as const};
}
