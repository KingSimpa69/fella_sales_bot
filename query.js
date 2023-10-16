const ethers = require('ethers');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Client, Events, GatewayIntentBits, EmbedBuilder  } = require('discord.js');
const { ALCHEMY_API_KEY, FELLA_ADDY, ABI, MONGODB_URI, DISCORD_TOKEN, DISCORD_CHANNEL_ID } = require('./settings.json');

const salesSchema = new Schema({
  id: Number,
  fella: String,
  from: String,
  to: String,
  tx: String,
  block: Number,
  logged: { type: Boolean, default: false }
});

salesSchema.index({ tx: 1, fella: 1 }, { unique: true });

const Sales = mongoose.model('sales', salesSchema);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
  client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    checkNFTSales()
    .then(() => process.exit(0))
    .catch((error) => {
      process.exit(1);
    });
  });
  client.login(DISCORD_TOKEN);
});

async function checkNFTSales() {
  const url = `https://mainnet.base.org`;
  const provider = new ethers.JsonRpcProvider(url);
  const blockNumber = await provider.getBlockNumber();
  const filter = {
    address: FELLA_ADDY,
    fromBlock: blockNumber - 1500,
    toBlock: 'latest',
  };

  const transactions = await provider.getLogs(filter);

  for (const log of transactions) {
    try {
        const { transactionHash, blockNumber } = log;
        const contract = new ethers.Contract(FELLA_ADDY, ABI, provider);
        const event = contract.interface.parseLog(log);
        const { value } = await provider.getTransaction(transactionHash);
        const price = await gweiToEth(value);

        if (event.name === 'Transfer') {
            const { from, to, tokenId } = event.args;

            const existingSale = await Sales.findOne({ tx: transactionHash, fella: tokenId.toString() });

            if (!existingSale || !existingSale.logged) {
                const message = {
                    id: tokenId,
                    from: from,
                    to: to,
                    tx: transactionHash,
                    price: price
                };



                if (existingSale) {
                    existingSale.logged = true;
                    await existingSale.save();
                } else {
                    const newSale = new Sales({
                        fella: tokenId.toString(),
                        from,
                        to,
                        tx: transactionHash,
                        block: blockNumber,
                        logged:true
                    });
                    await newSale.save();
                }
                await sendMessageToDiscord(message);
            }
        }
    } catch (error) {
        console.error('Error processing transaction:', error);
    }
}
}

const sendMessageToDiscord = async (message) => {
  const channel = client.channels.cache.get(DISCORD_CHANNEL_ID);
  if (channel) {
    const Embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(`Fella #${message.id}`)
    .setURL('https://basedfellas.io/collection')
    .setAuthor({ name: 'Fella Sales Bot', iconURL: 'https://basedfellas.io/images/1.png', url: 'https://basedfellas.io' })
    .setDescription(`Fella #${message.id} has just been sold for ${message.price} ETH`)
    .addFields(
      { name: 'From', value: `[${shortenEthAddy(message.from)}](https://basescan.org/address/${message.from})` },
      { name: 'To', value: `[${shortenEthAddy(message.to)}](https://basescan.org/address/${message.to})` },
      { name: 'TX', value: `[${shortenEthAddy(message.tx)}](https://basescan.org/tx/${message.tx})` },
    )
    .setImage(`https://basedfellas.io/images/fellas/${message.id}.png`)
    .setTimestamp()
    .setFooter({ text: 'Fella Sales Bot By KingSimpa', iconURL: 'https://github.com/KingSimpa69' });
    await channel.send({ embeds: [Embed] });
  } else {
    console.error('Discord channel not found.');
  }
}

const shortenEthAddy = (addy) => {
  const shorty = addy.slice(0,5) + "..." + addy.slice(37,41)
  return shorty
}

const gweiToEth = async (gwei) => {
  const result = ethers.formatEther(gwei);
  return result;
};