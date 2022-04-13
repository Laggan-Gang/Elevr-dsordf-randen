const { MessageEmbed } = require("discord.js");
const statRocket = require("./statRocket.js");
const { calculateGameWiener, getGames } = require("./wienerchickendinner.js");
const { dublettKollaren } = require("./dublettKollare.js");
const { matOchDryck } = require("./matOchDryck.js");
const { createSeededGenerator } = require("./podnaem.js");

module.exports = {
  statCollector: async (meddelande) => {
    const charadeInstigator = meddelande.author.id;
    //"!stat dota 2, D21"
    //remove 6 first characters
    //split at comma SPACE
    const cleanMessage = meddelande.content.slice(6);
    const arr = cleanMessage.split(", ");
    const game = kapitalisera(arr[0]);
    const matchId = arr[1];
    console.log(game);
    if (game === "") {
      await meddelande.reply(
        "Please specify what game you're looking to LaggStat by typing `!stat *example game*`. If you want to add an optional matchId, you can type `!stat *example*, *matchId*`"
      );
      return;
    } else if (game.toLowerCase().includes("example")) {
      await meddelande.reply("Very clever wow haha great joke >:(");
      return;
    } else if (meddelande.content.includes("<@")) {
      meddelande.reply(
        "There's no need to try to add players right now, that comes later :). Start off by typing `!stat *game you want to record stats for*`"
      );
      return;
    }
    if (matchId) {
      if (await dublettKollaren(matchId)) {
        meddelande.reply(
          `The game \`\`${matchId}\`\` has already been registered! There's no need to cheat if you just play well.`
        );
        return;
      }
    }
    const trådNamn = `The ${game} Stat Collection`;
    const tråden = await meddelande.channel.threads.create({
      name: trådNamn,
      autoArchiveDuration: 60,
      reason: `${trådNamn}`,
    });
    //tråden is used as to send messages, charadeInstigator is used for the filters
    const winnerArr = await openingQuery(tråden, charadeInstigator, game);
    const participArr = await followUpQuestion(
      tråden,
      winnerArr,
      charadeInstigator
    );
    const optionalParticipArr = await interrogationIntensifies(
      tråden,
      charadeInstigator
    );
    const looksGood = await prettyConfirmation(
      tråden,
      game,
      winnerArr,
      participArr,
      optionalParticipArr,
      charadeInstigator,
      matchId
    );
    await wrapItUp(
      looksGood,
      winnerArr,
      participArr,
      optionalParticipArr,
      game,
      matchId,
      tråden
    );
    return;
  },

  gameWiener: async (meddelande) => {
    const arguments = meddelande.content.replace("!победител", "").split(" ");

    const playerId = arguments[0];
    const game = arguments[1] || "Dota";

    const { totalGames, vinstProcent, vinst } = await calculateGameWiener(
      playerId.trim(),
      game
    );

    const isDummaTik = vinstProcent < 50;

    if (isDummaTik) {
      await meddelande.reply(
        `${playerId} You should win more games before you speak to me. But yeah \`${vinst} [${vinstProcent}%]\` is kinda low over \`${totalGames}\` !.`
      );
    } else {
      await meddelande.reply(
        `${playerId} Glorious winner of \`${vinst}\ [${vinstProcent}%]\` of your \`${totalGames}\`!.`
      );
    }
  },

  smorgesbord: async (meddelande) => {
    const smorgesbordMessageParams = meddelande.content.split(" ");

    const smorgesbordType = smorgesbordMessageParams[1];
    const game = smorgesbordMessageParams[2] || "Dota";
    const numberOfPeoples = smorgesbordMessageParams[3] || 10;

    const yaposId = "412260353699872768";
    const members = await meddelande.guild.members.fetch();

    const yaposMembers = members.filter((m) =>
      m.roles.cache.some((r) => r.id === yaposId)
    );

    const yapos = yaposMembers.map((m) => m.user);

    const smorgesbordResponses = await Promise.all(
      yapos.map(async (m) => {
        const dotaStats = await calculateGameWiener(`<@!${m.id}>`, game);
        return { member: m, ...dotaStats };
      })
    );

    const listOfGods = getListOfGodsByType(
      smorgesbordType,
      smorgesbordResponses.filter(
        (m) => !isNaN(m.vinstProcent).slice(0, numberOfPeoples)
      )
    );

    const seedOfToday = new Date().toDateString();
    const genereraRandom = createSeededGenerator(seedOfToday);

    const randos = [1, 2, 3, 4, 5].map((_) =>
      getMaxRandomishNumber(matOchDryck.length, genereraRandom)
    );

    const embed = MessageEmbed()
      .setTitle(`Smorgesbord for biggest ${type} peoples`)
      .addField(`Top ${numberOfPeoples}`, listOfGods);

    await meddelande.channel.send({
      embeds: [
        embed
          .setTimestamp()
          .addField(
            "Smorgesbord for today: ",
            `${randos.map((i) => matOchDryck[i]).join(" ")}`
          ),
      ],
    });
  },

  listGames: async (meddelande) => {
    const games = await getGames();

    const embed = new MessageEmbed()
      .setTitle("Gameroos")
      .addField(`I have consulted the archives and this is what I got`);

    const gameFields = games.map((g, index) => ({
      name: "",
      field: `${index}. ${g}`,
    }));

    await meddelande.channel.send({
      embeds: [embed.setTimestamp().addFields(gameFields)],
    });
  },
};

