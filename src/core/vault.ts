import type {VerifiedAsset,RequestMediaType} from "./domain.js";
export type VaultKind="MOVIE_VAULT"|"SERIES_VAULT";
export function vaultFor(t:RequestMediaType):VaultKind{return t==="MOVIE"?"MOVIE_VAULT":"SERIES_VAULT"}
export class VaultIndex{private readonly assets=new Map<string,VerifiedAsset>();ingest(a:VerifiedAsset):{accepted:boolean;vault:VaultKind;reason?:string}{const vault=vaultFor(a.work.mediaType),key=a.work.canonicalId+":"+a.fingerprint.fingerprint;if(this.assets.has(key))return{accepted:false,vault,reason:"DUPLICATE_ASSET"};this.assets.set(key,a);return{accepted:true,vault}}all():VerifiedAsset[]{return [...this.assets.values()]}}
