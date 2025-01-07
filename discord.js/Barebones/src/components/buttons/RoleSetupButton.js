const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    customId: 'rolesetup',

    async execute(interaction) {
        const [_, action] = interaction.customId.split(':');

        const setupData = await interaction.client.services.cache.get(
            `rolesetup:${interaction.guildId}`
        );

        if (!setupData || setupData.userId !== interaction.user.id) {
            return await interaction.reply({
                content: 'This setup session has expired or belongs to another user.',
                ephemeral: true
            });
        }

        if (action === 'cancel') {
            await interaction.client.services.cache.delete(`rolesetup:${interaction.guildId}`);
            return await interaction.update({
                content: 'Role menu setup cancelled.',
                components: []
            });
        }

        if (action === 'confirm' && setupData.selectedRoles?.length) {
            const channel = await interaction.guild.channels.fetch(setupData.channelId);
            if (!channel) {
                return await interaction.reply({
                    content: 'The target channel no longer exists.',
                    ephemeral: true
                });
            }

            // Create the actual role selection menu
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('role-select')
                .setPlaceholder('Select roles to add/remove')
                .setMinValues(1)
                .setMaxValues(setupData.selectedRoles.length);

            // Add options from selected roles
            const roleOptions = await Promise.all(
                setupData.selectedRoles.map(async roleId => {
                    const role = await interaction.guild.roles.fetch(roleId);
                    return {
                        label: role.name,
                        value: role.id,
                        description: `Toggle the ${role.name} role`
                    };
                })
            );

            selectMenu.addOptions(roleOptions);

            await channel.send({
                embeds: [{
                    title: 'Role Selection',
                    description: 'Select roles below to add/remove them.',
                    color: 0x0099ff
                }],
                components: [new ActionRowBuilder().addComponents(selectMenu)]
            });

            await interaction.update({
                content: `Role menu has been set up in ${channel}!`,
                components: []
            });

            await interaction.client.services.cache.delete(`rolesetup:${interaction.guildId}`);
        }
    }
};