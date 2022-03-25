const axios = require("axios");
const { laggStatsBaseUrl } = require("./config.json");

async function idRocket() {
  //This is just for example if I need it later
  //const arr = meddelande.content.toLocaleLowerCase().split(' ');
  //const fejkLista = arr.slice(1);
  let id = "207840759087497217";

  let aliasesData = {
    aliases: ["hugo", "snygghugo", "goblin", "goblinchair bladeborne"],
    id: id,
  };

  const request = {
    baseURL: laggStatsBaseUrl,
    url: "/alias",
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    data: aliasesData,
    responseType: "json",
  };
  try {
    const res = await axios(request);
    return res;
  } catch (error) {
    console.error(error);
  }
}
(async () => {
  const result = await idRocket();
  console.log(result);
})();

let prutt = (async () => {
  await idRocket();
})();
console.log(prutt);

//prutt = idRocket();
//console.log(prutt);
