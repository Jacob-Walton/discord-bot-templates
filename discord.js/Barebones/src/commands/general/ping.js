const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
        
    async execute(interaction) {
        // Send initial reply
        await interaction.reply('Pinging...');
        
        // Get the response message
        const sent = await interaction.fetchReply();
        
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = interaction.client.ws.ping;

        await interaction.editReply({
            content: `Bot Latency: ${latency}ms\nAPI Latency: ${apiLatency}ms`
        });
    }
};