import type {CandidateEvidence,CanonicalWork,VerificationDecision,RequestMediaType} from "./domain.js";
import {titleMatches} from "./normalize.js";
export interface CanonicalResolver{resolve(title:string,mediaType:RequestMediaType,year?:number):CanonicalWork|undefined}
export class InMemoryCanonicalResolver implements CanonicalResolver{
 constructor(private readonly works:CanonicalWork[]){}
 resolve(title:string,mediaType:RequestMediaType,year?:number):CanonicalWork|undefined{
  const found=this.works.filter(w=>w.mediaType===mediaType&&titleMatches(title,w.title,w.alternateTitles??[])&&(year===undefined||w.year===undefined||year===w.year));
  return found.length===1?found[0]:undefined;
 }
}
export function verifyCandidate(work:CanonicalWork,e:CandidateEvidence):VerificationDecision{
 const base={requestedId:work.canonicalId,candidateId:e.candidateId,evidence:e};
 if(e.canonicalId&&e.canonicalId!==work.canonicalId)return {...base,status:"REJECTED",reason:"CANONICAL_ID_MISMATCH",confidence:1};
 if(e.mediaType==="EPISODE"&&work.mediaType==="MOVIE")return {...base,status:"REJECTED",reason:"EPISODE_FOR_MOVIE",confidence:1};
 if(e.mediaType==="SERIES"&&work.mediaType==="MOVIE")return {...base,status:"REJECTED",reason:"SERIES_FOR_MOVIE",confidence:1};
 if(e.mediaType==="MOVIE"&&work.mediaType==="SERIES")return {...base,status:"REJECTED",reason:"MOVIE_FOR_SERIES",confidence:1};
 if(work.mediaType==="MOVIE"&&(e.season!==undefined||e.episode!==undefined))return {...base,status:"REJECTED",reason:"EPISODE_FOR_MOVIE",confidence:1};
 if(e.year!==undefined&&work.year!==undefined&&e.year!==work.year)return {...base,status:"REJECTED",reason:"DIFFERENT_YEAR",confidence:1};
 if(!e.title&&!e.canonicalId)return {...base,status:"UNKNOWN",reason:"INSUFFICIENT_IDENTITY_EVIDENCE",confidence:0};
 if(e.title&&!titleMatches(e.title,work.title,work.alternateTitles??[]))return {...base,status:"REJECTED",reason:"DIFFERENT_WORK",confidence:.99};
 if(e.year===undefined&&work.year!==undefined&&!e.canonicalId)return {...base,status:"UNKNOWN",reason:"INSUFFICIENT_IDENTITY_EVIDENCE",confidence:.5};
 return {...base,status:"VERIFIED",reason:"MATCH",confidence:e.canonicalId?1:.98};
}
