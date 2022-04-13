//@ts-check

const commands = {
    pang: {
        command:'pang!',
        helpText: 'Elvis loads the gun and shows the people in the voice channel whats what',
        example: 'pang! - person who requests this display of arnament needs to be in a voice channel'
    },
    listGames: {
        command:'!giveGames',
        helpText: 'Elvis will consult the archives and list every game he has',
        example: '!giveGames'
    },
    role:{
        command: 'roll',
        alternativeCommand: 'role',
        helpText: 'Record your role preferences Claes has examples or some stuff like that',
        example: 'call Claes'
    },
    stat: {
        command: '!stat',
        helpText: 'Elvis will assist Clam with recording some stats for a game that was played and good Laggan member has honourably or dishonourably won.',
        example: '!stat [gameId], [matchId ?]'
    },
    pobeditel:{
        command: '!победител',
        helpText: 'Roll d20 for ego inflate/bruise.',
        example: '!победител [ discordUser ] [ gameId ?]'
     },
     smorgesbord: {
         command: '!smorgesbord',
         helpText: 'Get a cool smorgesbord.',
         exampleUsage: '!smorgesbord [ vinst/percent/total ] [ gameId ?] [ number of peoples ?]'
     },
     help: {
         command: '!helpame',
         helpText: 'Elvis flexes his abilities in front of everyone.',
         exampleUsage: '!helpame'
     }
};

module.exports = {
  commands,
};
