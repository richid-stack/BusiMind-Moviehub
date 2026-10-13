export type MediaType="MOVIE"|"SERIES"|"EPISODE";
export type RequestMediaType="MOVIE"|"SERIES";
export type IdentityStatus="VERIFIED"|"UNKNOWN"|"REJECTED";
export type VerificationReason="MATCH"|"MEDIA_TYPE_MISMATCH"|"DIFFERENT_WORK"|"DIFFERENT_YEAR"|"EPISODE_FOR_MOVIE"|"SERIES_FOR_MOVIE"|"MOVIE_FOR_SERIES"|"AMBIGUOUS_TITLE"|"INSUFFICIENT_IDENTITY_EVIDENCE"|"CANONICAL_ID_MISMATCH"|"DUPLICATE_ASSET";
export interface MediaRequest {requestId:string;title:string;mediaType:RequestMediaType;year?:number;season?:number;episode?:number;quality?:string}
export interface CanonicalWork {canonicalId:string;mediaType:RequestMediaType;title:string;normalizedTitle:string;year?:number;alternateTitles?:string[];franchiseId?:string;parentSeriesId?:string}
export interface CandidateEvidence {candidateId:string;source:"TELEGRAM";botUsername:string;chatId:string;messageId:number;title?:string;year?:number;mediaType?:MediaType;canonicalId?:string;season?:number;episode?:number;filename?:string;mimeType?:string;sizeBytes?:number;rawLabels:string[]}
export interface VerificationDecision {status:IdentityStatus;reason:VerificationReason;confidence:number;requestedId:string;candidateId?:string;evidence?:CandidateEvidence}
export interface AssetFingerprint {fingerprint:string;chatId:string;messageId:number;sizeBytes?:number;mimeType?:string;filename?:string}
export interface VerifiedAsset {request:MediaRequest;work:CanonicalWork;evidence:CandidateEvidence;fingerprint:AssetFingerprint}
export type MissionEvent={type:"MISSION_CREATED";requestId:string;mediaType:RequestMediaType}|{type:"BOT_SELECTED";requestId:string;bot:string;attempt:number}|{type:"CANDIDATE_OBSERVED";requestId:string;bot:string;candidateId:string}|{type:"CANDIDATE_REJECTED";requestId:string;bot:string;reason:VerificationReason}|{type:"ASSET_INGESTED";requestId:string;bot:string;canonicalId:string;vault:"MOVIE_VAULT"|"SERIES_VAULT"}|{type:"BOT_EXHAUSTED";requestId:string;bot:string};