function getMaxRandomishNumber(max, genereraRandom) {
  return Math.floor(genereraRandom() * (max + 1));
}

function getListOfGodsByType(type, data) {
  switch (type) {
    case "percent": {
      const topvinstPercent = data.sort(
        (m1, m2) => m2.vinstProcent - m1.vinstProcent
      );

      return topvinstPercent
        .map(
          (m, index) =>
            `${index + 1}. ${m.member.username} - ${m.vinstProcent}% `
        )
        .join("\n");
    }

    case "total": {
      const topvinstPercent = data.sort(
        (m1, m2) => m2.totalGames - m1.totalGames
      );

      return topvinstPercent
        .map(
          (m, index) => ` ${index + 1}. ${m.member.username} - ${m.totalGames} `
        )
        .join("\n");
    }

    case "vinst": {
      const totalGames = data.sort((m1, m2) => m2.vinst - m1.vinst);

      return totalGames
        .map((m, index) => `${index + 1}. ${m.member.username} - ${m.vinst} `)
        .join("\n");
    }
  }
}

async function wrapItUp(
  looksGood,
  winnerArr,
  participArr,
  optionalParticipArr,
  game,
  matchId,
  tråden
) {
  if (looksGood) {
    const finalArray = [winnerArr];
    const losersArray = GATTAI(participArr, optionalParticipArr);
    losersArray.forEach((team) => {
      finalArray.push(team);
    });
    const res = await statRocket.statRocket(finalArray, 0, game, matchId);
    if (res.status == "200") {
      tråden.send("Stats confirmed! We're done :)");
      return;
    } else {
      tråden.send(
        "Whoops! Something got fucked. I'm deleting the thread and you can try again :)"
      );
      threadDeleter(tråden);
      return;
    }
  } else {
    tråden.send(
      "Ok! Deleting the thread in 10 seconds and then we try again. Please be more careful this time :)"
    );
    threadDeleter(tråden);
    return;
  }
}

async function threadDeleter(thread) {
  setTimeout(() => {
    try {
      thread.delete();
    } catch (error) {
      console.error(error);
    }
  }, 10_000);
}

async function messageDeleter(meddelande) {
  try {
    await meddelande.delete();
  } catch (error) {
    console.error(error);
  }
}

