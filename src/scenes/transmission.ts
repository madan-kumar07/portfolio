import * as T from 'three';

type Sample = [number,number,number,number];
type Shape = (u:number,v:number,part:number)=>Sample;
const TAU=2*Math.PI;

// Each sample describes a point on the surface and its local illumination.
const headphones:Shape=(u,v,part)=>{
  const t=TAU*u,side=part<.5?-1:1,partId=(part*2)%1;
  if(partId<.39){
    const angle=.02+u*(Math.PI-.04), edge=TAU*v;
    const r=1.16+.10*Math.cos(edge);
    return [r*Math.cos(angle),.15+1.27*r*Math.sin(angle),.23*Math.sin(edge),.43+.40*Math.abs(Math.sin(edge))];
  }
  if(partId<.46){
    const y=.21-.67*u;
    return [side*(1.17+.055*Math.cos(TAU*v)),y,.15*Math.sin(TAU*v),.88];
  }
  const y=-.54+.095*side;
  if(partId<.73){
    const theta=TAU*v;const shell=.47+.105*Math.cos(theta);
    return [side*(1.02+.145*Math.sin(theta)),y+.70*Math.cos(t)*(shell/.50),.49*Math.sin(t)*(shell/.50),.35+.40*Math.max(0,Math.cos(t)+.3)];
  }
  if(partId<.87){
    return [side*(1.11+.32*v),y+.68*Math.cos(t),.47*Math.sin(t),.34+.52*(Math.cos(t)*.5+.5)];
  }
  const r=Math.sqrt(v);const groove=.5+.5*Math.cos(84*r);
  return [side*(1.43+.075*(1-r*r)),y+.68*r*Math.cos(t),.47*r*Math.sin(t),.28+.42*groove+.18*(1-r)];
};
const vinyl:Shape=(u,v,part)=>{
  const t=TAU*u,r=.085+1.43*Math.sqrt(v),groove=.5+.5*Math.cos(150*r);
  const x=r*Math.cos(t),y=r*Math.sin(t),z=(part<.88?.055:-.055)+.014*groove;
  return [x,y*.94+z*.34,z+y*.28,r<.47?.92:.26+.52*groove+.18*Math.sin(t*2)];
};
const cloche:Shape=(u,v,part)=>{
  const a=TAU*u;
  if(part<.64){const b=v*Math.PI*.5,r=1.35*Math.sin(b);return [r*Math.cos(a),-.48+1.18*Math.cos(b),r*Math.sin(a),.36+.52*Math.max(0,Math.cos(a-1.8))*Math.sin(b)+.12*Math.cos(b)]}
  if(part<.76){const t=TAU*v,r=1.45+.075*Math.cos(t);return [r*Math.cos(a),-.55+.065*Math.sin(t),r*Math.sin(a),.85]}
  if(part<.94){const r=1.46*Math.sqrt(v);return [r*Math.cos(a),-.61+.055*r*r,r*Math.sin(a),.3+.3*v]}
  const b=Math.acos(1-2*v);return [.16*Math.sin(b)*Math.cos(a),.8+.13*Math.cos(b),.16*Math.sin(b)*Math.sin(a),.94];
};

