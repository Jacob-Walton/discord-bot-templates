module.exports = {
    customId: 'role-select',

    async execute(interaction) {
        const selectedRoles = interaction.values;
        const member = interaction.member;
        const changes = [];
        const botMember = interaction.guild.members.me;

        // Check if bot has necessary permissions
        if (!botMember.permissions.has('ManageRoles')) {
            return await interaction.reply({
                content: 'I don\'t have permission to manage roles.',
                ephemeral: true
            });
        }

        const botHighestRole = botMember.roles.highest;

        for (const roleId of selectedRoles) {
            const role = interaction.guild.roles.cache.get(roleId);
            if (!role) continue;

            // Skip if role is higher than bot's highest role
            if (role.position >= botHighestRole.position) {
                changes.push(`⚠️ Cannot modify ${role.name} - role is too high`);
                continue;
            }

            try {
                if (member.roles.cache.has(roleId)) {
                    await member.roles.remove(roleId);
                    changes.push(`❌ Removed ${role.name}`);
                } else {
                    await member.roles.add(roleId);
                    changes.push(`✅ Added ${role.name}`);
                }
            } catch (error) {
                changes.push(`❌ Failed to modify ${role.name}`);
                interaction.client.logger.error(`Failed to modify role ${role.name}:`, error);
            }
        }

        await interaction.reply({
            content: changes.length > 0 
                ? `Role changes:\n${changes.join('\n')}`
                : 'No role changes were made.',
            ephemeral: true
        });
    }
};