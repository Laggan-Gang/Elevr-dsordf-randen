const {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    AudioPlayerStatus,
} = require("@discordjs/voice");
const { commands } = require("./commands");


function löftesKollaren(player) {
    const ed = new Promise((resolve, reject) => {
        player.on(AudioPlayerStatus.Idle, function filibuster() {
            resolve();
        });
    });
    return ed;
}

const makeSoundCommand = (command, soundFile) => ({
    predikat: (meddelande) => meddelande.content.toLocaleLowerCase().startsWith(command.command),
    handle: async function kek(meddelande) {
        if (meddelande.member.voice.channel === null) {
            meddelande.reply("?");
            return
        }
        let channel = meddelande.member.voice.channel;
        const player = createAudioPlayer();
        const resource = createAudioResource(
            soundFile,
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
})

module.exports = [
    makeSoundCommand(commands.pang, "clickclackmotherfuckerthegunscomingoutyougottreesecondsFIVE.wav"),
    makeSoundCommand(commands.sussy, "sus.mp3"),
]