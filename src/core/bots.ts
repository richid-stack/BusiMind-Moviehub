import type {MediaRequest,RequestMediaType} from "./domain.js";
export interface BotProfile{username:string;supportedMedia:RequestMediaType[];priority:number}
export const BOT_PROFILES:BotProfile[]=[
 {username:"@Apple_moviebot",supportedMedia:["MOVIE"],priority:1},
 {username:"@iPapkornDeltaBot",supportedMedia:["MOVIE"],priority:2},
 {username:"@iPapkornEzPzBot",supportedMedia:["MOVIE"],priority:3},
 {username:"@quinsonnbot",supportedMedia:["SERIES"],priority:1}
];
export function botsFor(request:MediaRequest):BotProfile[]{return BOT_PROFILES.filter(b=>b.supportedMedia.includes(request.mediaType)).sort((a,b)=>a.priority-b.priority)}
