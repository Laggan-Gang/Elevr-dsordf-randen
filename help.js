const { MessageEmbed } = require("discord.js");
const { commands } = require("./commands");

module.exports = {
  help: async (meddelande) => {
    const fields = commands.map((c) => ({
      name: `${c.command} ${c.alternativeCommand}`,
      value: c.helpText,
    }));

    const embed = new MessageEmbed()
      .setDescription("This is what I can do !")
      .setTimestamp()
      .addFields(fields);

    await meddelande.channel.send({
      embeds: [embed],
    });
  },
};
