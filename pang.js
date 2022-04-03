const {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    AudioPlayerStatus,
} = require("@discordjs/voice");


function löftesKollaren(player) {
    const ed = new Promise((resolve, reject) => {
        player.on(AudioPlayerStatus.Idle, function filibuster() {
            resolve();
        });
    });
    return ed;
}

module.exports = {
    predikat: (meddelande) => meddelande.content.toLocaleLowerCase() === "pang!",
    handle: async function clickclackmotherfuckerthegunscomingoutyougottreesecondsFIVE(
        meddelande
    ) {
        if (meddelande.member.voice.channel === null) {
            meddelande.reply("?");
            return
        }
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
    },
}
