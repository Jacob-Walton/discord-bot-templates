const { 
    SlashCommandBuilder, 
    ButtonStyle,
    ActionRowBuilder,
    ButtonBuilder 
} = require('discord.js');

// Store fixed image URLs at module level
let storedImages = null;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Shows a paginated list of random images'),

    async execute(interaction) {
        // Initialize stored images if they don't exist
        if (!storedImages) {
            storedImages = Array.from({ length: 5 }, (_, i) => 
                `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/800/600`
            );
        }

        const pages = storedImages.length;

        // Create pagination handler function
        const paginationHandler = async (page, data) => {
            const currentImage = data.images[page - 1];

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`pagination:prev:${page}:${pages}`)
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('⬅️')
                        .setDisabled(page <= 1),
                    new ButtonBuilder()
                        .setCustomId(`pagination:next:${page}:${pages}`)
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('➡️')
                        .setDisabled(page >= pages)
                );

            return {
                embeds: [{
                    title: 'Random Image Gallery',
                    description: `Random image ${page} of ${pages}`,
                    image: { url: currentImage },
                    footer: { text: `Page ${page} of ${pages}` },
                    color: 0x0099ff
                }],
                components: [row]
            };
        };

        // Get initial page data
        const pageData = await paginationHandler(1, { images: storedImages });

        // Send initial message
        const reply = await interaction.reply({
            ...pageData,
            fetchReply: true
        });

        // Cache pagination data and handler
        await interaction.client.services.cache.set(
            `pagination:${reply.id}`,
            {
                handler: paginationHandler,
                data: { images: storedImages },
                currentPage: 1,
                maxPages: pages
            },
            300
        );
    }
};