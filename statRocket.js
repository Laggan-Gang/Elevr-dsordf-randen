const axios = require("axios");
const { laggStatsBaseUrl } = require("./config.json");

module.exports = {
  statRocket: async (teams, winner, game, matchId) => {
    //Lathund: Teams är en array av arrayer, winner är int, game & matchId är string
    //Whenever this comes from statCollector, winner is always 0
    let statData = {
      teams: teams,
      winner: winner,
      game: game,
    };

    if (matchId !== undefined) {
      statData.matchId = matchId;
    }

    const request = {
      baseURL: laggStatsBaseUrl,
      url: "result",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: statData,
      responseType: "json",
    };
    try {
      const res = await axios(request);
      return res;
    } catch (error) {
      console.error(error);
    }
  },
  addAliases: async (id, aliasArray) => {
    return await axios({
      baseURL: laggStatsBaseUrl,
      url: "/alias",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        id: id,
        aliases: aliasArray,
      },
      responseType: "json",
    });
  },
};
