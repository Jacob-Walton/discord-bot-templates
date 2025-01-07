const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Submit feedback about the bot'),

    async execute(interaction) {
        const modalData = interaction.client.handlers.components.registry.create('MODAL', 'feedback-modal');
        await interaction.showModal(modalData);
    }
};