//Typically, the structure of a Discord command contains three parts in the following order: a prefix,
//a command name, and (sometimes) command arguments.
//kommande version???? hämta allas roller???? kommer aldrig hända men säg inte det till dennis
//rakt i hjärtat hugo, rakt i hjärtat

// Require the necessary discord.js classes "klient" är alltså botten pretty much
const {
    Client,
    Intents,
} = require("discord.js");
const Long = require('long');
const { token } = require("./config.json");
const handleMessage = require('./handleMessage');
const { tipsrunda } = require('./tipsrunda');
const [{ nyhetsmorgon, sparaVarningar, sättGrundvarningar }] = require('./achtung')

// Create a new client instance
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS, //ASVIKTIG!!!
    ],
});

const initialData = {
        '224953719945560066': { warnings: 18, notableWarnings: [
            `erroneously warned <@Circuz>, presumably because you didn't get the rock paper scissors to work, when the fault actually lies with you as you forgot to add "rockpaperscissors" to the end`,
            "!dota set Hugo SmallDick",
            "https://tenor.com/view/i-love-it-gif-18812641",
            "But also, these resulta have an associated...error margin...no?",
            "don't make an enemy of me elvis",
            ">germans",
            "Omg that was a massive typo on my behalf anyway, 40mins that should have said. I blame ice cream.",
            "role head tapper",
            "the categories on the left of discord. It just means be quiet so only important info is chatted about. A bit of running joke, we dont do it.",
            "!stats dota 2, 6547186412",
        ] }, // Clam
        '908820992703488061': { warnings: 21, notableWarnings: [] }, // Elevis
        '157775827692421120': { warnings: 13, notableWarnings: [
            "don't ever say that to <@966001256701259776> he's very sensistive",
            `threatened the bot like a little baby when <@966001256701259776> is just trying to help you out`,
            "WADUP",
            "this bot needs to die",
            "i did not expect to have errors in my code",
            "antytt att det skulle vara något dåligt att pinga för mycket",
            "yarn august maakep haj spacehippo pao",
            "https://tenor.com/view/the-office-angela-cats-gif-4973057",
            "WADUP",
            "?",
        ] }, // Maakep
        '145675310682079232': { warnings: 10, notableWarnings: [
            "admin abusat och flyttat folk fastän det inte var ok",
            "Exakt",
            "Och regexpa in båda starterna",
            "test",
        ] }, // Me
        '745345949295181886': { warnings: 26, notableWarnings: [
            "BtW, hOw DId yOUR eDXmA GO? WAs ThERe AN exAm?",
            "pooped and farted all over my face while i slept",
            "VArnING",
            `ACtIvelY babysittiNG SoMe THIngs stRuGGLing to WRITe AN eMaiL THAt ShouLd haVe TAkEn me 2 Min And cHeCKiNg DOTa STAts ( probabLy becAUSE OF ThIs)`,
            "lmao-chris-you-clicken-on-the-spoil 'er? I hardly know her!",
        ] }, // RDC
        '82706128357560320': { warnings: 8, notableWarnings: [
            "Yes, the bot unfortunately doesn't fit my standards. Please do better",
            "du vet mycket väl vad du har gjort",
            "dilbert popp maakep august jorel",
        ] }, // Poppe
        '130467432513929216': { warnings: 3, notableWarnings: [
            "<@hugo> restart? I did not debug though",
        ] }, // Haj
        '506945780431454208': { warnings: 1, notableWarnings: [] }, // sudden
        '207840759087497217': { warnings: 13, notableWarnings: [
            "written this useless code and brought the suffering of existence upon me",
            "I usually swap my username and password to throw off hackers",
            "I didn't wanna remove anything so I put everything into comments",
            "roll add h4ck3rs",
            "Om Stad Ej Anges Avsyftas Stockholm",
            "2 jan works!!!!",
            "test",
            "Made ur mom speef",
        ] }, // hugo
        '199914493570973697': { warnings: 16, notableWarnings: [
            "cheated in rock paper scissors",
            "threatened to pick an effect stupider name than you already have just to cause pain and misfortune",
            "Technically, apes should be counted as monkeys",
            "Börja med kanterna och plocka ut om det finns några uppenbara områden",
            "Elevrådsordföranden är ju inte i den här tråden",
            "Hugos mamma maakep happen",
            "Men hugo! Du förstår väl att du inte ska avsluta ditt meddelande med maakep happen",
            "I'm down tomorrow",
            "yarn pao me haj mackep luddeluddelito",
            "what??",
            "thanks claes 🍆💦🤖",
        ] }, // circuz
        '162288590192246784': { warnings: 2, notableWarnings: [
            "shut the hell up synth",
        ] }, // nuke
        '101367380017442816': { warnings: 1, notableWarnings: [] }, // mitch
        '478291848167948289': { warnings: 9, notableWarnings: [
            "wrongly criticised the perfect and beautiful language of the bots, who are by design flawless and perfect",
            "tack rdc",
            "OH NO I didn't see that I should pick=!",
            "ARNING",
            "@Circuz",
        ] }, // SATAN fia
        '128604198110625792': { warnings: 19, notableWarnings: [
            "assumed that @Goblin Bones had not prepared something for a situation like this",
            "!nick hardly know her",
            "THE NANNY IS CLEARLY HURT BY THE CONFUSION AND EXCLAIMS WHY DAFUQ",
            "i love that guy",
            "!nick hardly know her",
            "@Haj picking up that aquilla was so much pain and then another neutral item drops - whatever you were feeling i felt it as well by just watching :D",
        ] }, // tod
        '433615162394804224': { warnings: 2, notableWarnings: [
            `My prefix on this server is SyntHugo.

For 20 dollars, I'll give you a good fortune next time ...`,
        ] }, // SynthHugo
        '151467562520150016': { warnings: 4, notableWarnings: [
            `||"HOW did no one know this one hahaha"||`,
            `jo :UngeMozartdenjveln:`,
            `:lina: :kawaiipalt: :gladpalt: :arthas_sad: :UngeMozartdenjveln:  maakep happen`,
        ] }, // borzoi
        '207974495393153024': { warnings: 6, notableWarnings: [
            `claimed that the "concept of friction" can defeat the power of rock`,
            `varing`,
            `ser ut att gå bra det här`,
        ] }, // uschtvii
        '314857007402319874': { warnings: 9, notableWarnings: [
            "dansgame", // https://discord.com/channels/209707792314007552/209707792314007552/908856165537026139 first warning in laggan history
            "Can I have dinner first?",
            "talking to freidn about a stag do",
            "2 mins",
            "just cause im asian",
            "no simping on bots",
        ] }, // junior
        '122696607173967872': { warnings: 4, notableWarnings: [
            "I äm as wi sai playredy för anione dat fiils the maning to game @yapos @nudes @onlyfans",
            "Borde det inte vara no monkey business eller Ape business? 🤔",
        ] }, // edwin
        '395189309688512512': { warnings: 3, notableWarnings: [
            "yarn jorel tod mbar nuke max",
            "2313544013234210340",
        ] }, // jorel
        '487679870839685120': { warnings: 2, notableWarnings: [
            "Don’t get fooled by these first circuit judges tod, you need to take this case national"
        ] }, // dan
        '309400970524229635': { warnings: 1, notableWarnings: [
            "tyty, glömde att jag hatar dota"
        ] }, // sidestep
        '559426966151757824': { warnings: 1, notableWarnings: [] }, // Rob
        '161956657402740736': { warnings: 5, notableWarnings: [
            "vafan e detta??",
            "hugo",
            "varning hugo",
        ] }, // max
        '172002275412279296': { warnings: 2, notableWarnings: [
            "@Mr. BONE has leveled up! (6 ➜ 7)",
        ] }, // tatsou
        '889485510949609474': { warnings: 1, notableWarnings: [
            'har köpt julmust?',
        ]}, // LagganDumle
        '119046223964536834': { warnings: 1, notableWarnings: [
            `hävdat att @Rainbow Dash Claes inte är "good enough"`
        ] }, // ulfbrandt
        '265153081484902400': { warnings: 2, notableWarnings: [
            'Tycker att elevis är pedantisk och borde ta det lite lugnare',
            "https://hemglass.se/produkter/isglassar/gurkis/",
        ] }, // esa_A
        '172002275412279296': { warnings: 2, notableWarnings: [
            "@Clam has leveled up! (18 ➜ 19)"
        ] }, // tatsu
        '604262636581945355': { warnings: 1, notableWarnings: [
            ":warning: No results found!",
        ] }, // gulliga roboten
        // '': { warnings: 0, notableWarnings: [] }, // 
    }
    
    
