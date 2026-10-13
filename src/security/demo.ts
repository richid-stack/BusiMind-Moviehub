import {Logger} from "./logger.js";import {validateMediaRequest} from "./validation.js";import {InMemoryRateLimiter} from "./rate-limit.js";
const logger=new Logger("info");const limiter=new InMemoryRateLimiter(5,60000);
const request=validateMediaRequest({title:"The Incredible Hulk",year:2008,mediaType:"MOVIE"});
logger.info("request_validated",{requestId:"demo",title:request.title,session:"should-never-be-logged"});
console.log("rate-limit",limiter.consume("demo-user"));