const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const RoleMenu = require('../../database/models/RoleMenu');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.logger.info(`Logged in as ${client.user.tag}`);

        // Restore role menus
        try {
            const roleMenus = await RoleMenu.find({});
            
            for (const menuData of roleMenus) {
                const guild = await client.guilds.fetch(menuData.guildId);
                if (!guild) continue;

                const channel = await guild.channels.fetch(menuData.channelId);
                if (!channel) continue;

                try {
                    const message = await channel.messages.fetch(menuData.messageId);
                    if (!message) continue;

                    const selectMenu = new StringSelectMenuBuilder()
                        .setCustomId('role-select')
                        .setPlaceholder('Select roles to add/remove')
                        .setMinValues(0)  // Changed from 1 to 0 to allow deselecting
                        .setMaxValues(menuData.roles.length);

                    const roleOptions = await Promise.all(
                        menuData.roles.map(async roleId => {
                            const role = await guild.roles.fetch(roleId);
                            return {
                                label: role.name,
                                value: role.id,
                                description: `Toggle the ${role.name} role`
                            };
                        })
                    );

                    selectMenu.addOptions(roleOptions);

                    await message.edit({
                        components: [new ActionRowBuilder().addComponents(selectMenu)]
                    });
                } catch (error) {
                    client.logger.error(`Failed to restore role menu in guild ${menuData.guildId}:`, error);
                }
            }
        } catch (error) {
            client.logger.error('Failed to restore role menus:', error);
        }
    }
};