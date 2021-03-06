//@ts-check

const commands = {
  sussy: {
    command: "!sus",
    helpText:
      "Hold on a sec. Some of these bakas seem mighty sussy to me :face_with_raised_eyebrow:",
    example:
      "!sus - person who requests this display of arnament needs to be in a voice channel",
  },
  pang: {
    command: "pang!",
    helpText:
      "Elvis loads the gun and shows the people in the voice channel whats what",
    example:
      "pang! - person who requests this display of arnament needs to be in a voice channel",
  },
  listGames: {
    command: "!giveGames",
    helpText: "Elvis will consult the archives and list every game he has",
    example: "!giveGames",
  },
  role: {
    command: "roll",
    alternativeCommand: "role",
    helpText:
      "Record your role preferences Claes has examples or some stuff like that",
    example: "call Claes",
  },
  stat: {
    command: "!stat",
    helpText:
      "Elvis will assist Clam with recording some stats for a game that was played and good Laggan member has honourably or dishonourably won.",
    example: "!stat [gameId], [matchId ?]",
  },
  pobeditel: {
    command: "!победител",
    helpText: "Roll d20 for ego inflate/bruise.",
    example: "!победител [ discordUser ] [ gameId ?]",
  },
  smorgesbord: {
    command: "!smorgesbord",
    alternativeCommand: "!rank",
    helpText: "Get a cool smorgesbord.",
    exampleUsage:
      "!smorgesbord [ vinst/percent/total ] [ gameId ?] [ number of peoples ?]",
  },
  help: {
    command: "!helpame",
    alternativeCommand: "!help",
    helpText: "Elvis flexes his abilities in front of everyone.",
    exampleUsage: "!helpame",
  },
  alias: {
    command: "!nick",
    helpText: "Associate yourself with another nickname",
    exampleUsage: "!nick bigboy bicboi largeboye",
  },
  hello: {
    command: "hello!",
    helpText: "Being curtious is good, but why waste your voice when someone else can do it?",
    exampleUsage: "hello!",
  }
};

module.exports = {
  commands,
};
