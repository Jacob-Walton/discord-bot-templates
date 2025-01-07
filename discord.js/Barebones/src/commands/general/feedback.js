const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Submit feedback about the bot'),

    async execute(interaction) {
        const modal = interaction.client.handlers.components.builders.modal('feedback-modal');
        await interaction.showModal(modal);
    }
};