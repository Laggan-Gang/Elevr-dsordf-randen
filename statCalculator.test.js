const {
    Client,
    Intents,
  } = require("discord.js");
const { handle } = require('./help');
const { token } = require("./config.json");
const { beräknaSvarsMatris, skapaHjälteMatris, skapaLedarBräde, skapaLedarLista } = require('./statCalculator');



const resultat = (win, username, matchId) => ({ win, username, matchId })
const skapaMatch = (vinnare, förlorare, matchId) => [resultat(true, vinnare, matchId), resultat(false, förlorare, matchId)]



const schulzeTillMatcher = (sekvens, antal, z) => (x = 1) && "☭".repeat(antal - 1).split("☭").reduce((acc) => acc.concat(sekvens.slice(0, -1).split("").flatMap((ic, i) => sekvens.slice(i + 1).split("").flatMap((jc) => skapaMatch(ic, jc, (acc?.slice(-1)[0]?.matchId || z) + (x++))))), [])
const schulzeMock = () => {
    const resultaten = [
        [5, "ACBED"],
        [5, "ADECB"],
        [8, "BEDAC"],
        [3, "CABED"],
        [7, "CAEBD"],
        [2, "CBADE"],
        [7, "DCEBA"],
        [8, "EBADC"],
    ].reduce((acc, [antal, sekvens]) => acc.concat(schulzeTillMatcher(sekvens, antal, acc?.slice(-1)[0]?.matchId || 0)), [])
    resultaten.sort((a, b) => a.username.charCodeAt(0) - b.username.charCodeAt(0))
    return resultaten;
}

test('skapaHjälteMatris borde räkna ut korrekta par', () => {
    const resultaten = schulzeMock()
    const hjälteMatris = skapaHjälteMatris(resultaten);
    expect(hjälteMatris).toMatchObject({
        A: { B: 20, C: 26, D: 30, E: 22 },
        B: { A: 25, C: 16, D: 33, E: 18 },
        C: { A: 19, B: 29, D: 17, E: 24 },
        D: { A: 15, B: 12, C: 28, E: 14 },
        E: { A: 23, B: 27, C: 21, D: 31, }
    })
})


test('beräknaSvarsMatris should be kinda ok schulze', () => {
    expect(beräknaSvarsMatris({
        A: { B: 20, C: 26, D: 30, E: 22 },
        B: { A: 25, C: 16, D: 33, E: 18 },
        C: { A: 19, B: 29, D: 17, E: 24 },
        D: { A: 15, B: 12, C: 28, E: 14 },
        E: { A: 23, B: 27, C: 21, D: 31, }
    }))
        .toMatchObject({
            A: { B: 28, C: 28, D: 30, E: 24 },
            B: { A: 25, C: 28, D: 33, E: 24 },
            C: { A: 25, B: 29, D: 29, E: 24 },
            D: { A: 25, B: 28, C: 28, E: 24 },
            E: { A: 25, B: 28, C: 28, D: 31 },
        })
})

test('skapaLedarLista works with schulze data', () => {
    expect(skapaLedarLista({
        A: { B: 28, C: 28, D: 30, E: 24 },
        B: { A: 25, C: 28, D: 33, E: 24 },
        C: { A: 25, B: 29, D: 29, E: 24 },
        D: { A: 25, B: 28, C: 28, E: 24 },
        E: { A: 25, B: 28, C: 28, D: 31 },
    })).toEqual(["E","A","C","B","D"])
})

test('skapaLedarBräde works', () => {
    let meddelande = skapaLedarBräde(schulzeMock(), [
        { nickname: "Vinnaren", user: { username: "EEEE", discriminator: 1337, id: "E" } },
        { user: { username: "Abrakadabra", discriminator: 1234, id: "A" } },
        { user: { username: "Balakazham", discriminator: 5678, id: "B" } },
        { user: { username: "Cerebrum", discriminator: 7356, id: "C" } },
        { user: { username: "Drängen", discriminator: 6969, id: "D" } },
    ], 2);
})
// test('skapaLedarBräde works', () => {
//     let meddelande = skapaLedarBräde([
//         [1, 2],
//         [2, 3],
//         [3, 4],
//         [2, 4],
//         [4, 1]
//     ].flatMap((spelare, i) => skapaMatch(spelare[0], spelare[1], i)));    
// })
// test('handle', async () => {
//     // Create a new client instance
//     const client = new Client({
//         intents: [
//           Intents.FLAGS.GUILDS,
//           Intents.FLAGS.GUILD_MESSAGES,
//           Intents.FLAGS.GUILD_MEMBERS,
//           Intents.FLAGS.GUILD_VOICE_STATES,
//           Intents.FLAGS.GUILD_MESSAGE_REACTIONS, //ASVIKTIG!!!
//         ],
//       });
//     const startup = new Promise((resolve) => {
//         client.once('ready', () => {
//             resolve(true)
//         })
//     });
//     await client.login(token);
//     await startup
//     await handle()
//     client.destroy()
//     await new Promise((resolve) => {
//         setTimeout(() => resolve(), 500);
//     });
// })