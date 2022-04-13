const { laggStatsBaseUrl } = require("./config.json");
const axios = require("axios");
//@ts-check

async function getAxiosInternal() {
  const request = {
    baseURL: laggStatsBaseUrl,
    url: "result/all",
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "json",
  };
  return axios(request);
}

async function getGames() {
  const response = await getAxiosInternal();

  return new Set(response.data.map((bigData) => bigData.game));
}

async function getPlayerStats(playerId, gameId) {
  const response = await getAxiosInternal();
  return response.data.filter(
    (r) => r.game === gameId && r.username === playerId
  );
}

async function calculateGameWiener(playerId, game) {
  let playerStats = [];
  if (game === "Dota" || "Dota 2") {
    const dStats = await getPlayerStats(playerId, "Dota");
    const d2Stats = await getPlayerStats(playerId, "Dota 2");
    playerStats = dStats.concat(d2Stats);
  } else {
    await getPlayerStats(playerId, game);
  }

  const wins = playerStats.filter((r) => r.win).length;

  return {
    vinstProcent: ((wins / playerStats.length) * 100).toFixed(2),
    totalGames: playerStats.length,
    vinst: wins,
  };
}

module.exports = {
  calculateGameWiener,
  getGames,
};
