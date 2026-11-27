import {createServer} from 'vite';
import {readFile,writeFile} from 'node:fs/promises';
import {renderToString} from 'react-dom/server';
import {createElement} from 'react';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try {const {App}=await server.ssrLoadModule('/src/App.tsx');const html=await readFile('dist/index.html','utf8');await writeFile('dist/index.html',html.replace('<!--portfolio-->',()=>renderToString(createElement(App))));}finally{await server.close()}
