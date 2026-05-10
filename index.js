const fs = require('fs');
const { Client, GatewayIntentBits, PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ✅ Channel ID حق لوحة التكت
const PANEL_CHANNEL_ID = "1492835764856426526";

// خيارات التكت
const ticketOptions = [
  { label: 'تكت عام', value: 'general' },
  { label: 'دعم فني', value: 'support' },
  { label: 'طلبات', value: 'orders' }
];

// -------------------
// 🎫 التكتات
// -------------------

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  try {
    const channel = await client.channels.fetch(PANEL_CHANNEL_ID);

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('ticket_panel')
        .setPlaceholder('اختر نوع التكت 🎫')
        .addOptions(ticketOptions)
    );

    await channel.send({
      content: "🎫 لوحة التكتات جاهزة:",
      components: [menu]
    });

    console.log("Ticket panel sent");
  } catch (err) {
    console.log(err);
  }
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

    interaction.reply({
      content: `🎫 تم فتح تكتك: ${channel}`,
      ephemeral: true
    });

    channel.send(`مرحبًا ${interaction.user} 👋`);
  }
});

// -------------------
// 🚗 البوستات
// -------------------

// إضافة بوست
client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!addpost')) {
    const post = message.content.slice(9).trim();

    let posts = [];

    if (fs.existsSync('./posts.json')) {
      posts = JSON.parse(fs.readFileSync('./posts.json'));
    }

    posts.push(post);

    fs.writeFileSync('./posts.json', JSON.stringify(posts, null, 2));

    message.reply("✅ تم إضافة البوست");
  }

  // إرسال بوست
  if (message.content === '!post') {

    if (!fs.existsSync('./posts.json')) {
      return message.reply("لا يوجد بوستات");
    }

    const posts = JSON.parse(fs.readFileSync('./posts.json'));

    if (posts.length === 0) {
      return message.reply("ما فيه بوستات");
    }

    const random = posts[Math.floor(Math.random() * posts.length)];

    message.channel.send(`🚗 ${random}`);
  }
});

client.login(process.env.TOKEN);
