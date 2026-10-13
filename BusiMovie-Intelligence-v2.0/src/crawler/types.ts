export type MediaKind="MOVIE"|"SERIES";
export type SurfaceKind="SEARCH_RESULTS"|"MEDIA_DETAIL"|"SEASON_SELECTOR"|"EPISODE_SELECTOR"|"QUALITY_SELECTOR"|"DOWNLOAD_SURFACE"|"PAGINATION"|"NO_RESULT"|"ERROR_SURFACE"|"UNKNOWN";
export type ActionKind="SELECT_MEDIA"|"SELECT_SEASON"|"SELECT_EPISODE"|"SELECT_QUALITY"|"DOWNLOAD"|"NEXT_PAGE"|"PREVIOUS_PAGE"|"RETRY_SEARCH"|"NOOP";
export interface BotProfile{username:string;allowedKinds:MediaKind[];priority:number;capabilities:Partial<Record<ActionKind,number>>;successes:number;failures:number;lastObservedAt?:string}
export interface SurfaceButton{text:string;callbackData?:string;row?:number;column?:number}
export interface SurfaceObservation{botUsername:string;chatId:string;messageId:number;text:string;buttons:SurfaceButton[];observedAt:string;mediaKind?:MediaKind;surfaceHint?:SurfaceKind}
export interface PlannedAction{kind:ActionKind;button?:SurfaceButton;score:number;reason:string}
export interface MissionState{missionId:string;mediaKind:MediaKind;botUsername:string;surface:SurfaceKind;visitedKeys:string[];actionsTaken:number;maxActions:number;maxPages:number;pagesVisited:number;status:"ACTIVE"|"COMPLETE"|"FAILED"|"BUDGET_EXHAUSTED";lastError?:string}