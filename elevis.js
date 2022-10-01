//Typically, the structure of a Discord command contains three parts in the following order: a prefix,
//a command name, and (sometimes) command arguments.
//kommande version???? hämta allas roller???? kommer aldrig hända men säg inte det till dennis
//rakt i hjärtat hugo, rakt i hjärtat

// Require the necessary discord.js classes "klient" är alltså botten pretty much
const {
  Client,
  Intents,
} = require("discord.js");
const { token } = require("./config.json");
const handleMessage = require('./handleMessage');
const { tipsrunda } = require('./tipsrunda');

// Create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS, //ASVIKTIG!!!
  ],
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Elevrådsordföranden is online");
});

const handlingar = [
  require('./statCalculator'),
  ...require('./statCommands'),
  ...require('./achtung'),
  ...require('./roleassign'),
  ...require('./pang'),
  require('./help'),
];

// to handle multibyte kek properly, I'm sure bulgarian has some multibyte characters in it. Or that the weebs will start using kanji any day now
// also needs to support UTF smileys as bot commands for obvious reasons
for(h of handlingar) {
  if(!h.triggervarningar) {
    h.triggervarningar = [];
  } else {
    h.triggervarningar = h.triggervarningar.map(t => [...t.toLocaleLowerCase()])
  }
}


client.on("messageCreate", async (meddelande) => {
  let aleaIactaEstIterum = Math.random() * 75;
  console.log(`Tärningen är kastad igen, den blev typ ${Math.floor(aleaIactaEstIterum)}`);
  await handleMessage(aleaIactaEstIterum, handlingar, meddelande, client) || (
    (!meddelande.author.bot || meddelande.author.id == "745345949295181886")
    && [meddelande.channelId, meddelande.channel.parentId].includes("539847809004994560")
    && tipsrunda(handlingar, meddelande, aleaIactaEstIterum, client)
  )
});

// Login to Discord with your client's token this should always go last I guess?
client.login(token);
