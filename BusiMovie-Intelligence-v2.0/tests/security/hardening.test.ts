import {describe,it,expect} from "vitest";import {validateMediaRequest,validateTelegramReference} from "../src/validation.js";import {redact} from "../src/redaction.js";import {InMemoryRateLimiter} from "../src/rate-limit.js";import {Logger} from "../src/logger.js";
describe("V1.9 security and validation",()=>{
it("rejects movie season metadata",()=>expect(()=>validateMediaRequest({title:"Hulk",mediaType:"MOVIE",season:1})).toThrow());
it("rejects invalid years",()=>expect(()=>validateMediaRequest({title:"Hulk",mediaType:"MOVIE",year:1000})).toThrow());
it("validates Telegram references",()=>expect(validateTelegramReference("-100123",4)).toEqual({chatId:"-100123",messageId:4}));
it("redacts session-like keys",()=>expect(redact({session:"secret-session",apiKey:"abc",title:"Hulk"})).toEqual({session:"[REDACTED]",apiKey:"[REDACTED]",title:"Hulk"}));
it("limits requests and resets after window",()=>{let now=100;const l=new InMemoryRateLimiter(2,1000,()=>now);l.consume("x");l.consume("x");expect(()=>l.consume("x")).toThrow();now=1200;expect(l.consume("x").remaining).toBe(1)});
it("never logs secret fields",()=>{let line="";const logger=new Logger("info",s=>line=s);logger.info("test",{session:"top-secret",title:"Hulk"});expect(line).not.toContain("top-secret");expect(line).toContain("[REDACTED]")});
});