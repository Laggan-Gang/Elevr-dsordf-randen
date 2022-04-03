
const bigData = require("./statCollector");

module.exports = [
    {
        triggervarningar: ["!stat"],
        predikat: meddelande => meddelande.content.startsWith("!stat"),
        handle: bigData.statCollector,
    },
    {
        triggervarningar: ["!победител"],
        predikat: meddelande => meddelande.content.startsWith("!победител"),
        handle: bigData.dotaWiener,
    },
    {
        triggervarningar: ["!smorgesbord"],
        predikat: meddelande => meddelande.content.startsWith("!smorgesbord"),
        handle: bigData.smorgesbord,
    },
]