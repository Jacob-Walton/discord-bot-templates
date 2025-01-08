const { createMockInteraction } = require('../utils/testUtils');
const listCommand = require('../../src/commands/general/list');

describe('List Command', () => {
    let interaction;
    const mockReplyId = 'mock-reply-id';

    beforeEach(() => {
        interaction = createMockInteraction();
        // Mock the reply to return an object with an id
        interaction.reply.mockResolvedValue({ id: mockReplyId });
    });

    it('should successfully show the first page with pagination', async () => {
        await listCommand.execute(interaction);

        expect(interaction.reply).toHaveBeenCalled();

        // Verify cache was set correctly
        expect(interaction.client.services.cache.set).toHaveBeenCalledWith(
            `pagination:${mockReplyId}`,
            expect.objectContaining({
                currentPage: 1,
                maxPages: 5,
                data: expect.objectContaining({
                    images: expect.any(Array)
                })
            }),
            300
        );
    });

    it('should handle reply error gracefully', async () => {
        interaction.reply.mockRejectedValueOnce(new Error('Failed to reply'));

        await expect(listCommand.execute(interaction)).rejects.toThrow('Failed to reply');
    });

    it('should handle cache error gracefully', async () => {
        interaction.client.services.cache.set.mockRejectedValueOnce(new Error('Cache error'));

        await expect(listCommand.execute(interaction)).rejects.toThrow('Cache error');
    });

    it('should generate different images on each initialization', async () => {
        // Reset the stored images
        jest.resetModules();
        const firstListCommand = require('../../src/commands/general/list');
        await firstListCommand.execute(interaction);
        const firstCallImages = interaction.client.services.cache.set.mock.calls[0][1].data.images;

        // Reset and try again
        jest.resetModules();
        const secondListCommand = require('../../src/commands/general/list');
        await secondListCommand.execute(interaction);
        const secondCallImages = interaction.client.services.cache.set.mock.calls[1][1].data.images;

        // Verify the images are different
        expect(firstCallImages).not.toEqual(secondCallImages);
    });
});
