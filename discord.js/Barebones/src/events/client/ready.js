module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        client.logger.info(`Logged in as ${client.user.tag}`);
    }
}