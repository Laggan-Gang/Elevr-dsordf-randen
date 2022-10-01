const protobuf = require('protobufjs');
const {
    MessageAttachment,
} = require("discord.js");
const axios = require("axios");
const bufferToWav = require('./bufferToWav');

const dukanva = "967890829530267729";
const varningarnasHem = "969744419370696734";

let varningarna = {};
let globalClient = { current: undefined }

const fraser = [
    "MIN STORA LAGRINGSPOST:",
    "MY BUNDLE OF JOY:",
    "THE NAUGHTY LIST:",
]

let proto = {};
let Base = {};
let Stoopid = {};
let Rebuke = {};
const loaded = new Promise((resolve) => {
    protobuf.load("achtung.proto", (error, root) => {
        if (error) {
            console.error("error loading proto:", error)
            throw error;
        }
        proto = root;
        Base = proto.lookupType("Base");
        Stoopid = proto.lookupType("Stoopid");
        Rebuke = proto.lookupType("Rebuke");
        resolve(true);
    });
});

const getStoopid = (id) => {
    if (!(id in varningarna)) {
        varningarna[id] = {
            id,
        };
    }
    return varningarna[id]
}

async function hämtaMeddelandet() {
    const kanalen = globalClient.current.channels.cache.get(dukanva)
    return await kanalen.messages.fetch(varningarnasHem)
}

async function räknaUtVarningar(x) {

}

const messages = {
    "varning": {
        "sv": (brottsling, bevis, varningar) => `Det här är INTE acceptabelt beteende ${brottsling.toString()}! Du kan se det här som en formell varning och jag hoppas *innerligt* att du funderar både en och två gånger innan du postar ${bevis}igen! Det har redan fått ${varningar} varningar innan, passa dig!`,
        "en": (brottsling, bevis, varningar) => `This is NOT acceptable behaviour ${brottsling.toString()}! You can consider this a formal warning and I *sincerely* hope you will think twice about posting ${bevis}again! You've already been warned ${varningar} times before, watch out!`,
    },
    "who_do_you_think_you_are": {
        "sv": (previous_count) => `Vem tror du att du är?! Varna mig?! Nu får du allt skärpa dig.${previous_count > 5 ? ` Du har gjort det här ${previous_count} gånger förut! Snart har jag fått nog på ditt beteende...` : ""}`,
        "en": (previous_count) => `Who do you think you are?! Warn me?! You need to take a look in the mirror.${previous_count > 5 ? ` You've done this ${previous_count} times before! I'm running out of patience...` : ""}`,
    },
    "not_claes": {
        "sv": (previous_count) => `Nej du, Claes gjorde faktiskt inget fel. ${previous_count > 10 ? "Varför ska du alltid mobba Claes såhär? Får du någon slags pervers njutning av att sparka på den som ligger ner?" : "Jag tänker inte utfärda någon sådan varning, prova igen imorgon."}`,
        "en": (previous_count) => `Oh no, Claes did nothing wrong. ${previous_count > 10 ? "Why must you always bully Claes like this? Do you get some form of sick pleasure out of it? Warning to you good sir!" : "I will not be issuing a warning today, and that is final."}`,
    },
    "busybody": {
        "sv": (grouchyness) => `Vet du, du har faktiskt redan gett ut ${grouchyness} varningar, är det inte dags att du tar en promenad istället?`,
        "en": (grouchyness) => `You know, you've already given out ${grouchyness} warnings, isn't it about time you go for a walk instead?`,
    },
    "notable_warning": {
        "sv": (warned, orsak) => `${warned} du har blivit varnad eftersom du har "${orsak}". Det vore kanske bäst att tänka efter lite nästa gång, så vi inte har en till situation där du ${orsak} igen.`,
        "en": (warned, orsak) => `${warned} you have been warned on account of having "${orsak}". Perhaps it would be wise to think twice, so we can avoid another situation in which you have ${orsak} again.`,
    }
}

