const { Client, GatewayIntentBits, Collection } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

const prefix = '/'; // Change this to your desired command prefix
client.commands = new Collection();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) {
        // Handle unknown commands
        message.reply('Unknown command. Type `/help` for a list of available commands.');
        return;
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error executing the command.');
    }
});

client.commands.set('new', {
    name: 'new',
    description: 'Creates a new ticket',
    usage: '<user> [reason]',
    execute(message, args) {
        // Find an administrator role (you can customize this based on your server setup)
        const adminRole = message.guild.roles.cache.find(role => role.name === 'Administrator');

        if (!adminRole) {
            message.reply('Error: Administrator role not found.');
            return;
        }

        // Create a private ticket channel
        message.guild.channels.create(`ticket-${message.author.username.toLowerCase()}`, { type: 'text' })
            .then((channel) => {
                // Set permissions for the user who opened the ticket and administrators
                channel.permissionOverwrites.edit(message.author, { VIEW_CHANNEL: true });
                channel.permissionOverwrites.edit(adminRole, { VIEW_CHANNEL: true });

                // Send a message indicating that the ticket has been created
                channel.send(`Ticket opened by ${message.author}`);

                // Notify the user that the ticket has been created
                message.reply(`Your ticket has been created in ${channel}`);
            })
            .catch((error) => {
                console.error(error);
                message.reply('Error opening ticket.');
            });
    }
});

client.commands.set('help', {
    name: 'help',
    description: 'Displays a list of available commands',
    execute(message) {
        const commandList = client.commands.map(command => `**${prefix}${command.name}**: ${command.description}`).join('\n');
        message.channel.send(`Available commands: /new , /help\n${commandList}`);
    }
});

// Add your bot token here
client.login('MTE4MzUyMjgzNjA0NDg0OTE2Mw.GEB5qw.T4PGZ70pxc2jetXGFxiDMmAtONDN2A-BgmjPiI');
