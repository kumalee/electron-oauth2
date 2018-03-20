// electron dev environment detection https://github.com/sindresorhus/electron-is-dev
const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;
const isEnvSet = 'ELECTRON_IS_DEV' in process.env;

const isDev = isEnvSet ? getFromEnv : (process.defaultApp || /node_modules[\\/]electron[\\/]/.test(process.execPath));

const log = (...args) => {
  if (isDev) {
    console.log(...args);
  }
}

export default log;
