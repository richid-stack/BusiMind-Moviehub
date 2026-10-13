import type {AssetRecord,IngestResult,VaultKind,VerifiedAsset} from "./domain.js";
export function expectedVault(type:"MOVIE"|"SERIES"|"EPISODE"):VaultKind{return type==="MOVIE"?"MOVIE_VAULT":"SERIES_VAULT"}
export interface VaultRepository{ingest(record:AssetRecord):Promise<IngestResult>;getBySource(chatId:string,messageId:number):Promise<AssetRecord|undefined>;list(vault:VaultKind):Promise<AssetRecord[]>}
export class InMemoryVaultRepository implements VaultRepository{
 private records=new Map<string,AssetRecord>();private next=1;
 async ingest(r:AssetRecord):Promise<IngestResult>{
  const vault=expectedVault(r.mediaType);if(r.vaultKind!==vault)return{accepted:false,vault,reason:"INVALID_VAULT"};
  if(r.verificationStatus!=="VERIFIED")return{accepted:false,vault,reason:"NOT_VERIFIED"};
  const key=`${r.sourceChatId}:${r.sourceMessageId}`;if(this.records.has(key))return{accepted:false,vault,reason:"DUPLICATE_SOURCE"};
  this.records.set(key,{...r});return{accepted:true,vault,assetId:String(this.next++)};
 }
 async getBySource(chatId:string,messageId:number){const r=this.records.get(`${chatId}:${messageId}`);return r?{...r}:undefined}
 async list(vault:VaultKind){return [...this.records.values()].filter(r=>r.vaultKind===vault).map(r=>({...r}))}
}
export function verifiedToRecord(a:VerifiedAsset):AssetRecord{
 const type=a.evidence.mediaType??a.work.mediaType;
 return{canonicalId:a.work.canonicalId,mediaType:type,vaultKind:expectedVault(a.work.mediaType),title:a.work.title,year:a.work.year,season:a.evidence.season,episode:a.evidence.episode,sourceChatId:a.evidence.chatId,sourceMessageId:a.evidence.messageId,sourceBot:a.evidence.botUsername,filename:a.evidence.filename,mimeType:a.evidence.mimeType,sizeBytes:a.evidence.sizeBytes,fingerprint:a.fingerprint.fingerprint,verificationStatus:"VERIFIED"};
}