function kapitalisera(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function kapitalArray(array) {
  const kapitaliserad = array.map((namn) => {
    return kapitalisera(namn);
  });
  return kapitaliserad;
}

async function dataCollection(tråden, charadeInstigator, latestMessage) {
  const filter = (m) => m.author.id == charadeInstigator;
  const teamCollector = await tråden.awaitMessages({
    filter,
    max: 1,
    time: 180_000,
    errors: ["time"],
  });
  await messageDeleter(latestMessage);
  //Just prettying things up and returning it as an array
  return kapitalArray(teamCollector.first().content.split(" "));
}

async function yesOrNo(message, charadeInstigator) {
  const rFilter = (reaction, user) => {
    return (
      !user.bot &&
      user.id === charadeInstigator &&
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

async function someFuckingFiestaHereIGuess(tråden, charadeInstigator) {
  const latestMessage = await tråden.send("Who were on the next team?");
  const morePlayers = await dataCollection(
    tråden,
    charadeInstigator,
    latestMessage
  );
  //Create an array to push each new supplied team into array
  const teamsForever = [morePlayers];
  //Do it over again to ask and see if we get more players
  const blackSiteResults = await interrogationIntensifies(
    tråden,
    charadeInstigator
  );
  //Since we will eventually return undefined when we break the loop, we make sure it
  //isn't added to our array
  if (blackSiteResults !== undefined) {
    const testingSiteExploded = teamsForever.concat(blackSiteResults);
    return testingSiteExploded;
  } else {
    return teamsForever;
  }
}

async function interrogationIntensifies(tråden, charadeInstigator) {
  const botMeddelande = await tråden.send(
    `Would you like to add additional teams?`
  );
  const yN = await yesOrNo(botMeddelande, charadeInstigator);
  await messageDeleter(botMeddelande);
  if (yN) {
    return someFuckingFiestaHereIGuess(tråden, charadeInstigator);
  } else {
    return;
  }
}

function GATTAI(array1, array2) {
  const loserArray = [array1];
  if (Array.isArray(array2)) {
    array2.forEach((team) => {
      loserArray.push(team);
    });
  }
  return loserArray;
}

async function prettyConfirmation(
  tråden,
  game,
  teamsArray,
  teamsArray2,
  teamsArrayForever,
  charadeInstigator,
  matchId
) {
  const winnerField = {
    name: "`🏆These are the winners!🏆`",
    value: `${teamsArray.join("\n")}`,
  };
  const loserArray = GATTAI(teamsArray2, teamsArrayForever);
  const exampleEmbed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle("LaggStats")
    .setDescription(`After a stunning match of **${game}**`)
    //.setThumbnail("https://i.imgur.com/AfFp7pu.png")
    .addFields(winnerField)
    .setFooter("Please react to confirm or deny");

  loserArray.forEach((loseTeam) => {
    exampleEmbed.addField("`These also tried`", `${loseTeam.join("\n")}`, true);
  });
  if (matchId !== undefined) {
    exampleEmbed.setTitle(`LaggStats ${matchId}`);
  }

  const confirmationMessage = await tråden.send({
    content: "Does this look right?",
    embeds: [exampleEmbed],
  });
  const yN = await yesOrNo(confirmationMessage, charadeInstigator);
  if (yN) {
    return true;
  } else {
    return false;
  }
}

async function openingQuery(tråden, charadeInstigator, game) {
  const latestMessage = await tråden.send(
    `Happy to help you report the results from the ${game} match! What player/s (if multiple, separated by spaces) were on the winning team?`
  );
  return await dataCollection(tråden, charadeInstigator, latestMessage);
}

async function followUpQuestion(tråden, teamsArray, charadeInstigator) {
  const latestMessage = await tråden.send(
    `Okay! So ${teamsArray.join(
      " & "
    )} were on the winning team. Who were on the other team?`
  );
  return await dataCollection(tråden, charadeInstigator, latestMessage);
}

//Thread creation
//Creations
//Who were the players on team 2? array team 2
//Who were the players on team 3 (if no more teams, react with x)?
//Which team won?
//Does this looks good?
