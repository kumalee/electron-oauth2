export default {
    GitHub: {
      response_type: 'code',
      client_id: 'a3a0907b788ce2daebd3',
      client_secret: 'c0704cca7a7aaf27921a44220752883e36e1928c',
      base_url: 'https://github.com',
      auth_path: '/login/oauth/authorize',
      token_path: '/login/oauth/access_token',
      scope: ['repo', 'user'],
      // don't touch me
      redirect_uri: 'http://localhost'
    },
    Google: {
      // Docs
      // client-side js https://developers.google.com/identity/protocols/OAuth2UserAgent
      // server-side js https://developers.google.com/identity/protocols/OAuth2WebServer
      response_type: 'token',
      // access_type: 'offline',
      client_id: '1003499896029-jctb1s5c8qmb3bnoqd8phu8cl4m49tvg.apps.googleusercontent.com',
      client_secret: 'C1ngs5tJeITWueN_ebFwFcNz',
      base_url: '',
      auth_path: 'https://accounts.google.com/o/oauth2/v2/auth',
      token_path: 'https://www.googleapis.com/oauth2/v4/token',
      scope: [
        'https://www.googleapis.com/auth/drive'
      ],
      include_granted_scopes: true,
      // don't touch me
      redirect_uri: 'http://localhost'
    },
    Box: {
      // Docs
      // https://developer.box.com/docs/oauth-20
      response_type: 'code',
      client_id: 'uoeuxvr0p0rj42r7t7grt84hq98at01y',
      client_secret: '67ELiWhKjP3I4O2OnrzzpHVgK1QTzFGc',
      base_url: '',
      auth_path: 'https://account.box.com/api/oauth2/authorize',
      token_path: 'https://api.box.com/oauth2/token',
      scope: ['root_readwrite'],
      // don't touch me
      redirect_uri: 'http://localhost'
    }
}
