export type Progress={version:number;xp:number;completed:string[];cards:Record<string,{interval:number;streak:number;lapses:number;due:number;last:number}>;activity:{date:string;xp:number;lesson:string;minutes?:number}[];dailyGoal:number;bookmarks:string[]};
export function initialProgress():Progress;
export function today(date?:Date):string;
export function dueCards(progress:Progress,now?:number):string[];
export function recordAnswer(progress:Progress,id:string,correct:boolean,now?:number):Progress;
export function finishLesson(progress:Progress,id:string,answers:{id:string;correct:boolean}[],now?:number,minutes?:number):Progress;
export function streakDays(progress:Progress,now?:Date):number;
export function shiftDay(day:string,delta:number):string;
export function validateProgress(p:unknown):p is Progress;

export function studyMinutes(progress:Progress,date?:string):number;
