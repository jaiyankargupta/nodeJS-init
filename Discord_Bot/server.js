import { Client, GatewayIntentBits } from "discord.js";

import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config(); //load the .env variable

//creating an instance(object) to interact with the server
// intents is like what we give me permission to this client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// on is  event listener, listen the event
client.on("messageCreate", (message) => {
  // if bot, no reply
  if (message.author.bot) return;

  message.reply({
    content: `Hii, ${message.author.username}. How're you!`,
  });
  console.log("hii there", message.author.username);
});

//intract with the command

const tinyUrl = "https://tinyurl.com/api-create.php?url";

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const messageContent = interaction.options.getString("message");

  if (messageContent.startsWith("create")) {
    const url = interaction.options.getString("link");
    try {
      await interaction.deferReply();
      const res = await fetch(`${tinyUrl}=${encodeURIComponent(url)}`);
      const shortUrl = await res.text();
      await interaction.editReply({
        content: `Shortened Link: ${shortUrl}`,
      });
    } catch (err) {
      await interaction.editReply({
        content: "Failed to generate short link.",
      });
      console.error(err);
    }
  } else {
    await interaction.reply(`hii bhai, ${interaction.user.username}`);
  }
});

//login as client

client.login(process.env.DISCORD_TOKEN);
