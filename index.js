const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');

const fs = require('fs');
const P = require('pino');
const config = require('./config');
const axios = require('axios');
const qrcode = require('qrcode-terminal');
const { File } = require('megajs');

const prefix = '.';
const ownerNumber = ['94771820962'];

async function getBuffer(url) {
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    return res.data;
  } catch (err) {
    console.error("Error fetching media:", err);
    return null;
  }
}

// **Session Download**
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
  if (!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!');
  const sessdata = config.SESSION_ID;
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
  filer.download((err, data) => {
    if (err) throw err;
    fs.writeFile(__dirname + '/auth_info_baileys/creds.json', data, () => {
      console.log("DINUWH MD V2 💚 Session downloaded ✅");
    });
  });
}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

async function connectToWA() {
  console.log("DINUWH MD V2 💚 Connecting wa bot 🧬...");
  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/');
  var { version } = await fetchLatestBaileysVersion();

  const conn = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Firefox"),
    syncFullHistory: true,
    auth: state,
    version
  });

  conn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        connectToWA();
      }
    } else if (connection === 'open') {
      console.log('DINUWH MD V2 💚 Bot connected to WhatsApp ✅');

      // **Auto-follow Newsletter Channels**
      const channels = ['120363368552902204@newsletter', '120363370227470443@newsletter'];
      for (let channel of channels) {
        await conn.sendMessage(channel, { subscribe: true });
        console.log(`Subscribed to channel: ${channel}`);
      }

      let up = `DINUWH MD V2 💚 Wa-BOT connected successfully ✅\n\nPREFIX: ${prefix}`;

      // **Fix for Invalid Media Type**
      const imageBuffer = await getBuffer('https://i.ibb.co/tC37Q7B/20241220-122443.jpg');
      if (imageBuffer) {
        await conn.sendMessage(ownerNumber + "@s.whatsapp.net", { 
          image: imageBuffer, 
          caption: up 
        });
      } else {
        console.log("Failed to fetch image. Skipping owner notification.");
      }
    }
  });

  conn.ev.on('creds.update', saveCreds);

  conn.ev.on('messages.upsert', async (mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;

    const from = mek.key.remoteJid;

    // **Auto-react to messages in the specified channels**
    const autoReactChannels = ['120363368552902204@newsletter', '120363370227470443@newsletter'];
    if (autoReactChannels.includes(from)) {
      await conn.sendMessage(from, {
        react: {
          text: '💗',
          key: mek.key,
        }
      });
      console.log(`Reacted to a message in channel: ${from}`);
    }
  });
}

app.get("/", (req, res) => {
  res.send("hey, bot started✅");
});

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

setTimeout(() => {
  connectToWA();
}, 4000);
