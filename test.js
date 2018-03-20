const config = {
  GitHub: 'github',
  GoogleDrive: 'googleDrive'
}

const keys = (()=>{
  const res = [];
  for(const i in config){
    if (config.hasOwnProperty(i)){
      res.push(i);
    }
  }
  return res;
})

console.log(keys());