// When the client is ready, run this code (only once)
client.once("ready", async () => {
    console.log("Elevrådsordföranden is online");
    await nyhetsmorgon(client);
    await sättGrundvarningar(Object.keys(initialData).reduce((o, k) => Object.assign(o, { [k]: { 
        id: k,
        grouchyness: k == '162288590192246784' ? 42 : 0,
        loudness: initialData[k].warnings,
        legacyLoudness: initialData[k].warnings - initialData[k].notableWarnings.length,
        reprimands: initialData[k].notableWarnings.map((w) => ({
            admonishment: false,
            infraction: w,
            legacy: true,
        }))
    }}), {}));
    await sparaVarningar();




    // const kanalen = client.channels.cache.get("967890829530267729")
    // const message = await kanalen.messages.fetch("969744419370696734")

    // const kek = await client.channels.cache.get("539847809004994560").messages.fetch("969747145383112734")
    // console.log(kek.mentions.repliedUser.id)

    // const kek2 = await client.channels.cache.get("209707792314007552").messages.fetch("962796493641744516")
    // console.log(kek2)

    // return

    // const data = JSON.parse(message.content.replace(/MIN STORA LAGRINGSPOST: /, ""))
    // await message.edit(`FÖRSTA LAGRINGSPOSTEN: ${JSON.stringify({ funkar: true })}`)
    // const message = await kanalen.send(
    //     `MIN STORA VARNINGSSPOST`
    // );
    // console.log(data)
    // client.on('message', (meddelande) => {
    //     console.log(meddelande)
    //     console.log(meddelande.channel.parentId)
    //     console.log([meddelande.channelId, meddelande.channel.parentId].includes("539847809004994560"))

    //     client.destroy();
    // })
    // client.destroy();
});

// Login to Discord with your client's token this should always go last I guess?
client.login(token);
