import {createHash} from "node:crypto";
import type {AssetFingerprint} from "./domain.js";
export function fingerprintTelegramAsset(i:Omit<AssetFingerprint,"fingerprint">):AssetFingerprint{const s=[i.chatId,String(i.messageId),String(i.sizeBytes??""),i.mimeType??"",i.filename??""].join("|");return{...i,fingerprint:createHash("sha256").update(s).digest("hex")}}
