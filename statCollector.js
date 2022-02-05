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
    await openingQuery(tråden);
    // `m` is a message object that will be passed through the filter function
    const filter = (m) => m.author.id == meddelande.author.id;
    // Await !vote messages
    // Errors: ['time'] treats ending because of the time limit as an error
    const teamsArray = [await dataCollection(tråden, filter)];
    await followUpQuestion(tråden, teamsArray);
    const teamsArray2 = [await dataCollection(tråden, filter)];
    const teamsArrayForever = await interrogationIntensifies(tråden, filter);
  },
};

async function openingQuery(tråden) {
  await tråden.send(
    "Happy to help you report these stats! What players were on the winning team?"
  );
}

async function followUpQuestion(tråden, teamsArray) {
  await tråden.send(
    `Okay! So ${teamsArray[0]} were on the winning team. Who were on the other team?`
  );
}

async function someFuckingFiestaHereIGuess(tråden, filter) {
  console.log("Fiesta is here");
  await tråden.send("Who were on the next team?");
  const teamsForever = [await dataCollection(tråden, filter)];
  console.log(teamsForever);
  const blackSiteResults = await interrogationIntensifies(tråden, filter);
  console.log(blackSiteResults);
  const testingSiteExploded = teamsForever.concat(blackSiteResults);
  console.log(testingSiteExploded);
  return testingSiteExploded;
}

async function interrogationIntensifies(tråden, filter) {
  const botMeddelande = await tråden.send(
    `Would you like to add additional teams?`
  );
  await botMeddelande.react("✅");
  await botMeddelande.react("❎");
  const rFilter = (reaction, user) => {
    return (
      !user.bot &&
      (reaction.emoji.name === "✅" || reaction.emoji.name === "❎")
    );
  };
  const reactionCollector = botMeddelande.createReactionCollector({
    rFilter,
    time: 360_000,
    max: 1,
  });

  const decision = await botMeddelande.awaitReactions({
    rFilter,
    max: 1,
  });
  console.log(decision);
  switch (true) {
    case decision.first().emoji.name === "✅":
      console.log("Nu ska vi köra fiestan");
      return someFuckingFiestaHereIGuess(tråden, filter);
    case decision.first().emoji.name === "❎":
      return;
  }
}

async function dataCollection(tråden, filter) {
  const teamCollector = await tråden.awaitMessages({
    filter,
    max: 1,
  });
  return teamCollector.first().content;
}
//Thread creation
//Creations
//Who were the players on team 2? array team 2
//Who were the players on team 3 (if no more teams, react with x)?
//Which team won?
//Does this looks good?