export function createTransmission(host:HTMLElement,initial:number){
  const canvas=document.createElement('canvas');
  const context=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'low-power'});
  if(!context)throw new Error('WebGL unavailable');
  const renderer=new T.WebGLRenderer({canvas,context,alpha:true,antialias:true});
  renderer.setClearColor(0,0);host.appendChild(canvas);
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.1,50),geo=new T.BufferGeometry();
  const total=host.clientWidth<600?22500:46000;
  let seed=1207;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647}
  const values=[headphones,vinyl,cloche].map(()=>new Float32Array(total*4));
  for(let i=0;i<total;i++){const u=rnd(),v=rnd(),p=rnd();[headphones,vinyl,cloche].forEach((shape,j)=>values[j].set(shape(u,v,p),i*4))}
  geo.setAttribute('position',new T.Float32BufferAttribute(new Float32Array(total*3),3));
  values.forEach((v,i)=>geo.setAttribute('shape'+i,new T.BufferAttribute(v,4)));
  const uniforms={weights:{value:new T.Vector3()},ratio:{value:1},angle:{value:0},pulse:{value:0}};
  const mat=new T.ShaderMaterial({uniforms,vertexShader:`
    attribute vec4 shape0;attribute vec4 shape1;attribute vec4 shape2;
    uniform vec3 weights;uniform float ratio;uniform float angle;uniform float pulse;
    varying float light;varying float depth;varying vec3 tint;
    void main(){
      vec4 a=shape0*weights.x+shape1*weights.y+shape2*weights.z;
      vec3 p=a.xyz;float theta=angle+.67*weights.x-.28*weights.y;
      p.xz=mat2(cos(theta),sin(theta),-sin(theta),cos(theta))*p.xz;
      float pitch=.08+.18*weights.z;
      p.yz=mat2(cos(pitch),sin(pitch),-sin(pitch),cos(pitch))*p.yz;
      float roll=-.17*weights.x+.12*weights.y;
      p.xy=mat2(cos(roll),sin(roll),-sin(roll),cos(roll))*p.xy;
      p+=pulse*.09*vec3(sin(a.x*11.),cos(a.y*9.),sin(a.z*8.));
      vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
      depth=clamp(.54+.33*p.z,.12,1.);light=a.w;
      tint=weights.x*vec3(.43,1.,.83)+weights.y*vec3(.66,.65,1.)+weights.z*vec3(1.,.70,.36);
      gl_PointSize=clamp((1.1+1.05*depth)*ratio*5.0/-mv.z,1.,4.6);
    }`,fragmentShader:`varying float light;varying float depth;varying vec3 tint;
    void main(){float r=length(gl_PointCoord-.5);if(r>.5)discard;
      vec3 c=mix(tint,vec3(.95,1.,.96),smoothstep(.5,.94,light)*.69);
      gl_FragColor=vec4(c*(.29+.81*light)*(.28+.80*depth),(1.-smoothstep(.20,.5,r))*(.36+.64*depth));
    }`,transparent:true,depthWrite:false,blending:T.AdditiveBlending});
  const dots=new T.Points(geo,mat);dots.frustumCulled=false;scene.add(dots);
  let target=initial,paused=false,visible=true,disposed=false,id=0,last=0,time=0,dx=0,dy=0,rx=0,ry=0;
  const weights=uniforms.weights.value,desired=new T.Vector3();const weight=(i:number)=>desired.set(Number(i===0),Number(i===1),Number(i===2));weights.copy(weight(initial));
  function draw(dt:number){const snap=paused||reduced.matches;weights.lerp(weight(target),snap?1:1-Math.exp(-dt*6));rx+=(dx-rx)*(snap?1:1-Math.exp(-dt*5));ry+=(dy-ry)*(snap?1:1-Math.exp(-dt*5));
    uniforms.angle.value=snap?0:.095*Math.sin(time*.34)+rx*.28;uniforms.pulse.value=1-Math.max(weights.x,weights.y,weights.z);
    dots.rotation.x=snap?0:ry*.13;dots.position.y=snap?0:.022*Math.sin(time*.59);renderer.render(scene,camera)}
  function tick(t:number){id=0;if(disposed||!visible||paused||reduced.matches||document.hidden)return;const dt=last?Math.min(.06,(t-last)/1000):.016;last=t;time+=dt;draw(dt);id=requestAnimationFrame(tick)}
  function wake(){if(disposed)return;cancelAnimationFrame(id);last=0;draw(.016);if(!paused&&!reduced.matches&&visible&&!document.hidden)id=requestAnimationFrame(tick)}
  function resize(){const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);uniforms.ratio.value=Math.min(devicePixelRatio,1.65);renderer.setPixelRatio(uniforms.ratio.value);renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=5.85/Math.min(1,camera.aspect);camera.updateProjectionMatrix();wake()}
  function move(e:PointerEvent){if(e.pointerType==='touch')return;const b=host.getBoundingClientRect();dx=Math.max(-1,Math.min(1,(e.clientX-b.left)/b.width*2-1));dy=(e.clientY-b.top)/b.height*2-1}
  function leave(){dx=0;dy=0}
  const ro=new ResizeObserver(resize),io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;wake()});ro.observe(host);io.observe(host);host.addEventListener('pointermove',move);host.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',wake);reduced.addEventListener('change',wake);resize();
  return {select(i:number){target=i;wake()},pause(v:boolean){paused=v;wake()},dispose(){disposed=true;cancelAnimationFrame(id);ro.disconnect();io.disconnect();host.removeEventListener('pointermove',move);host.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',wake);reduced.removeEventListener('change',wake);geo.dispose();mat.dispose();renderer.dispose();canvas.remove()}};
}