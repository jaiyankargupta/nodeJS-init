import { REST, Routes } from "discord.js";

import dotenv from "dotenv";

dotenv.config(); //load the .env variable

const commands = [
  {
    name: "rustyn",
    description: "Replies with rustyn",
    options: [
      {
        name: "message",
        type: 3, // STRING type
        description: "creating a short link",
        required: true,
      },
      {
        name: "link",
        type: 3,
        description: "provide your link",
        required: true,
      },
    ],
  },
];

// make Rest Client : In discord.js, the REST class is used to interact directly with Discord’s HTTP API.

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
    body: commands,
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}
