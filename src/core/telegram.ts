import type {CandidateEvidence,MediaRequest} from "./domain.js";
export interface TelegramAcquisitionGateway{search(botUsername:string,request:MediaRequest):Promise<CandidateEvidence[]>}
export class MockTelegramGateway implements TelegramAcquisitionGateway{constructor(private readonly responses:Record<string,CandidateEvidence[]>={}){}async search(botUsername:string,_request:MediaRequest):Promise<CandidateEvidence[]>{return this.responses[botUsername]??[]}}
