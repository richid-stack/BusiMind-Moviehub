import {Pool} from "pg";
import type {AssetRecord,IngestResult,VaultKind} from "./domain.js";
import type {VaultRepository} from "./vault.js";
import {expectedVault} from "./vault.js";
export class PostgresVaultRepository implements VaultRepository{
 constructor(private readonly pool:Pool){}
 async ingest(r:AssetRecord):Promise<IngestResult>{
  const vault=expectedVault(r.mediaType);
  if(r.vaultKind!==vault)return{accepted:false,vault,reason:"INVALID_VAULT"};
  if(r.verificationStatus!=="VERIFIED")return{accepted:false,vault,reason:"NOT_VERIFIED"};
  try{
   const q=await this.pool.query(`INSERT INTO media_assets(canonical_id,media_type,vault_kind,title,release_year,season_number,episode_number,source_chat_id,source_message_id,source_bot,filename,mime_type,size_bytes,fingerprint,verification_status)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
    ON CONFLICT(source_chat_id,source_message_id) DO NOTHING RETURNING id`,
   [r.canonicalId,r.mediaType,r.vaultKind,r.title,r.year??null,r.season??null,r.episode??null,r.sourceChatId,r.sourceMessageId,r.sourceBot,r.filename??null,r.mimeType??null,r.sizeBytes??null,r.fingerprint,r.verificationStatus]);
   if(!q.rowCount)return{accepted:false,vault,reason:"DUPLICATE_SOURCE"};
   return{accepted:true,vault,assetId:String(q.rows[0].id)};
  }catch{return{accepted:false,vault,reason:"STORAGE_ERROR"}}
 }
 async getBySource(chatId:string,messageId:number){
  const q=await this.pool.query("SELECT * FROM media_assets WHERE source_chat_id=$1 AND source_message_id=$2",[chatId,messageId]);
  if(!q.rowCount)return undefined;const x=q.rows[0];
  return{canonicalId:x.canonical_id,mediaType:x.media_type,vaultKind:x.vault_kind,title:x.title,year:x.release_year??undefined,season:x.season_number??undefined,episode:x.episode_number??undefined,sourceChatId:x.source_chat_id,sourceMessageId:Number(x.source_message_id),sourceBot:x.source_bot,filename:x.filename??undefined,mimeType:x.mime_type??undefined,sizeBytes:x.size_bytes??undefined,fingerprint:x.fingerprint,verificationStatus:x.verification_status};
 }
 async list(vault:VaultKind){
  const q=await this.pool.query("SELECT * FROM media_assets WHERE vault_kind=$1 ORDER BY created_at DESC",[vault]);
  return q.rows.map(x=>({canonicalId:x.canonical_id,mediaType:x.media_type,vaultKind:x.vault_kind,title:x.title,year:x.release_year??undefined,season:x.season_number??undefined,episode:x.episode_number??undefined,sourceChatId:x.source_chat_id,sourceMessageId:Number(x.source_message_id),sourceBot:x.source_bot,filename:x.filename??undefined,mimeType:x.mime_type??undefined,sizeBytes:x.size_bytes??undefined,fingerprint:x.fingerprint,verificationStatus:x.verification_status}));
 }
}
