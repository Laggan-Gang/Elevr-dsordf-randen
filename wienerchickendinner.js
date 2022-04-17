const { laggStatsBaseUrl } = require("./config.json");
const axios = require("axios");
//@ts-check

async function getAllResults() {
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
  const response = await getAllResults();

  return new Set(response.data.map((bigData) => bigData.game));
}

async function calculateGameWiener(playerId, game) {
  const playerStats = await getAllStatsFor(game, [playerId]);
  const wins = playerStats.filter((r) => r.win).length;

  return {
    percent:
      playerStats.length > 0
        ? ((wins / playerStats.length) * 100).toFixed(2)
        : 0,
    total: playerStats.length,
    vinst: wins,
  };
}

async function getAllStatsFor(gameFilter, idFilterArray) {
  const args = [];
  if (gameFilter) {
    args.push(["game", "==", gameFilter]);
  }
  if (idFilterArray) {
    args.push(["username", "in", idFilterArray]);
  }

  const res = await axios({
    baseURL: laggStatsBaseUrl,
    url: "/result/query",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "json",
    data: {
      args: args,
    },
  });

  return res.data;
}

module.exports = {
  calculateGameWiener,
  getGames,
  getAllStatsFor,
};
