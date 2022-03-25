//Typically, the structure of a Discord command contains three parts in the following order: a prefix,
//a command name, and (sometimes) command arguments.
//kommande version???? hämta allas roller???? kommer aldrig hända men säg inte det till dennis

// Require the necessary discord.js classes "klient" är alltså botten pretty much
const {
  Client,
  Intents,
  Message,
  Channel,
  TextChannel,
  MessageAttachment,
  MessageEmbed,
} = require("discord.js");
const { cp } = require("fs");
const { token } = require("./config.json");
const bigData = require("./statCollector");

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
const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  AudioPlayer,
  AudioPlayerStatus,
} = require("@discordjs/voice");

let varningar = 0;

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Elevrådsordföranden is online");
});

function löftesKollaren(player) {
  const ed = new Promise((resolve, reject) => {
    player.on(AudioPlayerStatus.Idle, function filibuster() {
      resolve();
    });
  });
  return ed;
}

client.on("messageCreate", async (meddelande) => {
  //=> är en funktion

  if (!meddelande.author.bot) {
    switch (true) {
      case meddelande.content.startsWith("!stat"):
        await bigData.statCollector(meddelande);
        break;
      
      case meddelande.content.startsWith("!dota weiner"):
        await bigData.dotaWiener(meddelande);
        break;

      case meddelande.content.startsWith("<@"):
        await motiveradVarning(meddelande);
        break;
      case meddelande.type === "REPLY":
        let brottet = await meddelande.channel.messages.fetch(
          meddelande.reference.messageId
        );
        await elevRådsOrdförande(meddelande, brottet);
        break;
      case meddelande.content.toLowerCase().startsWith("roll") ||
        meddelande.content.toLowerCase().startsWith("role"):
        await roleAssign(meddelande);
        break;
      case meddelande.content.toLocaleLowerCase() === "pang!":
        if (meddelande.member.voice.channel !== null) {
          await clickclackmotherfuckerthegunscomingoutyougottreesecondsFIVE(
            meddelande
          );
        } else {
          meddelande.reply("?");
        }
        break;
    }
  }
});

async function motiveradVarning(meddelande) {
  const arr = meddelande.content.split(" ");
  const warned = arr[0];
  const command = arr[1];
  const orsak = arr.slice(2).join(" ");
  if (!command.endsWith("arning")) {
    return;
  }
  switch (command) {
    case "varning":
      await meddelande.channel.send(
        `${warned} du har blivit varnad eftersom du har "${orsak}". Det vore kanske bäst att tänka efter lite nästa gång, så vi inte har en till situation där du ${orsak} igen.`
      );
      break;
    case "warning":
      await meddelande.channel.send(
        `${warned} you have been warned on account of having "${orsak}". Perhaps it would be wise to think twice, so we can avoid another situation in which you have ${orsak} again.`
      );
      break;
  }
  try {
    await meddelande.delete();
  } catch (error) {
    console.error(error);
  }
}

async function clickclackmotherfuckerthegunscomingoutyougottreesecondsFIVE(
  meddelande
) {
  let channel = meddelande.member.voice.channel;
  const player = createAudioPlayer();
  const resource = createAudioResource(
    "clickclackmotherfuckerthegunscomingoutyougottreesecondsFIVE.wav"
  );
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });
  const subscription = connection.subscribe(player);
  player.play(resource);
  await löftesKollaren(player);
  if (subscription) {
    subscription.unsubscribe();
    connection.destroy();
    player.stop();
  } else {
    meddelande.reply("?");
  }
}

async function elevRådsOrdförande(meddelande, brottet) {
  varningar++;
  let dravel = meddelande.content.toLocaleLowerCase();
  let resten = meddelande.content.slice(5);
  let brottsling = meddelande.mentions.repliedUser;
  var bevis = "";
  if (brottet.content !== "") {
    bevis = '"' + brottet.content + '" ';
  }
  if (dravel.startsWith("varning")) {
    brottet.reply(
      `Det här är INTE acceptabelt beteende ${meddelande.mentions.repliedUser.toString()}! Du kan se det här som en formell varning och jag hoppas *innerligt* att du funderar både en och två gånger innan du postar ${bevis}igen! Det här är varning nummer ${varningar}`
    );
  } else if (dravel.startsWith("warning")) {
    brottet.reply(
      `This is NOT acceptable behaviour ${meddelande.mentions.repliedUser.toString()}! You can consider this a formal warning and I *sincerely* hope you will think twice about posting ${bevis}again! This is warning number ${varningar}`
    );
  }
}