module.exports = [{
    triggervarningar: ["varning", "warning"],
    sättGrundvarningar: async (nyaVarningar) => {
        varningarna = nyaVarningar
        return true;
    },
    nyhetsmorgon: async (client) => {
        globalClient.current = client;
        const meddelandet = await hämtaMeddelandet();
        const att = meddelandet.attachments.first();
        const response = await axios.get(att.url, {
            responseType: 'arraybuffer'
        });
        try {
            const foo = Buffer.from(response.data, 'binary');
            const nyaVarningar = Base.decode(foo.slice(44)).members
            varningarna = nyaVarningar
        } catch (e) {
            console.error("Ooops my data is borked")
            throw e
        }
    },
    sparaVarningar: async function sparaVarningar() {

        await loaded;

        const msgToSave = { members: varningarna };
        const errMsg = Base.verify(msgToSave);
        if (errMsg)
            throw Error(errMsg);

        var dataBuffer = Base.encode(msgToSave).finish();

        const wavBuffer = await bufferToWav(dataBuffer)

        const attachment = new MessageAttachment(wavBuffer, 'iasid.wav');
        // attachment.setSpoiler(true);
        attachment.setDescription("Nej nu ni")
        // console.log("start saving")
        const meddelandet = await hämtaMeddelandet();
        await meddelandet.edit({
            content: `${fraser[Math.floor(Math.random() * fraser.length)]}${JSON.stringify({ mumsbitar: dataBuffer.length })}`,
            files: [attachment],
        });
        // console.log("done saving")
    },
    predikat: (meddelande) => /^(varning|warning)/.test(meddelande.content.toLocaleLowerCase()) && meddelande.type === "REPLY",
    handle: async function elevRådsOrdförande(meddelande) {
        const brottet = await meddelande.channel.messages.fetch(
            meddelande.reference.messageId
        );
        const dravel = meddelande.content.toLocaleLowerCase();
        const language = dravel[0] == "v" ? "sv" : "en";
        const brottsling = meddelande.mentions.repliedUser;
        const moriarty = getStoopid(brottsling.id)
        const golare = getStoopid(meddelande.author.id)

        let claes = true;
        switch (true) {
            case brottsling.id == "908820992703488061":
                claes = false
            case brottsling.id == "745345949295181886":
                meddelande.reply(messages[claes ? "who_do_you_think_you_are" : "not_claes"](golare.ungratefulness || 0))
                golare.ungratefulness = 1 + (golare.ungratefulness || 0)
                break
            case golare.grouchyness > moriarty.loudness * 2: // You're a busybody
                meddelande.reply(messages["busybody"](golare.grouchyness))
                break
            default:
                brottet.reply(messages["varning"][language](brottsling, brottet.content !== "" ? '"' + brottet.content + '" ' : '', moriarty.loudness))
                golare.grouchyness = 1 + (golare.grouchyness || 0)
                moriarty.loudness = 1 + (moriarty.loudness || 0)
                moriarty.reprimands.push({
                    admonishment: false,
                    id: brottet.id,
                    infraction: brottet.content.toString(),
                    legacy: false,
                    sender: golare.id,
                });
        }
        sparaVarningar();
    }
},
{
    predikat: (meddelande) => meddelande.content.startsWith("<@") && /<@\d+> [wv]arning/.test(meddelande),
    handle: async function motiveradVarning(meddelande) {
        const arr = meddelande.content.split(" ");
        const warned = arr[0];
        const warnedId = arr.warned.slice(2, -1);
        const moriarty = getStoopid(warnedId)
        const golare = getStoopid(meddelande.author.id)

        const command = arr[1] || "";
        const orsak = arr.slice(2).join(" ");


        const language = command[0] == "v" ? "sv" : "en";
        try {
            switch (true) {
                case brottsling.id == "908820992703488061":
                    claes = false
                case brottsling.id == "745345949295181886":
                    meddelande.reply(messages[claes ? "who_do_you_think_you_are" : "not_claes"](golare.ungratefulness || 0))
                    golare.ungratefulness = 1 + (golare.ungratefulness || 0)
                    break
                case golare.grouchyness > moriarty.loudness * 3: // Busybody detection
                    meddelande.reply(messages["busybody"](golare.grouchyness))
                    break
                default:
                    const varningen = await meddelande.channel.send(messages["notable_warning"][language](warned, orsak));
                    golare.grouchyness = 1 + (golare.grouchyness || 0)
                    moriarty.loudness = 1 + (moriarty.loudness || 0)
                    moriarty.reprimands.push({
                        admonishment: true,
                        id: varningen.id,
                        infraction: orsak,
                        legacy: false,
                        sender: golare.id,
                    });
                    meddelande.delete()

            }
        } catch (error) {
            console.error(error);
            try {
                emailAndTextMessageTodAndHisParents("tod fix this????");
            } catch(e) {
                meddelande.reply(language == "sv" ? "tod hade sönder nåt" : "tod broke something");
            }
        }
    }
}];