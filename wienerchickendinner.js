const { laggStatsBaseUrl } = require("./config.json");
const axios = require("axios");
//@ts-check

async function getPlayerStats(playerId, gameId) {
  const request = {
    baseURL: laggStatsBaseUrl,
    url: "result/all",
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "json",
  };
  const response = await axios(request);

  return response.data.filter(
    (r) => r.game === gameId && r.username === playerId
  );
}

async function calculateDotaWiener(playerId) {
  const playerStats = await getPlayerStats(playerId, "Dota 2");

  const wins = playerStats.filter((r) => r.win).length;

  return {
    vinstProcent: ((wins / playerStats.length) * 100).toFixed(),
    totalGames: playerStats.length,
    vinst: wins
  };
}

module.exports = {
  calculateDotaWiener,
};