async function roleAssign(meddelande) {
  let dravel = meddelande.content.toLocaleLowerCase();
  let resten = meddelande.content.slice(5);
  if (dravel.startsWith("roll")) {
    if (meddelande.channel.id == "539847809004994560") {
      let role = meddelande.guild.roles.cache.find(
        (role) => role.name === resten
      );
      if (role == undefined) {
        meddelande.reply(
          "Finner inget sådant sällskap i den här kanalen, har du provat bing.com? Kom ihåg att jag är en viktigpetter och är väldigt noggrann med gemener och versaler :)"
        );
      } else {
        console.log(role);
        if (!meddelande.member.roles.cache.some((r) => r.name === resten)) {
          meddelande.member.roles
            .add(role)
            .then(() => {
              meddelande.reply(
                "Har talat med fakulteten och har beslutat att gå din förfrågan till mötes. Välkomen till " +
                  role.toString() +
                  "-klubben!"
              );
            })
            .catch((error) => {
              if (error.toString() === "DiscordAPIError: Missing Permissions") {
                meddelande.reply(
                  "Har undersökt saken och kommit fram till att du inte riktigt är den typ vi söker som " +
                    role.toString()
                );
              }
            });
        } else {
          meddelande.reply(
            "Efter eftertanke har det slagit mig att du redan är " +
              role.toString() +
              "! Jag kan tyvärr inte göra dig till dubbel-" +
              role.toString() +
              " :("
          );
        }
      }
    } else {
      meddelande.reply(
        "Här skulle jag vilja kliva in och påminna dig om att digital nedskräpning är fortfarande nedskrpäning, och att ägna sig åt sådanna vedervärdiga projekt gör hela kanalen till åtlöje. Vänligen se till att alla dina icke-essentiella bot-kommandon skrivs i " +
          meddelande.guild.channels.cache.get("539847809004994560").toString() +
          ". Fundera ett slag över dina handlingar och hur de påverkar de i din omgivning. Varning är ett bra exempel på ett essentiellt bot-kommando."
      );
    }
  } else if (dravel.startsWith("role")) {
    if (meddelande.channel.id == "539847809004994560") {
      let role = meddelande.guild.roles.cache.find(
        (role) => role.name === resten
      );
      if (role == undefined) {
        meddelande.reply(
          "I find no such company in this channel, perhaps you would like to try yandex.ru? Bear in mind that I am an important petter and meticulous about upper- and lowercase :)"
        );
      } else {
        console.log(role);
        if (!meddelande.member.roles.cache.some((r) => r.name === resten)) {
          meddelande.member.roles
            .add(role)
            .then(() => {
              meddelande.reply(
                "I have spoken with the faculty and made the descision to grant your request. Welcome to the " +
                  role.toString() +
                  "-society!"
              );
            })
            .catch((whoops) => {
              if (
                whoops.toString() === "DiscordAPIError: Missing Permissions"
              ) {
                meddelande.reply(
                  "After some deep consideration I have reached the conclusion that you are not the kind of person we are looking for as " +
                    role.toString()
                );
              }
            });
        } else {
          meddelande.reply(
            "Thinking about it now, I have come to realize that you already are " +
              role.toString() +
              "! Unfortunately, I cannot make you double-" +
              role.toString() +
              " :("
          );
        }
      }
    } else {
      meddelande.reply(
        "I would like to inform and remind you the technological littering is still littering, and by indulging in such vile activities you are tarnishing the sanctity of the channel. Please always make sure to post non-essential bot commands in" +
          meddelande.guild.channels.cache.get("539847809004994560").toString() +
          ". Try to think about your actions and how they affect those around you. Warning other player is a good example of an essential bot command."
      );
    }
  }
}

// Login to Discord with your client's token this should always go last I guess?
client.login(token);
