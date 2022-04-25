const { MessageEmbed } = require("discord.js");
const {
    getAllStatsFor,
    sanitizeDiscordUserId,
} = require("./wienerchickendinner.js");
const { matOchDryck } = require("./matOchDryck.js");
const { createSeededGenerator } = require("./podnaem.js");

const NA = ""

const skapaHjälteMatris = (resultat) => {
    let hjälteMatris = {}
    let matcher = resultat.reduce((acc, i) => {
        if (!acc[i.matchId]) {
            acc[i.matchId] = [];
        }
        hjälteMatris[i.username] = {};
        acc[i.matchId].push(i);
        return acc;
    }, {})
    const hjälteIdn = Object.keys(hjälteMatris)
    hjälteIdn.forEach(första => hjälteIdn.forEach(andra => (hjälteMatris[första][andra] = första != andra ? 0 : NA)))
    Object.values(matcher).forEach((match) => {
        let förlorare = match.filter(m => !m.win)
        match.filter(m => m.win).forEach((vinnaren) => {
            förlorare.forEach((förloraren) => {
                hjälteMatris[vinnaren.username][förloraren.username] = 1 + (hjälteMatris[vinnaren.username][förloraren.username] || 0)
                // hjälteMatris[förloraren.username][vinnaren.username] = (hjälteMatris[förloraren.username][vinnaren.username] || 0) - 1
            })
        })
    });
    return hjälteMatris
}

const beräknaSvarsMatris = (hjälteMatris) => {
    const hjälteIdn = Object.keys(hjälteMatris)
    svarsMatris = {};
    for (i of hjälteIdn) {
        svarsMatris[i] = {};
        for (j of hjälteIdn) {
            if (i != j) {
                svarsMatris[i][j] = hjälteMatris[i][j] > hjälteMatris[j][i] ? hjälteMatris[i][j] : 0;
            }
            else {
                svarsMatris[i][j] = NA
            }
        }
    }
    // console.log(svarsMatris)
    for (i of hjälteIdn) {
        for (j of hjälteIdn) {
            if (i != j) {
                for (k of hjälteIdn) {
                    if (i != k && j != k) {
                        svarsMatris[j][k] = Math.max(
                            svarsMatris[j][k],
                            Math.min(
                                svarsMatris[j][i],
                                svarsMatris[i][k])
                        )
                    }
                }
            }
        }
    }
    // console.log(hjälteMatris)
    // console.log(svarsMatris)
    return svarsMatris
}

const skapaLedarLista = (svarsMatris) => {
    const listan = Object.keys(svarsMatris)
    listan.sort((a, b) => svarsMatris[b][a] - svarsMatris[a][b])
    return listan
}

const discordium = (yapi) => `${yapi.user.username}#${yapi.user.discriminator}`
const userToName = (yapi) => yapi.nickname ? `${yapi.nickname} (${discordium(yapi)})` : discordium(yapi)

const skapaLedarBräde = (resultat, yapos, perSida = 10) => {
    const matris = beräknaSvarsMatris(skapaHjälteMatris(resultat))
    const ledarlista = skapaLedarLista(matris)
    // console.log(ledarlista)
    // console.log(matris)
    // console.log(yapos)
    const yaposById = yapos.reduce((acc, i) => (acc[i.user.id] = i) && acc, {})
    // console.log(yaposById)
    const genereraRandom = createSeededGenerator(ledarlista.slice(1).reduce((acc, i) => acc + matris[ledarlista[0]][i]));

    const embed = new MessageEmbed()
    .setTitle(`Smorgesbord for the biggest best peoples`)

    const bräde = ledarlista.map((i, z) => `${z+1}: ${yaposById[i] ? userToName(yaposById[i]) : i}: ${Object.keys(matris).reduce((acc, j) => acc + (i != j ? (genereraRandom()*2-1 > 0 ? matris[i][j] : matris[j][i]) : 0), 0)} pts`)
    embed.addFields("☭".repeat(Math.ceil(bräde.length/perSida)).split("").map((_, i) => ({
        name: {
            0: "The ten lagganiest",
            1: "Ten less so"
        }[i] || "and so on",
        value: bräde.slice(perSida*i, perSida*i+perSida).join("\n")
    })))
    // embed.addFields(bräde.map(b => ({ value: b })))
    // embed.addField('Top lagganista', bräde[0])
    // embed.addField('Second place', bräde[1])
    // embed.addField('Third loser', bräde[2])
    // bräde.slice(3).forEach((i, y) => embed.addField(`${y}`, i))
    const randos = [1, 2, 3, 4, 5].map((_) =>
        getMaxRandomishNumber(matOchDryck.length, genereraRandom)
    );
    embed
        .addField(
            "Dagens mackor: ",
            `${randos.map((i) => matOchDryck[i]).join(" ")}`
        );
    // console.log(embed)

    return embed;
}

module.exports = {
    triggervarningar: ["!smörgåsbord"],
    predikat: (meddelande, aleaIactaEst) => aleaIactaEst > 30 && meddelande.content.startsWith("!smörgåsbord"),
    skapaHjälteMatris,
    beräknaSvarsMatris,
    skapaLedarBräde,
    skapaLedarLista,
    handle: async (meddelande, args) => {
        try {
            const game = args?.[1];

            let resultat = await getAllStatsFor(game);
            if (!resultat||resultat?.length == 0) {
                return meddelande.reply("No data found");
            }
            // resultat = resultat.filter(i => /^\d+$/.test(i.username))
            const members = await meddelande.guild.members.fetch();
            if(!members){
                return meddelande.reply("Ajj i medlemmarna");
            }
            const ledarbrädet = skapaLedarBräde(resultat, members)

            await meddelande.channel.send({
                embeds: [
                    ledarbrädet
                        .setTimestamp()
                ],
            });

        } catch (e) {
            console.error(e)
        }
    },
};

function getMaxRandomishNumber(max, genereraRandom) {
    return Math.floor(genereraRandom() * (max + 1));
}
