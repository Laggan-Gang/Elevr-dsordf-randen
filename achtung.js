let varningar = 0;

module.exports = [{
    triggervarningar: ["varning", "warning"],
    predikat: (meddelande) => /^(varning|warning)/.test(meddelande.content.toLocaleLowerCase()) && meddelande.type === "REPLY",
    handle: async function elevRådsOrdförande(meddelande) {
        let brottet = await meddelande.channel.messages.fetch(
            meddelande.reference.messageId
        );
        varningar++;
        let dravel = meddelande.content.toLocaleLowerCase();
        let resten = meddelande.content.slice(5);
        let brottsling = meddelande.mentions.repliedUser;
        var bevis = "";
        if (brottet.content !== "") {
            bevis = '"' + brottet.content + '" ';
        }
        if (dravel.startsWith("varning")) {
            brottet.reply(
                `Det här är INTE acceptabelt beteende ${meddelande.mentions.repliedUser.toString()}! Du kan se det här som en formell varning och jag hoppas *innerligt* att du funderar både en och två gånger innan du postar ${bevis}igen! Det här är varning nummer ${varningar}`
            );
        } else if (dravel.startsWith("warning")) {
            brottet.reply(
                `This is NOT acceptable behaviour ${meddelande.mentions.repliedUser.toString()}! You can consider this a formal warning and I *sincerely* hope you will think twice about posting ${bevis}again! This is warning number ${varningar}`
            );
        }
    }
},
{
    predikat: (meddelande) => meddelande.content.startsWith("<@"),
    handle: async function motiveradVarning(meddelande) {
        const arr = meddelande.content.split(" ");
        const warned = arr[0];
        const command = arr[1];
        const orsak = arr.slice(2).join(" ");
        if (!command.endsWith("arning")) {
            return;
        }
        switch (command) {
            case "varning":
                await meddelande.channel.send(
                    `${warned} du har blivit varnad eftersom du har "${orsak}". Det vore kanske bäst att tänka efter lite nästa gång, så vi inte har en till situation där du ${orsak} igen.`
                );
                break;
            case "warning":
                await meddelande.channel.send(
                    `${warned} you have been warned on account of having "${orsak}". Perhaps it would be wise to think twice, so we can avoid another situation in which you have ${orsak} again.`
                );
                break;
        }
        try {
            await meddelande.delete();
        } catch (error) {
            console.error(error);
        }
    }
}];