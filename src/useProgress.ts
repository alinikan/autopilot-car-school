import {useCallback,useEffect,useRef,useState} from 'react';
import type {User} from '@supabase/supabase-js';
import {initialProgress,validateProgress} from './learning.mjs';
import type {Progress} from './learning.mjs';
import {supabase} from './supabase';
const read=(key:string)=>{try{const p=JSON.parse(localStorage.getItem(key)||'null');return validateProgress(p)?p:initialProgress()}catch{return initialProgress()}};
const modified=(key:string)=>{try{return Number(localStorage.getItem(key+':modified')||0)}catch{return 0}};
function persist(key:string,state:Progress,time=Date.now()){localStorage.setItem(key,JSON.stringify(state));localStorage.setItem(key+':modified',String(time))}
export function useProgress(){
 const [progress,setProgress]=useState<Progress>(()=>read('autopilot:guest'));const stateRef=useRef(progress);
 const [user,setUser]=useState<User|null>(null);const userRef=useRef<User|null>(null);
 const [status,setStatus]=useState('Saved on this device');const [ready,setReady]=useState(!supabase);
 const cloudReady=useRef(false);const revision=useRef(0);const generation=useRef(0);
 const update=useCallback((value:Progress|((p:Progress)=>Progress))=>{
  const next=typeof value==='function'?value(stateRef.current):value;stateRef.current=next;revision.current++;
  try{persist(userRef.current?'autopilot:'+userRef.current.id:'autopilot:guest',next);setStatus(userRef.current?'Saving to your account…':'Saved on this device')}catch{setStatus('Storage full — export your progress')}
  setProgress(next);
 },[]);
 const load=useCallback(async(nextUser:User|null)=>{
  const currentGeneration=++generation.current;const startingRevision=revision.current;userRef.current=nextUser;setUser(nextUser);cloudReady.current=false;setReady(false);
  if(!nextUser||!supabase){const state=read('autopilot:guest');stateRef.current=state;setProgress(state);setStatus('Saved on this device');setReady(true);return}
  setStatus('Loading your progress…');const key='autopilot:'+nextUser.id;
  const {data,error}=await supabase.from('learning_progress').select('state,updated_at').eq('user_id',nextUser.id).maybeSingle();
  if(generation.current!==currentGeneration)return;
  const local=read(key);
  if(error){const fallback=modified(key)>0?local:read('autopilot:guest');stateRef.current=fallback;setProgress(fallback);setStatus('Cloud unavailable — changes stay on this device');setReady(true);return}
  const useLocal=modified(key)>(data?Date.parse(data.updated_at):0);
  const state=revision.current!==startingRevision?stateRef.current:useLocal?local:data&&validateProgress(data.state)?data.state:modified(key)>0?local:read('autopilot:guest');
  stateRef.current=state;setProgress(state);try{persist(key,state,!useLocal&&data?Date.parse(data.updated_at):Date.now())}catch{/* Cloud saving still works if device storage is unavailable. */}
  cloudReady.current=true;setReady(true);setStatus('Synced to your account');
  if(!data||useLocal){const {error:saveError}=await supabase.from('learning_progress').upsert({user_id:nextUser.id,state});if(generation.current===currentGeneration&&saveError)setStatus('Cloud unavailable — changes stay on this device')}
 },[]);
 useEffect(()=>{if(!supabase)return;let active=true;supabase.auth.getSession().then(({data})=>{if(active)void load(data.session?.user||null)});const {data}=supabase.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_IN'||event==='SIGNED_OUT')setTimeout(()=>{if(active)void load(session?.user||null)},0)});return()=>{active=false;data.subscription.unsubscribe()}},[load]);
 useEffect(()=>{if(!supabase||!user||!ready||!cloudReady.current||revision.current===0)return;const current=revision.current;const gen=generation.current;const timeout=setTimeout(async()=>{if(!supabase)return;const {error}=await supabase.from('learning_progress').upsert({user_id:user.id,state:progress});if(current===revision.current&&gen===generation.current)setStatus(error?'Cloud unavailable — changes stay on this device':'Synced to your account')},500);return()=>clearTimeout(timeout)},[progress,user,ready]);
 const retry=useCallback(async()=>{const activeUser=userRef.current;if(!supabase||!activeUser)return;if(!cloudReady.current){await load(activeUser);return}const gen=generation.current;const {error}=await supabase.from('learning_progress').upsert({user_id:activeUser.id,state:stateRef.current});if(gen!==generation.current)return;if(!error){cloudReady.current=true;setStatus('Synced to your account')}else setStatus('Cloud unavailable — changes stay on this device')},[load]);
 useEffect(()=>{const online=()=>void retry();window.addEventListener('online',online);return()=>window.removeEventListener('online',online)},[retry]);
 return {progress,update,user,status,ready,retry};
}
