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

// Still borken, need better löfvenskij
verifieraKostnad("roll", "!roll", 1)
verifieraKostnad("!roll", "roll", 1)
verifieraKostnad("Saturday", "Sunday", 3)
verifieraKostnad("Sunday", "Saturday", 3)

test('hittaTips should find some tips sometimes', () => {
    expect(hittaTips([..."roll"], createTriggers("bajs"))).toBe(false)
    expect(hittaTips([..."roll"], createTriggers("roller", "role"))).toBe("role")
    expect(hittaTips([..."roll"], createTriggers("role", "roller"))).toBe("role")
    // Still borken, need better löfvenskij
    expect(hittaTips([..."roll"], createTriggers("!roll"))).toBe("!roll")
    expect(hittaTips([..."!roll"], createTriggers("roll"))).toBe("roll")
    expect(hittaTips([..."I'll"], createTriggers("roll"))).not.toBe("roll")
    expect(kostnad(...jämför("!roll", "roll"))).toBe(1) 
})


skapaImitationsMeddelande = (meddelande) => ({ content: meddelande, reply: jest.fn() })
test('tipsrunda should reply with a nice tip sometimes', () => {
    let meddelande = skapaImitationsMeddelande("roll");
    tipsrunda(createTriggers("role"), meddelande)
    expect(meddelande.reply.mock.calls.length).toBe(1)
    expect(meddelande.reply.mock.calls[0][0]).toMatch(/role/)

    tipsrunda(createTriggers("bajs"), meddelande)
    expect(meddelande.reply.mock.calls.length).toBe(1)

    tipsrunda(createTriggers("roller"), meddelande)
    expect(meddelande.reply.mock.calls.length).toBe(2)

    // Still bork
    tipsrunda(createTriggers("!roll"), meddelande) 
    expect(meddelande.reply.mock.calls.length).toBe(3)
})