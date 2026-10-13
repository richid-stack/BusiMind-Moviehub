export function normalizeTitle(value:string):string{return value.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g," and ").replace(/[^a-z0-9]+/g," ").trim().replace(/\s+/g," ")}
export function titleMatches(candidate:string,requested:string,alternates:string[]=[]):boolean{const n=normalizeTitle(candidate);return [requested,...alternates].map(normalizeTitle).includes(n)}
