import {useEffect,useRef} from 'react';
import {X} from 'lucide-react';
import {navigation,person} from '../data/portfolio';
export function SiteMenu({close}:{close:()=>void}){
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const d=ref.current!;d.showModal();return()=>d.close()},[]);
  return <dialog className="site-menu" ref={ref} aria-label="Site menu" onCancel={close}><div className="menu-top"><span>Madankumar A</span><button autoFocus aria-label="Close menu" onClick={close}><X/> Close</button></div><nav aria-label="Menu destinations">
    {navigation.map(([label,id])=><a key={id} href={'#'+id} onClick={close}>{label}</a>)}
  </nav><div className="menu-bottom"><a href={person.github}>GitHub</a><a href={person.linkedin}>LinkedIn</a><a href={person.resume} target="_blank" rel="noreferrer">View r&eacute;sum&eacute;</a></div></dialog>
}