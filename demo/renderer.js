// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
import { ipcRenderer } from 'electron';
import config from './config-built';
import { getEventName } from '../lib';

const oauth = (type) => {
  ipcRenderer.send(type, 'getToken');
}

const renderBtns = () => {
  const keys = Object.keys(config);
  keys.forEach((key, i) => {
    document.write(`<button data-oauth="${getEventName(key)}">OAuth ${key}</button>`);
  });
}

renderBtns();

document.body.addEventListener('click', (e)=>{
  if (e.target.tagName.toLowerCase()==='button'){
    const oauthType = e.target.getAttribute('data-oauth');
    oauth(oauthType);
  }
});
