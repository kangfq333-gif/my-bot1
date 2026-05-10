const { Client, GatewayIntentBits, PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// 👇 عدل هذا باسم الروم اللي تبي اللوحة فيه
const 1492835764856426526 = "🎫-tickets";

// خيارات التكت (تعدلها براحتك)
const ticketOptions = [
  { label: 'تكت عام', value: 'general' },
  { label: 'دعم فني', value: 'support' },
  { label: 'طلبات', value: 'orders' }
];

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const guild = client.guilds.cache.first();
  if (!guild) return;

  const channel = guild.channels.cache.find(c => c.name === PANEL_CHANNEL_NAME);
  if (!channel) {
    console.log("Ticket panel channel not found");
    return;
  }

  const menu = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('ticket_panel')
      .setPlaceholder('اختر نوع التكت 🎫')
      .addOptions(ticketOptions)
  );

  channel.send({
    content: "🎫 لوحة التكتات جاهزة، اختر نوع التكت:",
    components: [menu]
  });
});

// إنشاء التكت
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  if (interaction.customId === 'ticket_panel') {

    const type = interaction.values[0];

    const channel = await interaction.guild.channels.create({
      name: `ticket-${type}-${interaction.user.username}`,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages
          ]
        }
      ]
    });

    await interaction.reply({
      content: `🎫 تم فتح تكتك: ${channel}`,
      ephemeral: true
    });

    channel.send(`مرحبًا ${interaction.user} 👋\nتم فتح تكت: **${type}**`);
  }
});

client.login(process.env.TOKEN);
