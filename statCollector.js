//En message collector
//En thread intent

const { DiscordAPIError, MessageEmbed } = require("discord.js");

module.exports = {
  statCollector: async (meddelande) => {
    const arr = meddelande.content.split(" ");
    const game = kapitalisera(arr[1]);
    const matchId = arr[2];
    if (typeof game === "undefined") {
      meddelande.reply(
        "Please specify what game you're looking to LaggStat by typing '!big *example*'"
      );
      return;
    } else if (game.toLowerCase().includes("example")) {
      meddelande.reply("Very clever wow haha great joke >:(");
      return;
    }
    const trådNamn = `The ${meddelande.member.displayName} Stat Collection`;
    const tråden = await meddelande.channel.threads.create({
      name: trådNamn,
      autoArchiveDuration: 60,
      reason: `${trådNamn}`,
    });

    const filter = (m) => m.author.id == meddelande.author.id;
    const winnerArr = await openingQuery(tråden, filter, game);
    const participArr = await followUpQuestion(tråden, winnerArr, filter);
    const optionalParticipArr = await interrogationIntensifies(tråden, filter);
    prettyConfirmation(
      tråden,
      game,
      winnerArr,
      participArr,
      optionalParticipArr
    );
  },
};

function kapitalisera(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function kapitalArray(array) {
  let kapitaliserad = array.map((namn) => {
    return kapitalisera(namn);
  });
  return kapitaliserad;
}

async function dataCollection(tråden, filter) {
  const teamCollector = await tråden.awaitMessages({
    filter,
    max: 1,
    time: 180_000,
    errors: ["time"],
  });
  //Just prettying things up and returning it as an array
  return kapitalArray(teamCollector.first().content.split(" "));
}

async function yesOrNo(message) {
  const rFilter = (reaction, user) => {
    return (
      !user.bot &&
      (reaction.emoji.name === "✅" || reaction.emoji.name === "❎")
    );
  };
  await message.react("✅");
  await message.react("❎");
  const decision = await message.awaitReactions({
    filter: rFilter,
    max: 1,
    time: 180_000,
    errors: ["time"],
  });
  switch (true) {
    case decision.first().emoji.name === "✅":
      return true;
    case decision.first().emoji.name === "❎":
      return false;
  }
}

async function someFuckingFiestaHereIGuess(tråden, filter) {
  await tråden.send("Who were on the next team?");
  const morePlayers = await dataCollection(tråden, filter);
  //Create an array to push each new supplied team into array
  const teamsForever = [];
  teamsForever.push(morePlayers);
  //Do it over again to ask and see if we get more players
  const blackSiteResults = await interrogationIntensifies(tråden, filter);
  //Since we will eventually return undefined when we break the loop, we make sure it
  //isn't added to our array
  if (blackSiteResults !== undefined) {
    const testingSiteExploded = teamsForever.concat(blackSiteResults);
    return testingSiteExploded;
  } else {
    return teamsForever;
  }
}

async function interrogationIntensifies(tråden, filter) {
  const botMeddelande = await tråden.send(
    `Would you like to add additional teams?`
  );
  const yN = await yesOrNo(botMeddelande);
  if (yN) {
    return someFuckingFiestaHereIGuess(tråden, filter);
  } else {
    return;
  }
}

async function prettyConfirmation(
  tråden,
  game,
  teamsArray,
  teamsArray2,
  teamsArrayForever
) {
  const winnerField = {
    name: "🏆These are the winners!🏆",
    value: teamsArray.join("\n"),
  };
  //this feels ugly
  let loserArray = [teamsArray2];
  //loserArray.push(teamsArray2);
  if (Array.isArray(teamsArrayForever)) {
    teamsArrayForever.forEach((team) => {
      loserArray.push(team);
    });
  }
  const exampleEmbed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle("LaggStats")
    .setDescription(`After a stunning match of **${game}**`)
    //.setThumbnail("https://i.imgur.com/AfFp7pu.png")
    .addFields(winnerField)
    .setFooter("Please react to confirm or deny");

  loserArray.forEach((loseTeam) => {
    exampleEmbed.addField("These also tried", loseTeam.join("\n"), true);
  });

  const confirmationMessage = await tråden.send({
    content: "Does this look right?",
    embeds: [exampleEmbed],
  });
  const yN = await yesOrNo(confirmationMessage);
  if (yN) {
    tråden.send("Coolio ;)");
  } else {
  }
}

async function openingQuery(tråden, filter, game) {
  await tråden.send(
    `Happy to help you report the results from the ${game} match! What players were on the winning team?`
  );
  return await dataCollection(tråden, filter);
}

async function followUpQuestion(tråden, teamsArray, filter) {
  await tråden.send(
    `Okay! So ${teamsArray.join(
      " & "
    )} were on the winning team. Who were on the other team?`
  );
  return await dataCollection(tråden, filter);
}

//Thread creation
//Creations
//Who were the players on team 2? array team 2
//Who were the players on team 3 (if no more teams, react with x)?
//Which team won?
//Does this looks good?
