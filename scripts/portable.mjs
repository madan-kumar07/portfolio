// Package the same production application for a direct, offline file open.
import {build} from 'vite';
import {readFile,writeFile} from 'node:fs/promises';
const output=process.argv[2];
if(!output) throw new Error('Supply the output HTML path.');
const result=await build({build:{write:false,rollupOptions:{output:{inlineDynamicImports:true}},sourcemap:false}});
let page=await readFile('dist/index.html','utf8');
const script=result.output.find(x=>x.type==='chunk').code;
const css=result.output.find(x=>x.fileName.endsWith('.css')).source;
page=page.replace(/<script type="module"[^>]*src="[^"]+"[^>]*><\/script>/,'').replace(/<link rel="stylesheet"[^>]*>/,'');
page=page.replace('</head>',()=>'<style>'+css+'</style></head>').replace('</body>',()=>'<script type="module">'+script.replaceAll('</script','<\\/script')+'</script></body>');
for(const [path,mime] of [['/resume/Madankumar_A_Resume.pdf','application/pdf'],['/assets/signal-0.webp','image/webp'],['/assets/signal-1.webp','image/webp'],['/assets/signal-2.webp','image/webp'],['/assets/night-grid.webp','image/webp'],['/mark.svg','image/svg+xml']]){
 const url='data:'+mime+';base64,'+(await readFile('public'+path)).toString('base64');
 page=page.replaceAll(path,()=>url);
}
await writeFile(output,page);
