import type {BotProfile,MediaKind} from "./types.js";
export const DEFAULT_BOTS:BotProfile[]=[
{username:"@Apple_moviebot",allowedKinds:["MOVIE"],priority:1,capabilities:{SELECT_MEDIA:.8,SELECT_QUALITY:.7,DOWNLOAD:.8,NEXT_PAGE:.6,RETRY_SEARCH:.6},successes:0,failures:0},
{username:"@iPapkornDeltaBot",allowedKinds:["MOVIE"],priority:2,capabilities:{SELECT_MEDIA:.7,SELECT_QUALITY:.7,DOWNLOAD:.7,NEXT_PAGE:.5,RETRY_SEARCH:.6},successes:0,failures:0},
{username:"@iPapkornEzPzBot",allowedKinds:["MOVIE"],priority:3,capabilities:{SELECT_MEDIA:.6,SELECT_QUALITY:.6,DOWNLOAD:.6,NEXT_PAGE:.5,RETRY_SEARCH:.5},successes:0,failures:0},
{username:"@quinsonnbot",allowedKinds:["SERIES"],priority:1,capabilities:{SELECT_MEDIA:.8,SELECT_SEASON:.8,SELECT_EPISODE:.8,SELECT_QUALITY:.7,DOWNLOAD:.8,NEXT_PAGE:.6,RETRY_SEARCH:.6},successes:0,failures:0}];
export class BotRegistry{
private profiles=new Map(DEFAULT_BOTS.map(p=>[p.username,structuredClone(p)]));
get(u:string){const p=this.profiles.get(u);return p?structuredClone(p):undefined}
allowed(k:MediaKind){return [...this.profiles.values()].filter(p=>p.allowedKinds.includes(k)).sort((a,b)=>a.priority-b.priority).map(p=>structuredClone(p))}
assertAllowed(u:string,k:MediaKind){return this.profiles.get(u)?.allowedKinds.includes(k)??false}
updateCapability(u:string,a:string,ok:boolean){const p=this.profiles.get(u);if(!p)return false;const key=a as keyof typeof p.capabilities;const old=p.capabilities[key]??.5;p.capabilities[key]=Math.max(.05,Math.min(.98,old*.8+(ok?1:0)*.2));if(ok)p.successes++;else p.failures++;p.lastObservedAt=new Date().toISOString();return true}
}