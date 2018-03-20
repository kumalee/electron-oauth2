// @flow
import { ipcMain, BrowserWindow } from 'electron';
import oauth2Client from './oauth2Client';
import log from './log';

const _renderOauth2 = (oauthType: string, oauthConfig: any, event: any) => {
  const windowParams = {
    alwaysOnTop: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      webSecurity: false,
    }
  };
  const authWindow = new BrowserWindow(windowParams);
  const closeWindow = () => {
    authWindow.removeAllListeners('closed');
    setImmediate(() => {
      authWindow.close();
    });
  };
  const theOauth2Client = oauth2Client(oauthConfig, authWindow);
  theOauth2Client.getAuthorizationCode().then(resp => {
    event.sender.send(getEventName(oauthType, 'reply'), resp);
    closeWindow();
  }).catch(err => {
    log(['while getting code error:', err]);
    closeWindow();
  });
};

export const getEventName = (oauthType: string, subType: string = 'oauth') => {
  return `${oauthType}-${subType}`;
}

const oauth2Delegate = (config: any) => {
  const oauthTypes = Object.keys(config);
  oauthTypes.forEach((type, i) => {
    ipcMain.on(getEventName(type, 'oauth'), (event) => {
      _renderOauth2(type, config[type], event);
    });
  });
}

export default oauth2Delegate;
