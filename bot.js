const { Client, GatewayIntentBits, ChannelType, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { AutoPoster } = require('topgg-autoposter');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const ap = AutoPoster('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib3QiOiJ0cnVlIiwiaWQiOiIxNDY0NjMyMDI1OTkzNzExNjc3IiwiaWF0IjoiMTc3MDQ0NjU0OSJ9.TvGwJ4AiticpVAGyI1p0xxcO4fTNbIku11UAAs9Ibqg', client);

ap.on('posted', () => {
  console.log('Stats updated on Top.gg!');
});

const commands = [
    new SlashCommandBuilder().setName('info').setDescription('CRON AI System Credentials'),
    new SlashCommandBuilder().setName('help').setDescription('Instructions for Estate Setup')
].map(c => c.toJSON());

client.on('ready', async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.log(`CRON AI: Registered as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'info') {
        const infoEmbed = new EmbedBuilder()
            .setColor('#c5a059')
            .setTitle('🏛️ CRON AI | ARCHITECTURAL CREDENTIALS')
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription('The world\'s first AI-driven Discord Estate Architect. Crafting elite digital environments with precision and luxury detailing.')
            .addFields(
                { name: '👤 Lead Architect', value: '`Nauman Ali`', inline: true },
                { name: '🆔 Discord ID', value: '`iblame._ghost`', inline: true },
                { name: '🌐 Official HQ', value: '[Join Server](IN PROGRESS!!!)', inline: false },
                { name: '🛰️ System Status', value: '🟢 Operational', inline: true },
                { name: '📜 Build Version', value: 'v2.0.4 (Elite)', inline: true }
            )
            .setFooter({ text: 'Est. 2026 | Powered by CRON AI Collective', iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [infoEmbed] });
    }

    if (interaction.commandName === 'help') {
        const helpEmbed = new EmbedBuilder()
            .setColor('#c5a059')
            .setTitle('📜 THE ARCHITECT\'S HANDBOOK')
            .setAuthor({ name: 'CRON AI | Operations Guide' })
            .setDescription('Follow these steps to manifest your professional Discord environment:')
            .addFields(
                { 
                    name: 'Step 1: Design Your Vision', 
                    value: 'Visit [CRON AI Dashboard](https://cron-ai.onrender.com) and define your theme, role counts, and channel density.' 
                },
                { 
                    name: 'Step 2: Generate Blueprint', 
                    value: 'Wait for the AI to curate your roles and 40-50 detailed channel topics. Copy the generated **JSON Code**.' 
                },
                { 
                    name: 'Step 3: Permission Setup', 
                    value: 'Ensure the CRON AI Bot has **Following** permissions and its role is at the **Top** of the hierarchy. (GO TO DISCORD SETTINGS AND ENABLE DEVELOPER MODE TO COPY SERVER ID )'
                },
                { 
                    name: 'Step 4: Deployment', 
                    value: 'Paste your Server ID and the Blueprint code into the dashboard. Click **Deploy Estate** to begin the build.' 
                },
                { 
                    name: '⚠️ Important Note', 
                    value: 'Deployment will create roles and channels instantly. Ensure your server is within Discord\'s limits (500 channels max).' 
                }
            )
            .setFooter({ text: 'Need Assistance? Contact iblame._ghost', iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [helpEmbed] });
    }
});

async function createServerStructure(guildId, data) {
    const guild = await client.guilds.fetch(guildId);
    
    // Create Roles
    for (const r of data.roles) {
        await guild.roles.create({ name: r.name, color: r.color }).catch(() => null);
    }

    // Create Structure
    for (const catData of data.categories) {
        const category = await guild.channels.create({ name: catData.name, type: ChannelType.GuildCategory });
        for (const chName of catData.channels) {
            await guild.channels.create({ name: chName, parent: category.id }).catch(() => null);
        }
    }
}

client.login(process.env.DISCORD_TOKEN);
module.exports = { createServerStructure };
                      
