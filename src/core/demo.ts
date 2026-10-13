import {InMemoryCanonicalResolver} from "./identity.js";import {AcquisitionVerifier} from "./pipeline.js";import {VaultIndex} from "./vault.js";import {MockTelegramGateway} from "./telegram.js";import {AcquisitionHunter} from "./hunter.js";
const work={canonicalId:"tmdb:1726",mediaType:"MOVIE" as const,title:"The Incredible Hulk",normalizedTitle:"the incredible hulk",year:2008};
const request={requestId:"demo-1",title:"The Incredible Hulk",mediaType:"MOVIE" as const,year:2008};
const gateway=new MockTelegramGateway({
 "@Apple_moviebot":[{candidateId:"wrong-series",source:"TELEGRAM",botUsername:"@Apple_moviebot",chatId:"100",messageId:10,title:"The Incredible Hulk",year:2008,mediaType:"SERIES",rawLabels:["series"]}],
 "@iPapkornDeltaBot":[{candidateId:"right-movie",source:"TELEGRAM",botUsername:"@iPapkornDeltaBot",chatId:"200",messageId:20,title:"The Incredible Hulk",year:2008,mediaType:"MOVIE",filename:"The.Incredible.Hulk.2008.1080p.mkv",sizeBytes:1000,rawLabels:["1080p"]}]
});
const hunter=new AcquisitionHunter(new InMemoryCanonicalResolver([work]),gateway,new AcquisitionVerifier(new VaultIndex()));console.log(await hunter.hunt(request));console.log(hunter.eventLog().all());
