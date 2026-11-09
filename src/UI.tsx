import {useRef} from 'react';
import type {ReactNode} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import {X} from 'lucide-react';
import {motion,useReducedMotion} from 'motion/react';

export function Modal({close,title,children,wide=false,photo=false}:{close:()=>void;title:string;children:ReactNode;wide?:boolean;photo?:boolean}){
 const opener=useRef(document.activeElement as HTMLElement|null);
 return <Dialog.Root open onOpenChange={open=>{if(!open)close()}}><Dialog.Portal><Dialog.Overlay className={`modal-backdrop${photo?' photo-overlay':''}`}/><Dialog.Content className={`modal${wide?' wide':''}${photo?' photo-modal':''}`} aria-describedby={undefined} onCloseAutoFocus={event=>{event.preventDefault();opener.current?.focus()}}><div className="modal-header"><Dialog.Title>{title}</Dialog.Title><Dialog.Close className="icon-button" aria-label="Close dialog"><X size={20}/></Dialog.Close></div>{children}</Dialog.Content></Dialog.Portal></Dialog.Root>;
}
export function PageTransition({children,view}:{children:ReactNode;view:string}){const reduce=useReducedMotion();return <motion.main key={view} id="main-content" initial={{opacity:0,y:reduce?0:6}} animate={{opacity:1,y:0}} transition={{duration:reduce?0:.22,ease:'easeOut'}}>{children}</motion.main>}
export function ViewTabs({value,onChange,options,children,label}:{value:string;onChange:(value:string)=>void;options:{id:string;label:string}[];children:ReactNode;label:string}){return <Tabs.Root value={value} onValueChange={onChange}><Tabs.List className="tabs" aria-label={label}>{options.map(o=><Tabs.Trigger className={value===o.id?'active':''} value={o.id} key={o.id}>{o.label}</Tabs.Trigger>)}</Tabs.List>{options.map(o=><Tabs.Content value={o.id} key={o.id} className="tab-content">{value===o.id?children:null}</Tabs.Content>)}</Tabs.Root>}
