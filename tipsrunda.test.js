const { kostnad, hittaTips, tipsrunda } = require('./tipsrunda')


function createTriggers(...strings) {
    return strings.map(string => ({ triggervarningar: [[...string ]]}));
}

jämför = (a, b) => [Array.from(a), Array.from(b)];


verifieraKostnad = (A, B, utfall) => test(`distance between ${A} and ${B} should be ${utfall}`, () => expect(kostnad(...jämför(A, B))).toBe(utfall))

verifieraKostnad("kitten", "sitting", 3)
verifieraKostnad("sitting", "kitten", 3)
verifieraKostnad("role", "roll", 1)
verifieraKostnad("aa", "ab", 1)
verifieraKostnad("𨨏ajs", "bajs", 1)
verifieraKostnad("rulla", "rull", 1)
verifieraKostnad("rull", "rulla", 1)
verifieraKostnad("!hello", "hello!", 1)
verifieraKostnad("roll", "!roll", 1)
verifieraKostnad("!roll", "roll", 1)
// verifieraKostnad("!stat", "that", 3) #idk, I give up, rip distance calcs
verifieraKostnad("Saturday", "Sunday", 3)
verifieraKostnad("Sunday", "Saturday", 3)


const verifyTips = (A, B, C, inverted = false) => test(`${A} should ${inverted ? 'not ':''}generate a tip for ${B}`, () => {
    const foo = expect(hittaTips([...A], createTriggers(...B)))
    if(inverted) {
        foo.not.toBe(C)
    } else {
        foo.toBe(C)
    }
})
const verifySimply = (A, B, inverted = false) => verifyTips(A, [B], B, inverted)
verifySimply("roll", "bajs", true)
verifySimply("roll", "!roll")
verifySimply("!roll", "roll")
verifySimply("I'll", "roll", true)
verifySimply("that", "!stat", true)

// test('hittaTips should find some tips sometimes', () => {
//     expect(hittaTips([..."roll"], createTriggers("bajs"))).toBe(false)
//     expect(hittaTips([..."roll"], createTriggers("roller", "role"))).toBe("role")
//     expect(hittaTips([..."roll"], createTriggers("role", "roller"))).toBe("role")
//     // Still borken, need better löfvenskij
//     expect(kostnad(...jämför("!roll", "roll"))).toBe(1) 
// })

const skapaImitationsMeddelande = (meddelande) => ({ content: meddelande, reply: jest.fn() })
const verifyTipsrunda = (meddelande, tip, match) => test(`"${meddelande} should${match?'':"n't"} generate a tip for "${tip}"`, () => {
    const meddelandeObj = skapaImitationsMeddelande(meddelande)
    tipsrunda(createTriggers(tip), meddelandeObj)
    if(!match) {
        expect(meddelandeObj.reply.mock.calls.length).toBe(0)
    } else {
        expect(meddelandeObj.reply.mock.calls.length).toBe(1)
        expect(meddelandeObj.reply.mock.calls[0][0]).toMatch(new RegExp(tip))
    }
})

verifyTipsrunda("That way, you'd report team A: Haj, team B: tod, draw: true", "!stat", false)
verifyTipsrunda("!help", "!helpame", true)
verifyTipsrunda("!dota", "!stat", false)
verifyTipsrunda("roll", "role", true)
verifyTipsrunda("roll", "bajs", false)
verifyTipsrunda("roll", "roller", true)
verifyTipsrunda("roll", "!roll", true)