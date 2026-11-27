import React from 'react';import {createRoot,hydrateRoot} from 'react-dom/client';import {App} from './App';import './styles/site.css';import './styles/cinema.css';
const root=document.getElementById('root')!;
if(root.hasChildNodes() && root.firstElementChild) hydrateRoot(root,<App/>);else createRoot(root).render(<App/>);

import './styles/transmission.css';
