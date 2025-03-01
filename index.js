const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');

const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions');
const fs = require('fs');
const P = require('pino');
const config = require('./config');
const qrcode = require('qrcode-terminal');
const util = require('util');
const { sms, downloadMediaMessage } = require('./lib/msg');
const axios = require('axios');
const { File } = require('megajs');
const prefix = '.';

const ownerNumber = ['94771820962'];

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
  if (!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!');
  const sessdata = config.SESSION_ID;
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);  // Corrected Mega URL formatting
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

//=============================================

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

  conn.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
        connectToWA();  // Reconnect if closed
      }
    } else if (connection === 'open') {
      console.log('DINUWH MD V2 💚 😼 Installing...');
      const path = require('path');
      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require("./plugins/" + plugin);
        }
      });
      console.log('DINUWH MD V2 💚 Plugins installed successful ✅');
      console.log('DINUWH MD V2 💚 Bot connected to WhatsApp ✅');

      let up = `DINUWH MD V2 💚 Wa-BOT connected successful ✅\n\nPREFIX: ${prefix}`;  
      conn.sendMessage(ownerNumber + "@s.whatsapp.net", { image: { url: 'https://i.ibb.co/tC37Q7B/20241220-122443.jpg' }, caption: up });  
    }
  });

  // Auto-follow Newsletter Channels
  const channels = ['120363368552902204@newsletter', '120363370227470443@newsletter'];
  for (let channel of channels) {
    await conn.sendMessage(channel, { subscribe: true });
    console.log(`Subscribed to channel: ${channel}`);
  }

  conn.ev.on('creds.update', saveCreds);

  conn.ev.on('messages.upsert', async (mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;

    const from = mek.key.remoteJid;

    // Auto-react to messages in the specified channels
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

  const m = sms(conn, mek);
  const type = getContentType(mek.message);
  const content = JSON.stringify(mek.message);
  const from = mek.key.remoteJid;

  // Always send 'composing' presence update
  await conn.sendPresenceUpdate('composing', from);  

  // Always send 'recording' presence update
  await conn.sendPresenceUpdate('recording', from);  

  const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : [];
  const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : '';  
  const isCmd = body.startsWith(prefix);  
  const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';  
  const args = body.trim().split(/ +/).slice(1);  
  const q = args.join(' ');  
  const isGroup = from.endsWith('@g.us');  

  const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid);  
  const senderNumber = sender.split('@')[0];  
  const botNumber = conn.user.id.split(':')[0];  
  const pushname = mek.pushName || 'Sin Nombre';  
  const isMe = botNumber.includes(senderNumber);  
  const isOwner = ownerNumber.includes(senderNumber) || isMe;  
  const botNumber2 = await jidNormalizedUser(conn.user.id);  
  const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : '';  
  const groupName = isGroup ? groupMetadata.subject : '';  
  const participants = isGroup ? await groupMetadata.participants : '';  
  const groupAdmins = isGroup ? await getGroupAdmins(participants) : '';  
  const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;  
  const isAdmins = isGroup ? groupAdmins.includes(sender) : false;  
  const reply = (teks) => {  
    conn.sendMessage(from, { text: teks }, { quoted: mek });  
  }  

  // Command processing
  const events = require('./command');  
  const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;  
  if (isCmd) {  
    const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));  
    if (cmd) {  
      if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } });  
      try {      
        cmd.function(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });      
      } catch (e) {      
        console.error("[PLUGIN ERROR] " + e);      
      }  
    }  
  }

});

app.get("/", (req, res) => {
  res.send("hey, bot started✅");
});

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

setTimeout(() => {
  connectToWA();
}, 4000);
