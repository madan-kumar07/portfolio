import {useEffect,useRef} from 'react';

// A small projected city responds to native scroll; each frame is drawn on demand.
export function CityPassage(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current!,ctx=canvas.getContext('2d');if(!ctx)return;
  const section=canvas.parentElement!,motion=matchMedia('(prefers-reduced-motion:reduce)');
  let seed=803,frame=0,visible=false,disposed=false;
  const random=()=>{seed=seed*16807%2147483647;return seed/2147483647};
  const blocks=Array.from({length:92},(_,i)=>{
    const side=i%2?1:-1;return {x:side*(4+random()*24),z:6+random()*86,h:2+random()*9,w:1+random()*2.2,d:1.5+random()*3,seed:random()}
  }).sort((a,b)=>b.z-a.z);
  function paint(){frame=0;if(!ctx||disposed)return;const w=canvas.clientWidth,h=canvas.clientHeight;
   if(!w||!h)return;
   const ratio=Math.min(devicePixelRatio,1.4);
   if(canvas.width!==Math.round(w*ratio)||canvas.height!==Math.round(h*ratio)){canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio)}
   ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,w,h);
   const rect=section.getBoundingClientRect(),p=motion.matches?.45:Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight+rect.height)));
   const dz=p*4,cam=7.5-p*2,axis=w*.57,base=h*.48,focal=Math.min(w*.65,h*1.36);
   const screen=(x:number,y:number,z:number)=>[axis+(x-1.2*p)*focal/(z-dz),base-(y-cam)*focal/(z-dz)];
   for(const b of blocks){const k=1-b.z/107;
    const face=(points:number[][],c:string)=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=c;ctx.fill()};
    const front=[screen(b.x,0,b.z),screen(b.x+b.w,0,b.z),screen(b.x+b.w,b.h,b.z),screen(b.x,b.h,b.z)];
    face(front,'rgb('+[8+9*k,28+17*k,49+32*k].map(Math.round).join(',')+')');
    const side=b.x<0?b.x+b.w:b.x;face([screen(side,0,b.z),screen(side,0,b.z+b.d),screen(side,b.h,b.z+b.d),screen(side,b.h,b.z)],'#233e5b');
    face([front[3],front[2],screen(b.x+b.w,b.h,b.z+b.d),screen(b.x,b.h,b.z+b.d)],'#304c65');
    ctx.strokeStyle='#79c5cd66';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(front[3][0],front[3][1]);ctx.lineTo(front[2][0],front[2][1]);ctx.stroke();
    ctx.fillStyle=b.seed>.62?'#92c9ce':'#5f9fb5';
    for(let row=1;row<b.h/.8;row++)for(let col=1;col<5;col++){if((row+col+Math.floor(b.seed*11))%3!==0)continue;const [x,y]=screen(b.x+b.w*col/5,b.h-row*.8,b.z);ctx.fillRect(x,y,Math.max(1,.12*focal/(b.z-dz)),Math.max(.75,.07*focal/(b.z-dz)))}
   }
  }
  function schedule(){if(!frame&&visible&&!disposed)frame=requestAnimationFrame(paint)}
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;schedule()});io.observe(section);const ro=new ResizeObserver(schedule);ro.observe(canvas);
  window.addEventListener('scroll',schedule,{passive:true});motion.addEventListener('change',schedule);
  return()=>{disposed=true;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();window.removeEventListener('scroll',schedule);motion.removeEventListener('change',schedule)}
 },[]);
 return <canvas ref={ref} className="city-passage" aria-hidden="true"/>;
}