//Typically, the structure of a Discord command contains three parts in the following order: a prefix, 
//a command name, and (sometimes) command arguments.
//kommande version???? hämta allas roller???? kommer aldrig hända men säg inte det till dennis


// Require the necessary discord.js classes "klient" är alltså botten pretty much
const { Client, Intents, Message, Channel, TextChannel } = require('discord.js');
const { cp } = require('fs');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES] });
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayer } = require('@discordjs/voice');

let varningar = 0

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Elevrådsordföranden is online');

});






client.on("messageCreate", async (meddelande) => {  //=> är en funktion
    let dravel = meddelande.content.toLocaleLowerCase()
    let resten = meddelande.content.slice(5)
    if (!meddelande.author.bot) {
        if (meddelande.type === 'REPLY') {
            let brottsling = meddelande.mentions.repliedUser
            let brottet = await meddelande.channel.messages.fetch(meddelande.reference.messageId)
            var bevis = ''
            if (brottet.content !== '') {
                bevis = '"' + brottet.content + '" '
            }
            if (dravel.startsWith('varning')) {
                brottet.reply('Det här är INTE acceptabelt beteende ' + meddelande.mentions.repliedUser.toString() + '! Du kan se det här som en formell varning och jag hoppas *innerligt* att du funderar både en och två gånger innan du postar ' + bevis + 'igen!')
            } else if (dravel.startsWith('warning')) {
                brottet.reply('This is NOT acceptable behaviour ' + meddelande.mentions.repliedUser.toString() + '! You can consider this a formal warning and I *sincerely* hope you will think twice about posting ' + bevis + 'again!')
            }
        }
        if (dravel.startsWith('roll')) {
            let role = meddelande.guild.roles.cache.find(role => role.name === resten);
            if (role == undefined) {
                meddelande.reply('Finner inget sådant sällskap i den här kanalen, har du provat bing.com? Kom ihåg att jag är en viktigpetter och är väldigt noggrann med gemener och versaler :)')
            } else {
                console.log(role)
                if (!meddelande.member.roles.cache.some(r => r.name === resten)) {
                    meddelande.member.roles.add(role)
                        .then(() => {
                            meddelande.reply('Har talat med fakulteten och har beslutat att gå din förfrågan till mötes. Välkomen till ' + role.toString() + '-klubben!')
                        })
                        .catch(error => {
                            if (error.toString() === 'DiscordAPIError: Missing Permissions') {
                                meddelande.reply('Har undersökt saken och kommit fram till att du inte riktigt är den typ vi söker som ' + role.toString())
                            }
                        })
                } else {
                    meddelande.reply('Efter eftertanke har det slagit mig att du redan är ' + role.toString() + '! Jag kan tyvärr inte göra dig till dubbel-' + role.toString() + ' :(')
                }
            }


        } else if (dravel.startsWith('role')) {
            let role = meddelande.guild.roles.cache.find(role => role.name === resten);
            if (role == undefined) {
                meddelande.reply('I find no such company in this channel, perhaps you would like to try yandex.ru? Bear in mind that I am an important petter and meticulous about upper- and lowercase :)')
            } else {
                console.log(role)
                if (!meddelande.member.roles.cache.some(r => r.name === resten)) {
                    meddelande.member.roles.add(role)
                        .then(() => {
                            meddelande.reply('I have spoken with the faculty and made the descision to grant your request. Welcome to the ' + role.toString() + '-society!')
                        })
                        .catch(whoops => {
                            if (whoops.toString() === 'DiscordAPIError: Missing Permissions') {
                                meddelande.reply('After some deep consideration I have reached the conclusion that you are not the kind of person we are looking for as ' + role.toString())
                            }
                        })
                } else {
                    meddelande.reply('Thinking about it now, I have come to realize that you already are ' + role.toString() + '! Unfortunately, I cannot make you double-' + role.toString() + ' :(')
                }
            }

        } else if (dravel === 'pang!') {
            if (meddelande.member.voice.channel !== null) {
                let channel = meddelande.member.voice.channel
                const player = createAudioPlayer();
                const resource = createAudioResource('/Users/hugo/GitHub/Elevr-dsordf-randen/clickclackmotherfuckerthegunscomingoutyougottreesecondsFIVE.wav');
                const connection = joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                });
                player.play(resource)
                const subscription = connection.subscribe(player)
                if (subscription) {
                    setTimeout(() => subscription.unsubscribe(), 2_000);
                    setTimeout(() => connection.destroy(), 2_000);
                    setTimeout(() => player.stop(), 2_000)
                }
            } else {
                meddelande.reply('?')
            }
        }
    }

});

// Login to Discord with your client's token this should always go last I guess? 
client.login(token);
