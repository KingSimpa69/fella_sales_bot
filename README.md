

# Discord NFT Sales Bot

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
[![AGPL License](https://img.shields.io/badge/License-The%20Unlicense-blue.svg)](https://unlicense.org/)

This Discord NFT Sales Bot is a tool built with nodeJS to facilitate and streamline the process of making NFT sale announcments within Discord communities on the Base Ecosystem. 


## Requirements

**NodeJS:** Any version, although I prefer LTS (v20 at time of writing)

**MongoDB:** Running locally

**Discord Bot Token:** [FOLLOW VIDEO UNTIL 2:00](https://youtu.be/4XswiJ1iUaw)

**Discord Channel ID:** [HOW TO FIND YOUR CHANNEL ID](https://www.youtube.com/watch?v=gNSC4JzZoFQ)




## Usage
To get the bot up and running, follow the steps below:

&nbsp;1. Clone the bot repository: `git clone https://github.com/KingSimpa69/fella_sales_bot.git`

&nbsp;2. Navigate to the project directory: `cd fella_sales_bot`

&nbsp;3. Install the bot dependancies with the package manager of your choice:

&nbsp;&nbsp;Using pnpm (recommended): \
&nbsp;&nbsp;- If you don't have pnpm installed, you can install it globally by running: `npm install -g pnpm` \
&nbsp;&nbsp;- Then, install project dependencies: `pnpm install`

&nbsp;&nbsp;Using yarn: \
&nbsp;&nbsp;- If you don't have yarn installed, you can install it globally by running: `npm install -g yarn` \
&nbsp;&nbsp;- Then, install project dependencies: `yarn install`

&nbsp;&nbsp;Using npm: \
&nbsp;&nbsp;- Install project dependencies: `npm install`

&nbsp;4. Open "settings.json.example" with your favorite text editor, modify the following values:

```
    "NFT_CONTRACT":"0x0000000000000000000000",
    "DISCORD_TOKEN":"694206942069420",
    "DISCORD_CHANNEL_ID":"694206942069420",
```
&nbsp; ⚠️ The above values are required by the bot!

&nbsp;5. Save and rename the file to "settings.json"

&nbsp;6. Run the bot via your favorite package manager:

   - Using pnpm: `pnpm start`

   - Using yarn: `yarn start`

   - Using npm: `npm run start`

&nbsp;7. To shutdown the bot, press `CTRL + C`

&nbsp;8. Customize the bot for your project by modifying "discordBot.js"!
