import {describe,it,expect} from "vitest";
type State="QUEUED"|"RUNNING"|"RETRY_WAIT"|"SUCCEEDED"|"FAILED";
function retryState(attempt:number,max:number):State{return attempt<max?"RETRY_WAIT":"FAILED"}
describe("V1.7 retry policy",()=>{
it("retries while attempts remain",()=>expect(retryState(1,5)).toBe("RETRY_WAIT"));
it("fails when attempt budget is exhausted",()=>expect(retryState(5,5)).toBe("FAILED"));
it("keeps retry policy bounded",()=>expect(retryState(8,5)).toBe("FAILED"));
});
