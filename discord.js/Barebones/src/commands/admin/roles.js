const { 
    SlashCommandBuilder, 
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roles')
        .setDescription('Setup self-assignable roles')
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Start role menu setup')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Channel to send the role menu in')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('cancel')
                .setDescription('Cancel current role menu setup')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'cancel') {
            await interaction.client.services.cache.delete(`rolesetup:${interaction.guildId}`);
            return await interaction.reply({
                content: 'Role setup cancelled.',
                flags: ['Ephemeral']
            });
        }

        const channel = interaction.options.getChannel('channel');

        // Log all roles for debugging
        interaction.client.logger.debug('All roles:', 
            Array.from(interaction.guild.roles.cache.values())
                .map(r => ({
                    name: r.name,
                    managed: r.managed,
                    position: r.position,
                    botPosition: interaction.guild.members.me.roles.highest.position
                }))
        );

        const botHighestRole = interaction.guild.members.me.roles.highest;
        
        // Updated role filtering
        const availableRoles = interaction.guild.roles.cache
            .filter(role => 
                !role.managed && // Not a bot role
                role.name !== '@everyone' && // Not the default role
                role.position < botHighestRole.position // Must be lower than bot's highest role
            )
            .sort((a, b) => b.position - a.position);

        if (!availableRoles.size) {
            return await interaction.reply({
                content: 'No suitable roles found. Make sure the bot\'s role is positioned above the roles you want to manage.',
                flags: ['Ephemeral']
            });
        }

        interaction.client.logger.debug('Available roles:', 
            Array.from(availableRoles.values()).map(r => r.name)
        );

        // Create select menu using proper builder
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('rolesetup:select')
            .setPlaceholder('Select roles to include in the menu')
            .setMinValues(1)
            .setMaxValues(Math.min(availableRoles.size, 25))
            .addOptions(
                Array.from(availableRoles.values()).map(role => ({
                    label: role.name,
                    value: role.id,
                    description: `Include ${role.name} in the role menu`
                }))
            );

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('rolesetup:confirm')
                    .setLabel('Confirm')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('rolesetup:cancel')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.reply({
            content: 'Select the roles you want to include in the menu:',
            components: [
                new ActionRowBuilder().addComponents(selectMenu),
                buttons
            ],
            flags: ['Ephemeral']
        });

        await interaction.client.services.cache.set(
            `rolesetup:${interaction.guildId}`,
            {
                channelId: channel.id,
                userId: interaction.user.id
            },
            300
        );
    }
};