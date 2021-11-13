//Typically, the structure of a Discord command contains three parts in the following order: a prefix, 
//a command name, and (sometimes) command arguments.
//kommande version???? hämta allas roller???? kommer aldrig hända men säg inte det till dennis


// Require the necessary discord.js classes "klient" är alltså botten pretty much
const { Client, Intents, Message, Channel, TextChannel } = require('discord.js');
const { cp } = require('fs');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
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
                meddelande.reply('Finner inget sådant sällskap i den här kanalen, har du provat bing.com?')
            }
            console.log(role)
            meddelande.member.roles.add(role)
                .then(() => {
                    meddelande.reply('Har talat med fakulteten och har beslutat att gå din förfrågan till mötes. Välkomen till ' + role.toString() + '-klubben!')
                })
                .catch(error => {
                    if (error.toString() === 'DiscordAPIError: Missing Permissions') {
                        meddelande.reply('Har undersökt saken och kommit fram till att du inte riktigt är den typ vi söker som ' + role.toString())
                    }
                })


        } else if (dravel.startsWith('role')) {
            let role = meddelande.guild.roles.cache.find(role => role.name === resten);
            if (role == undefined) {
                meddelande.reply('I find no such company in this channel, perhaps you would like to try yandex.ru?')
            }
            console.log(role)
            meddelande.member.roles.add(role)
                .then(() => {
                    meddelande.reply('I have spoken with the faculty and made the descision to grant your request. Welcome to the ' + role.toString() + '-society!')
                })
                .catch(error => {
                    if (error.toString() === 'DiscordAPIError: Missing Permissions') {
                        meddelande.reply('After some deep consideration I have reached the conclusion that you are not the kind of person we are looking for as ' + role.toString())
                    }
                })

        }
    }

});

// Login to Discord with your client's token this should always go last I guess? 
client.login(token);
