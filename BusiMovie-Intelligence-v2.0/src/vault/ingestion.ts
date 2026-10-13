import type {CandidateEvidence,CanonicalWork,MediaRequest,VerifiedAsset,IngestResult} from "./domain.js";
import {verifyCandidate} from "./identity.js";import {fingerprintTelegramAsset} from "./fingerprint.js";import type {VaultRepository} from "./vault.js";import {verifiedToRecord} from "./vault.js";
export class IngestionService{
 constructor(private readonly vaults:VaultRepository){}
 async accept(request:MediaRequest,work:CanonicalWork,evidence:CandidateEvidence):Promise<IngestResult>{
  const decision=verifyCandidate(work,evidence);const vault=work.mediaType==="MOVIE"?"MOVIE_VAULT":"SERIES_VAULT";
  if(decision.status!=="VERIFIED")return{accepted:false,vault,reason:"NOT_VERIFIED"};
  const asset:VerifiedAsset={request,work,evidence,fingerprint:fingerprintTelegramAsset({chatId:evidence.chatId,messageId:evidence.messageId,sizeBytes:evidence.sizeBytes,mimeType:evidence.mimeType,filename:evidence.filename}),state:"VERIFIED"};
  return this.vaults.ingest(verifiedToRecord(asset));
 }
}
