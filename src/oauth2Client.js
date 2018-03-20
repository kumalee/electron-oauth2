// @flow
import nodeUrl from 'url';
import queryString from 'querystring';
import fetch from 'node-fetch';
import log from './log';

/**
 * oauth client
 * @param {Object} config
 * @param {BrwserWindow} authWindow
 * @return {function}
 */
const oauth2Client = (config: any, authWindow: any) => {
  /**
   * generate oauth2 authorization url
   * @return {String} url
   */
  const getAuthorizationURL = () => {
    // https://flow.org/en/docs/types/objects/
    // When you create an object without any properties,
    // you create an unsealed object type in Flow.
    // These unsealed objects will not know all of their
    // properties and will allow you to add new ones.
    const params = {};
    params.client_id = config.client_id;
    params.response_type = config.response_type || 'code';
    params.redirect_uri = config.redirect_uri || 'http://localhost';
    if (config.scope) {
      params.scope = config.scope.join(' ');
    }
    if (config.include_granted_scopes) {
      params.include_granted_scopes = config.include_granted_scopes;
    }
    if (config.access_type) {
      params.access_type = config.access_type;
    }
    const authorizationUrl = config.base_url + config.auth_path;
    log('electron-oauth/index line38, authorize url: ', `${authorizationUrl}?${queryString.stringify(params)}`);
    return `${authorizationUrl}?${queryString.stringify(params)}`;
  };

  /**
   * Oauth2 Authorize Step 1, request code
   * @return {Promise}
   */
  const getAuthorizationCode = () => {
    const requestOAuth2Url = getAuthorizationURL();

    const promise: Promise<any> = new Promise((resolve, reject) => {
      authWindow.loadURL(requestOAuth2Url);
      authWindow.show();

      authWindow.on('closed', () => {
        reject(new Error('window was closed by user'));
      });

      /**
       *
       * @param {string} url
       * @param {Promise.reject} reject
       * @param {Promise.resolve} resolve
       * @param {function} callback
       * @return {Promise}
       */
      type ObjectUrl = {
        hash?: string,
        query?: ObjectQuery,
      }

      type ObjectQuery = {
        code?: string,
        error?: string,
      }

      const getUrlParams = (url: string) => {
        const urlParts = nodeUrl.parse(url, true);
        const { hash, query } : ObjectUrl = urlParts;
        const code = (query && query.code) || null;
        const error = (query && query.error) || null;
        const token = {};
        if (hash && hash !== '#') {
          hash.substr(1).split('&').forEach(json => {
            const [k, v] = json.split('=');
            token[k] = v;
          });
        }

        return {
          error,
          code,
          token,
        };
      };

      function onCallback(type: string, url: string) {
        const { error, code, token } = getUrlParams(url);
        log(['electron-oauth/index line 97, url params:::', type, error, code, token]);
        if (error) {
          log(['electron-oauth/index line 99, error, url:', url]);
          reject(error);
        } else if (token.access_token) {
          log(['electron-oauth/index line 102, get token: ', token]);
          resolve(token);
        } else if (code && type==='did-get-redirect-request') {
          log(['electron-oauth/index line 105, get code: ', code]);
          getAccessToken(code).then(authorizedToken => {
            log(['electron-oauth/index line 107, got token through code:', type, url, authorizedToken]);
            resolve(authorizedToken);
            return true;
          }).catch(err => {
            log(['electron-oauth/index line 111, get token error in 2 steps', err]);
          });
        }
      }

      authWindow.webContents.on('will-navigate', (event, url) => {
        log(['electron-oauth/index line 117, will-nagiage:::', url]);
        onCallback('will-navigate', url);
      });

      authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
        log(['electron-oauth/index line 122, did-get-redirect-request:::', oldUrl, newUrl]);
        onCallback('did-get-redirect-request', newUrl);
      });
    });

    return promise;
  };

  /**
   * Oauth2 Authorize Full Flow, step1 -> step2
   * @param {string} authorization code
   * @return {Promise} token
   */
  const getAccessToken = (code: string) => {
    const header = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const data = {
      code,
      client_id: config.client_id,
      client_secret: config.client_secret,
      redirect_uri: config.redirect_uri,
      grant_type: 'authorization_code'
    };

    log('electron-oauth/index line 149, getToken, body data:', data);

    const tokenUrl = config.base_url + config.token_path;

    return fetch(tokenUrl, {
      method: 'POST',
      headers: header,
      body: queryString.stringify(data),
    }).then(resp => resp.json()).catch(err => {
      log('electron-oauth/index line 158, fetch token error: ', err);
    });
  };

  /**
   * Oauth2 Refresh Access Token
   * @param {Object} config
   * @param {Object} refreshToken
   * @return {Object} token
   */
  // const refreshAccessToken = (refreshToken) => utils.getToken(config, {
  //   refresh_token: refreshToken,
  //   grant_type: 'refresh_token',
  // });

  return {
    getAuthorizationCode,
    getAccessToken,
    // refreshAccessToken,
  };
};

export default oauth2Client;
