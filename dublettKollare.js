const axios = require("axios");
const { laggStatsBaseUrl } = require("./config.json");
module.exports = {
  dublettKollaren: async (matchIdData) => {
    const request = {
      baseURL: laggStatsBaseUrl,
      url: "/result/all",
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    };
    try {
      const res = await axios(request);
      //FALSE = it doesn't exist in the records
      //TRUE = it is indeed a duplicate
      return res.data.some((r) => r.matchId === matchIdData);
    } catch (error) {
      console.error(error);
    }
  },
};
