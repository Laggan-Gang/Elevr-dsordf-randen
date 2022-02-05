const axios = require('axios');
const { laggStatsBaseUrl } = require('./config.json');

let id = '207840759087497217';

async function idRocket() {
  //const arr = meddelande.content.toLocaleLowerCase().split(' ');
  //const fejkLista = arr.slice(1);

  let aliasesData = {
    aliases: ['hugo', 'snygghugo', 'goblin', 'goblinchair bladeborne'],
    id: id,
  };

  const request = {
    baseURL: laggStatsBaseUrl,
    url: '/alias',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: aliasesData,
    responseType: 'json',
  };

  const fRes = await axios(request);
  console.log(fRes);
  return fRes;
}

async function resRocket(teams, winner, game, matchId) {
  //Lathund: Teams är en array av arrayer, winner är int, game & matchId är string
  let teamsArray;
  for (lag of teams) {
    teamsArray.push(lag);
  }
  let statData = {
    teams: teamsArray,
    winner: winner,
    game: game,
    matchId: matchId,
  };

  const request = {
    baseURL: laggStatsBaseUrl,
    url: 'result',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: statData,
    responseType: 'json',
  };
  try {
    const fRes = await axios(request);
    console.log(fRes);
  } catch (error) {
    console.error(error);
  }

  return fRes;
}
