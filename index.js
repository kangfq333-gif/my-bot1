const { Client, GatewayIntentBits, PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 👇 هنا أنت تتحكم بالأسماء (غيرها براحتك)
const ticketOptions = [
  { label: 'تكت عام', value: 'general' },
  { label: 'دعم فني', value: 'support' },
  { label: 'طلبات خاصة', value: 'private' }
];

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// أمر إظهار اللوحة
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content === '!ticket') {

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('ticket_menu')
        .setPlaceholder('اختر اسم التكت 🎫')
        .addOptions(ticketOptions)
    );

    message.channel.send({
      content: "🎫 اختر التكت:",
      components: [menu]
    });
  }
});

// تنفيذ الاختيار
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  if (interaction.customId === 'ticket_menu') {

    const choice = interaction.values[0];

    const channel = await interaction.guild.channels.create({
      name: `ticket-${choice}-${interaction.user.username}`,
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
      content: `🎫 تم إنشاء التكت: ${channel}`,
      ephemeral: true
    });

    channel.send(`مرحبًا ${interaction.user} 👋\nتم فتح تكت: **${choice}**`);
  }
});

client.login(process.env.TOKEN);
