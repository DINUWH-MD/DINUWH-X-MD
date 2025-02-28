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
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const prefix = config.PREFIX;

const ownerNumber = ['94718913389']; // Bot Owner Number

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

async function connectToWA() {
    console.log("✅ DINUWH-MD - Connecting...");
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/Session/');
    var { version } = await fetchLatestBaileysVersion();

    const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Safari"),
        syncFullHistory: true,
        auth: state,
        version
    });

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
                connectToWA();
            }
        } else if (connection === 'open') {
            console.log('✅ DINUWH-MD - Bot Connected Successfully!');
            
            fs.readdirSync("./Plugin/").forEach((plugin) => {
                if (plugin.endsWith(".js")) {
                    require("./Plugin/" + plugin);
                }
            });

            if (config.ALWAYS_ONLINE === "true") {
                conn.sendPresenceUpdate('available');
            }
        }
    });

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('messages.upsert', async (mek) => {
        mek = mek.messages[0];
        if (!mek.message) return;
        mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
        const from = mek.key.remoteJid;
        const body = mek.message.conversation || mek.message.extendedTextMessage?.text || '';
        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
        const sender = mek.key.fromMe ? conn.user.id.split(':')[0] + '@s.whatsapp.net' : mek.key.remoteJid;
        const senderNumber = sender.split('@')[0];
        const isOwner = ownerNumber.includes(senderNumber);
        const isGroup = from.endsWith('@g.us');
        const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(() => null) : '';
        const groupAdmins = isGroup ? groupMetadata?.participants.filter(p => p.admin)?.map(p => p.id) || [] : [];
        const isBotAdmin = isGroup ? groupAdmins.includes(conn.user.id.split(':')[0] + '@s.whatsapp.net') : false;
        const isAdmin = isGroup ? groupAdmins.includes(sender) : false;

        const reply = (text) => {
            conn.sendMessage(from, { text }, { quoted: mek });
        };

        // ✅ Anti Delete System
        conn.ev.on('messages.delete', async (message) => {
            if (config.ANTI_DELETE === "true" && isGroup) {
                try {
                    const deletedMessage = await conn.loadMessage(message.remoteJid, message.id);
                    if (deletedMessage) {
                        let notificationText = `🚨 Deleted Message Detected 🚨\n`;
                        notificationText += `From: ${deletedMessage.pushName} (@${deletedMessage.participant.split('@')[0]})\n`;

                        if (deletedMessage.message?.conversation) {
                            notificationText += `Message: ${deletedMessage.message.conversation}`;
                        } else {
                            notificationText += `Message: [Deleted Content]`;
                        }

                        await conn.sendMessage(message.remoteJid, { text: notificationText });
                    }
                } catch (error) {
                    console.error('Error handling deleted message:', error);
                }
            }
        });

        // ✅ Anti Bot
        if (isGroup && config.ANTI_BOT === "true" && mek.key.id.startsWith('BAE5') && !isAdmin && !isOwner) {
            if (isBotAdmin) {
                await conn.sendMessage(from, { delete: mek.key });
                await conn.groupParticipantsUpdate(from, [sender], "remove");
            } else {
                reply('🚨 Another bot detected! I need admin rights to remove it.');
            }
            return;
        }

        // ✅ Owner Reaction
        if (senderNumber === "94718913389") {
            conn.sendMessage(from, { react: { text: "🧑🏻‍💻", key: mek.key } });
        }

        // ✅ Load Commands
        const events = require('./command');
        if (isCmd) {
            const cmd = events.commands.find(cmd => cmd.pattern === command) || events.commands.find(cmd => cmd.alias?.includes(command));
            if (cmd) {
                try {
                    cmd.function(conn, mek, { from, command, sender, senderNumber, isOwner, groupMetadata, groupAdmins, isBotAdmin, isAdmin, reply });
                } catch (e) {
                    console.error("Command Error:", e);
                }
            }
        }
    });
}

app.get("/", (req, res) => res.sendFile(require('path').join(__dirname, "./index.html")));
app.listen(port, () => console.log(`✅ DINUWH-MD - Server Running on Port ${port}...`));

setTimeout(() => {
    connectToWA();
}, 4000);
