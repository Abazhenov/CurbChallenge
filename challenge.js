(async function(){

const axios = require('axios');
let session = null;
let count = 0;

const getSession = async () => {
  if (!session || count > 9){
    const response =  await axios.get('http://challenge.shopcurbside.com/get-session')
    count = 1;
    return response.data
  }
  else {
    count++;
    return session
  }
}

session = await getSession()

const curbside = axios.create({
  baseURL: 'http://challenge.shopcurbside.com/',
  timeout: 2000,
  headers: {'Session': session}
});

const doTheChallenge = async (url, secrets = []) => {
  session = await getSession()
  const { data } = await curbside.get(url, { headers: {'Session': session}})
  for (let prop in data){
    if (prop.toLowerCase() === 'next'){
      if (typeof data[prop] === 'string'){
        await doTheChallenge(data[prop], secrets)
      } else {
        for (let i = 0; i < data[prop].length; i++){
          await doTheChallenge(data[prop][i], secrets)
        }
      }
    } else if (prop === 'secret') {
      secrets.push(data[prop])
    }
  }
  return secrets;
}
const answer = await doTheChallenge('start')
console.log(answer.filter(char => char !== '').join(''));


})()