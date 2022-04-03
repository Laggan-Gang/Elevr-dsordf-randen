module.exports = function handleMessage(aleaIactaEst, handlingar, meddelande, client) {
    for (h of handlingar) {
        if (h.predikat(meddelande, aleaIactaEst) && (!h.allowsBots || !meddelande.author.bot)) {
            h.handle(meddelande, client, aleaIactaEst)
            return true
        }
    }
}