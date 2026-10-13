import {InMemoryVaultRepository} from "./vault.js";import {IngestionService} from "./ingestion.js";
const work={canonicalId:"tmdb:1726",mediaType:"MOVIE" as const,title:"The Incredible Hulk",normalizedTitle:"the incredible hulk",year:2008};
const request={requestId:"demo",title:work.title,mediaType:"MOVIE" as const,year:2008};
const evidence={candidateId:"demo-asset",source:"TELEGRAM" as const,botUsername:"@iPapkornDeltaBot",chatId:"-100200",messageId:42,title:work.title,year:2008,mediaType:"MOVIE" as const,filename:"The.Incredible.Hulk.2008.1080p.mkv",sizeBytes:1000000,rawLabels:["1080p"]};
const repo=new InMemoryVaultRepository();const service=new IngestionService(repo);console.log(await service.accept(request,work,evidence));console.log(await repo.list("MOVIE_VAULT"));
