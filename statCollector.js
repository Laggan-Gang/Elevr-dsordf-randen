//En message collector
//En thread intent

module.exports = {
  statCollector: async (meddelande) => {
    let trådNamn = `The ${meddelande.member.displayName} Stat Collection`;
    const tråden = await meddelande.channel.threads.create({
      name: trådNamn,
      autoArchiveDuration: 60,
      reason: `${trådNamn}`,
    });
    let teamsArray = [];

    await tråden.send(
      "Happy to help you report these stats! What players were on the winning team?"
    );
    // `m` is a message object that will be passed through the filter function
    const filter = (m) => m.author.id == meddelande.author.id;
    // Await !vote messages
    // Errors: ['time'] treats ending because of the time limit as an error
    const teamCollector = await channel.awaitMessages({
      filter,
      max: 1,
      time: 360_000,
      errors: ["time"],
    });

    console.log(teamCollector.collected);
  },
};

//Thread creation
//Creations
//Who were the players on team 2? array team 2
//Who were the players on team 3 (if no more teams, react with x)?
//Which team won?
//Does this looks good?
