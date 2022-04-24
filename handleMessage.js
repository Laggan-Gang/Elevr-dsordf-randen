module.exports = function handleMessage(aleaIactaEst, handlingar, meddelande, client) {
    const args = meddelande.content
        .replace(/!.+?(\s|$)/, "")
        .replace(/ +/, " ")
        .split(meddelande.content.includes(",") ? "," : " ")
        .map((x) => x.trim().toLowerCase());
    for (h of handlingar) {
        if (h.predikat(meddelande, aleaIactaEst) && (!h.allowsBots || !meddelande.author.bot)) {
            h.handle(meddelande, args, client, aleaIactaEst)
            return true
        }
    }
}