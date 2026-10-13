import type {MissionEvent} from "./domain.js";
export class EventLog{private readonly records:MissionEvent[]=[];append(e:MissionEvent):void{this.records.push(e)}all():MissionEvent[]{return [...this.records]}}
