const { kostnad, hittaTips, tipsrunda } = require('./tipsrunda')


function createTriggers(...strings) {
    return strings.map(string => ({ triggervarningar: [[...string ]]}));
}

jämför = (a, b) => [Array.from(a).map((_, i) => i), Array.from(a), Array.from(b)];

test('distance calculations are correct', () => {
    expect(kostnad(...jämför("kitten", "sitting"))).toBe(3)
    expect(kostnad(...jämför("role", "roll"))).toBe(1)
    expect(kostnad(...jämför("aa", "ab"))).toBe(1)
    expect(kostnad(...jämför("𨨏ajs", "bajs"))).toBe(1)
    expect(kostnad(...jämför("rulla", "rull"))).toBe(1)
    expect(kostnad(...jämför("rull", "rulla"))).toBe(1)

    // Still borken, need better löfvenskij
    // expect(kostnad(...jämför("!roll", "roll"))).toBe(1) 
})

test('hittaTips should find some tips sometimes', () => {
    expect(hittaTips([..."roll"], createTriggers("bajs"))).toBe(false)
    expect(hittaTips([..."roll"], createTriggers("roller", "role"))).toBe("role")
    expect(hittaTips([..."roll"], createTriggers("role", "roller"))).toBe("role")
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
    // tipsrunda(createTriggers("!roll"), meddelande) 
    // expect(meddelande.reply.mock.calls.length).toBe(3)
})