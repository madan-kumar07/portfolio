import {useEffect,useRef,useState} from 'react';
import {Pause,Play,ExternalLink} from 'lucide-react';
import {person} from '../data/portfolio';
import type {createTransmission} from '../scenes/transmission';
const stills=['/assets/signal-0.webp','/assets/signal-1.webp','/assets/signal-2.webp'];
const slides=[
 {title:'Full-stack',second:'developer.',label:'Introduction',art:'Headphones',body:'I’m Madankumar A, a computer science student in Trichy. I build music and ordering applications with React, Java and Python.'},
 {title:'TuneFlow',second:'AI.',label:'TuneFlow AI',art:'Record',body:'A music discovery app that brings YouTube search, a personal song catalogue and a secure Spring Boot API into one player.'},
 {title:'Smart',second:'Canteen.',label:'Smart Canteen',art:'Serving dome',body:'A pre-ordering app that connects the student’s menu to the canteen’s live order queue using React, Flask and Socket.IO.'}
];
export function SignalIntro({explore}:{explore:(id:string)=>void}){
 const section=useRef<HTMLElement>(null),host=useRef<HTMLDivElement>(null),api=useRef<ReturnType<typeof createTransmission>>();
 const [index,setIndex]=useState(0),[live,ready]=useState(false),[paused,setPaused]=useState(false);
 const current=useRef(0),pauseRef=useRef(false);const slide=slides[index];
 function select(i:number){current.current=i;setIndex(i);api.current?.select(i)}
 useEffect(()=>{const node=host.current!;let active=true;
   function lost(e:Event){e.preventDefault();api.current?.dispose();api.current=undefined;ready(false)}
   node.addEventListener('webglcontextlost',lost,true);
   import('../scenes/transmission').then(m=>{if(!active)return;try{api.current=m.createTransmission(node,current.current);ready(true)}catch{ready(false)}}).catch(()=>ready(false));
   const mq=matchMedia('(prefers-reduced-motion:reduce)');let lastStep=0;
   function scroll(){if(mq.matches||pauseRef.current)return;const el=section.current!,height=el.offsetHeight-el.firstElementChild!.getBoundingClientRect().height;
    if(height<20)return;const rect=el.getBoundingClientRect();if(rect.bottom<=0)return;const fraction=Math.min(1,Math.max(0,(62-rect.top)/height));const step=fraction<.30?0:fraction<.74?1:2;if(step!==lastStep){lastStep=step;select(step)}}
   window.addEventListener('scroll',scroll,{passive:true});scroll();return()=>{active=false;window.removeEventListener('scroll',scroll);node.removeEventListener('webglcontextlost',lost,true);api.current?.dispose()};
 },[]);
 function openCase(){if(index)explore(index===1?'tune':'canteen')}
 return <section ref={section} id="home" className="signal-journey" aria-label="Introduction and featured projects"><div className={'signal-stage trace-'+index}>
   <div className="signal-grid" aria-hidden="true"/>
   <div className="signal-layout"><div className="signal-copy"><p className="identity-line"><span/>MADANKUMAR A</p>
   <h1 key={index}>{slide.title}<br/><em>{slide.second}</em></h1>
   <p className="signal-description">{slide.body}</p>
   <div className="signal-actions"><a className="project-cta" href="#work" onClick={openCase}>{index?'View case study':'Explore projects'}</a><a className="drive-cta" href={person.resume} target="_blank" rel="noreferrer">Résumé <ExternalLink size={14}/></a></div></div>
   <figure className="specimen"><div className="reticle"/><img className={live?'signal-still hidden-still':'signal-still'} alt="" src={stills[index]}/><div className="specimen-canvas" ref={host} aria-hidden="true"/><figcaption><span className="mini-wave" aria-hidden="true">∿</span>{slide.art} <span className="art-kind">/ point study</span></figcaption></figure></div>
   <div className="signal-rail"><div role="group" aria-label="Featured scenes" className="scene-tabs">{slides.map((s,i)=><button key={s.label} type="button" aria-pressed={index===i} onClick={()=>select(i)}><span>0{i+1}</span> {s.label}</button>)}</div>{live&&<button className="motion-toggle" aria-label={paused?'Resume motion':'Pause motion'} aria-pressed={paused} onClick={()=>{pauseRef.current=!paused;setPaused(!paused);api.current?.pause(!paused)}}>{paused?<Play size={14}/>:<Pause size={14}/>}</button>}</div>
 </div></section>;
}