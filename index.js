const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');

const fs = require('fs');
const P = require('pino');
const config = require('./config');
const qrcode = require('qrcode-terminal');
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

const prefix = '.';
const ownerNumber = ['94771820962'];

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

      let up = `DINUWH MD V2 💚 Wa-BOT connected successfully ✅\n\nPREFIX: ${prefix}`;
      conn.sendMessage(ownerNumber + "@s.whatsapp.net", { 
        image: { url: 'https://i.ibb.co/tC37Q7B/20241220-122443.jpg' }, 
        caption: up 
      });
    }
  });

  conn.ev.on('creds.update', saveCreds);

  // **📢 Auto-React to Newsletter Messages**
  conn.ev.on('messages.upsert', async (mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;

    const from = mek.key.remoteJid;
    const autoReactChannels = ['120363368552902204@newsletter', '120363370227470443@newsletter'];

    if (autoReactChannels.includes(from)) {
        await conn.sendMessage(from, {
            react: {
                text: '💗', // Auto-reaction emoji
                key: mek.key,
            }
        });
        console.log(`✅ Reacted to a message in channel: ${from}`);
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
