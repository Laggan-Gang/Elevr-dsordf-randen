mktriggers = (command) => [command.command].concat(command.alternativeCommand?command.alternativeCommand:[])

module.exports = (command, fn) => ({
    triggervarningar: mktriggers(command),
    predikat: (meddelande) => (new RegExp(`\^(${mktriggers(command).join("|")})`, "i")).test(meddelande.content.toLocaleLowerCase()),
    handle: fn,
})