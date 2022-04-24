
const { commands } = require("./commands");
const bigData = require("./statCollector");
const { addAliases } = require("./statRocket");
const commandMaker = require('./commandMaker');

module.exports = [
    commandMaker(commands.stat, bigData.statCollector),
    commandMaker(commands.listGames, bigData.listGames),
    commandMaker(commands.pobeditel, bigData.gameWiener),
    commandMaker(commands.smorgesbord, bigData.smorgesbord),
    {
        triggervarningar: [commands.alias.command],
        predikat: meddelande => meddelande.content.toLocaleLowerCase().startsWith(commands.alias.command),
        handle: async function alias(meddelande) {
            const id = meddelande.author.id;
            const allExceptFirst = meddelande.content.split(" ").slice(1);
            const res = await addAliases(id, allExceptFirst);
            if (res.status == "200") {
              meddelande.react("👍");
            } else {
              meddelande.react("👎");
            }
            return;
          }
    }
]