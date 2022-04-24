const { MessageEmbed } = require("discord.js");
const { commands } = require("./commands");

module.exports = {
  triggervarningar: [commands.help.command],
  predikat: meddelande => meddelande.content.toLocaleLowerCase().startsWith(commands.help.command),
  handle: async (meddelande) => {
    const fields = Object.keys(commands).map((k) => {
      const command = commands[k];
      return {
        name: `${command.command} ${command.alternativeCommand || ""}`,
        value: command.helpText,
      };
    });

    const embed = new MessageEmbed()
      .setDescription("This is what I can do !")
      .setTimestamp()
      .addFields(fields);

    await meddelande.channel.send({
      embeds: [embed],
    });
  },
};
