const { Client, GatewayIntentBits, PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// ✅ Channel ID حق الروم
const PANEL_CHANNEL_ID = "1492835764856426526";

// خيارات التكت (تعدلها براحتك)
const ticketOptions = [
  { label: 'تكت عام', value: 'general' },
  { label: 'دعم فني', value: 'support' },
  { label: 'طلبات', value: 'orders' }
];

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  try {
    const channel = await client.channels.fetch(PANEL_CHANNEL_ID);

    if (!channel) {
      console.log("Channel not found");
      return;
    }

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('ticket_panel')
        .setPlaceholder('اختر نوع التكت 🎫')
        .addOptions(ticketOptions)
    );

    await channel.send({
      content: "🎫 لوحة التكتات جاهزة، اختر نوع التكت:",
      components: [menu]
    });

    console.log("Ticket panel sent successfully");

  } catch (err) {
    console.log("Error:", err);
  }
});

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
