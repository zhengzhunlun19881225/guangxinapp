import {readLocal,saveLocal} from '../data';
export type ImPreferences={notifications:boolean;sound:boolean;alertMode:'vibrate'|'sound-vibrate'};
export const defaultImPreferences:ImPreferences={notifications:true,sound:true,alertMode:'sound-vibrate'};
export function readImPreferences(){return {...defaultImPreferences,...readLocal<Partial<ImPreferences>>('im2-preferences',{})}}
export function saveImPreferences(value:ImPreferences){return saveLocal('im2-preferences',value)}
export type ImAccount={name:string;nickname:string};
export const defaultImAccount:ImAccount={name:'系统管理员',nickname:'系统管理员'};
