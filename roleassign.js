const { commands } = require("./commands");

module.exports = [{
    triggervarningar: [commands.role.command, commands.role.alternativeCommand],
    predikat: (meddelande) => /^rol(l|e)/.test(meddelande.content.toLowerCase()),
    handle: async function roleAssign(meddelande) {
        let dravel = meddelande.content.toLocaleLowerCase();
        let resten = meddelande.content.slice(5);
        if (dravel.startsWith("roll")) {
            if (meddelande.channel.id == "539847809004994560") {
                let role = meddelande.guild.roles.cache.find(
                    (role) => role.name === resten
                );
                if (role == undefined) {
                    meddelande.reply(
                        "Finner inget sådant sällskap i den här kanalen, har du provat bing.com? Kom ihåg att jag är en viktigpetter och är väldigt noggrann med gemener och versaler :)"
                    );
                } else {
                    console.log(role);
                    if (!meddelande.member.roles.cache.some((r) => r.name === resten)) {
                        meddelande.member.roles
                            .add(role)
                            .then(() => {
                                meddelande.reply(
                                    "Har talat med fakulteten och har beslutat att gå din förfrågan till mötes. Välkomen till " +
                                    role.toString() +
                                    "-klubben!"
                                );
                            })
                            .catch((error) => {
                                if (error.toString() === "DiscordAPIError: Missing Permissions") {
                                    meddelande.reply(
                                        "Har undersökt saken och kommit fram till att du inte riktigt är den typ vi söker som " +
                                        role.toString()
                                    );
                                }
                            });
                    } else {
                        meddelande.reply(
                            "Efter eftertanke har det slagit mig att du redan är " +
                            role.toString() +
                            "! Jag kan tyvärr inte göra dig till dubbel-" +
                            role.toString() +
                            " :("
                        );
                    }
                }
            } else {
                meddelande.reply(
                    "Här skulle jag vilja kliva in och påminna dig om att digital nedskräpning är fortfarande nedskrpäning, och att ägna sig åt sådanna vedervärdiga projekt gör hela kanalen till åtlöje. Vänligen se till att alla dina icke-essentiella bot-kommandon skrivs i " +
                    meddelande.guild.channels.cache.get("539847809004994560").toString() +
                    ". Fundera ett slag över dina handlingar och hur de påverkar de i din omgivning. Varning är ett bra exempel på ett essentiellt bot-kommando."
                );
            }
        } else if (dravel.startsWith("role")) {
            if (meddelande.channel.id == "539847809004994560") {
                let role = meddelande.guild.roles.cache.find(
                    (role) => role.name === resten
                );
                if (role == undefined) {
                    meddelande.reply(
                        "I find no such company in this channel, perhaps you would like to try yandex.ru? Bear in mind that I am an important petter and meticulous about upper- and lowercase :)"
                    );
                } else {
                    console.log(role);
                    if (!meddelande.member.roles.cache.some((r) => r.name === resten)) {
                        meddelande.member.roles
                            .add(role)
                            .then(() => {
                                meddelande.reply(
                                    "I have spoken with the faculty and made the descision to grant your request. Welcome to the " +
                                    role.toString() +
                                    "-society!"
                                );
                            })
                            .catch((whoops) => {
                                if (
                                    whoops.toString() === "DiscordAPIError: Missing Permissions"
                                ) {
                                    meddelande.reply(
                                        "After some deep consideration I have reached the conclusion that you are not the kind of person we are looking for as " +
                                        role.toString()
                                    );
                                }
                            });
                    } else {
                        meddelande.reply(
                            "Thinking about it now, I have come to realize that you already are " +
                            role.toString() +
                            "! Unfortunately, I cannot make you double-" +
                            role.toString() +
                            " :("
                        );
                    }
                }
            } else {
                meddelande.reply(
                    "I would like to inform and remind you the technological littering is still littering, and by indulging in such vile activities you are tarnishing the sanctity of the channel. Please always make sure to post non-essential bot commands in" +
                    meddelande.guild.channels.cache.get("539847809004994560").toString() +
                    ". Try to think about your actions and how they affect those around you. Warning other player is a good example of an essential bot command."
                );
            }
        }
    }
}];