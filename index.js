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
        connectToWA();
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
  
  conn.ev.on('creds.update', saveCreds);

  conn.ev.on('messages.upsert', async(mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;
    mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;

    conn.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { return conn.sendMessage(jid, { poll: { name, values, selectableCount }}) }

var dbset = await  get_set('all')

config = await jsonConcat(config , dbset)
prefix = config.PREFIX
var isCmd = body.startsWith(prefix)	
var command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
var args = body.trim().split(/ +/).slice(1)
var q = args.join(' ')

var body2 = ''

if(smg.quoted && smg.quoted.fromMe && await id_db.check(smg.quoted.id)  ){
if (body.startsWith(prefix))  body = body.replace( prefix , '')

var id_body = await id_db.get_data( smg.quoted.id , body)

if (id_body.cmd) {
isCmd = true
command = id_body.cmd.startsWith(prefix)?  id_body.cmd.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
args = id_body.cmd.trim().split(/ +/).slice(1)
q = args.join(' ')		
}
}
console.log(command)

const isGroup = from.endsWith('@g.us')  
        const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)  
        const senderNumber = sender.split('@')[0]  
        const botNumber = conn.user.id.split(':')[0]  
        const pushname = mek.pushName || 'Sin Nombre'  
    const ownbot = config.OWNER  
    const isownbot = ownbot?.includes(senderNumber)  
    const newNumber = '94743381623,94789123880'  
        const sudo = config.SUDO  
        const developers = `${newNumber},${sudo}`;  
        const isbot = botNumber.includes(senderNumber)  
    const isdev = developers.includes(senderNumber) 	  
        let epaneda =  "94714857323,94743381667"  
        const epada = epaneda.split(",")	      
        const isDev = [ ...epada ].map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(sender)  
    const botNumber2 = await jidNormalizedUser(conn.user.id)  
        const isCreator = [ botNumber2 ].map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(sender)	    
    const isMe = isbot ? isbot : isdev  
        const isOwner = ownerNumber.includes(senderNumber) || isMe  
        const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''  
        const groupName = isGroup ? groupMetadata.subject : ''  
        const participants = isGroup ? await groupMetadata.participants : ''  
        const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''  
        const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false  
        const isAdmins = isGroup ? groupAdmins.includes(sender) : false  
        const isreaction = m.message.reactionMessage ? true : false  
        const isReact =m.message.reactionMessage ? true : false  
    const isAnti = (teks) => {  
            let getdata = teks  
            for (let i = 0; i < getdata.length; i++) {  
                if (getdata[i] === from) return true  
            }  
            return false  
        }  
        const reply = async(teks) => {

return await conn.sendMessage(from, { text: teks }, { quoted: mek })
}

if(!isOwner) {	//!isOwner) {	  
if(config.ANTI_DELETE === "true" ) {  
      
if (!m.id.startsWith("BAE5")) {  
  
// Ensure the base directory exists  
const baseDir = 'message_data';  
if (!fs.existsSync(baseDir)) {  
  fs.mkdirSync(baseDir);  
}  
  
function loadChatData(remoteJid, messageId) {  
  const chatFilePath = path.join(baseDir, remoteJid, `${messageId}.json`);  
  try {  
    const data = fs.readFileSync(chatFilePath, 'utf8');  
    return JSON.parse(data) || [];  
  } catch (error) {  
    return [];  
  }  
}  
  
function saveChatData(remoteJid, messageId, chatData) {  
  const chatDir = path.join(baseDir, remoteJid);  
  
  if (!fs.existsSync(chatDir)) {  
    fs.mkdirSync(chatDir, { recursive: true });  
  }  
  
  const chatFilePath = path.join(chatDir, `${messageId}.json`);  
  
  try {  
    fs.writeFileSync(chatFilePath, JSON.stringify(chatData, null, 2));  
   // console.log('Chat data saved successfully.');  
  } catch (error) {  
    console.error('Error saving chat data:', error);  
  }  
}  
      
function handleIncomingMessage(message) {  
  const remoteJid = from //message.key.remoteJid;  
  const messageId = message.key.id;  
  
  const chatData = loadChatData(remoteJid, messageId);  
  
  chatData.push(message);  
  
  saveChatData(remoteJid, messageId, chatData);  
  
//  console.log('Message received and saved:', messageId);  
}  
  
const delfrom = config.DELETEMSGSENDTO !=='' ? config.DELETEMSGSENDTO + '@s.whatsapp.net': from  
function handleMessageRevocation(revocationMessage) {  
//const remoteJid = revocationMessage.message.protocolMessage.key.remoteJid;  
 //const messageId = revocationMessage.message.protocolMessage.key.id;  
const remoteJid = from // revocationMessage.msg.key.remoteJid;  
const messageId = revocationMessage.msg.key.id;  
  
      
 // console.log('Received revocation message with ID:', messageId);  
  
  const chatData = loadChatData(remoteJid, messageId);  
  
   const originalMessage = chatData[0]     
  
  if (originalMessage) {  
    const deletedBy = revocationMessage.sender.split('@')[0];  
    const sentBynn = originalMessage.key.participant ?? revocationMessage.sender;  
const sentBy = sentBynn.split('@')[0];  
      if ( deletedBy.includes(botNumber) || sentBy.includes(botNumber) ) return;  
 if(originalMessage.message && originalMessage.message.conversation && originalMessage.message.conversation !== ''){  
     const messageText = originalMessage.message.conversation;  
if (isGroup && messageText.includes('chat.whatsapp.com')) return;  
     var xx = '```'  
 conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${xx}${messageText}${xx}` });  
//........................................//........................................  
}else if(originalMessage.msg.type ==='MESSAGE_EDIT'){  
 conn.sendMessage(delfrom, { text: `❌ *edited message detected* ${originalMessage.message.editedMessage.message.protocolMessage.editedMessage.conversation}` },{quoted: mek});  
   
//........................................//........................................  
} else if(originalMessage.message && originalMessage.message.exetendedTextMessage && originalMessage.msg.text ){ //&& originalMessage.message.exetendedTextMessage.text && originalMessage.message.exetendedTextMessage.text !== ''){  
    const messageText = originalMessage.msg.text;  
if (isGroup && messageText.includes('chat.whatsapp.com')) return;  
  
 var xx = '```'  
 conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${xx}${messageText}${xx}` });  
} else if(originalMessage.message && originalMessage.message.exetendedTextMessage ){ //&& originalMessage.message.exetendedTextMessage.text && originalMessage.message.exetendedTextMessage.text !== ''){  
    const messagetext = originalMessage.message.extendedTextMessage.text;  
if (isGroup && messageText.includes('chat.whatsapp.com')) return;  
 var xx = '```'  
 conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${xx}${originalMessage.body}${xx}` });  
}else if(originalMessage.type === 'extendedTextMessage') {  
async function quotedMessageRetrive(){       
var nameJpg = getRandom('');  
const ml = sms(conn, originalMessage)  
              
if(originalMessage.message.extendedTextMessage){  
const messagetext = originalMessage.message.extendedTextMessage.text;  
if (isGroup && messageText.includes('chat.whatsapp.com')) return;  
    var xx = '```'  
 conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${xx}${originalMessage.message.extendedTextMessage.text}${xx}` });  
}else{  
const messagetext = originalMessage.message.extendedTextMessage.text;  
if (isGroup && messageText.includes('chat.whatsapp.com')) return;  
    conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${xx}${originalMessage.message.extendedTextMessage.text}${xx}` });  
}  
}  
  
quotedMessageRetrive()  
         
}else if(originalMessage.type === 'imageMessage') {  
      async function imageMessageRetrive(){      var nameJpg = getRandom('');  
const ml = sms(conn, originalMessage)  
            let buff =  await ml.download(nameJpg)  
            let fileType = require('file-type');  
            let type = fileType.fromBuffer(buff);  
            await fs.promises.writeFile("./" + type.ext, buff);  
if(originalMessage.message.imageMessage.caption){  
const messageText = originalMessage.message.imageMessage.caption;  
if (isGroup && messageText.includes('chat.whatsapp.com')) return;  
  
    await conn.sendMessage(delfrom, { image: fs.readFileSync("./" + type.ext), caption: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${originalMessage.message.imageMessage.caption}` })  
}else{  
    await conn.sendMessage(delfrom, { image: fs.readFileSync("./" + type.ext), caption: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_` })  
}         
    }  
imageMessageRetrive()  
   
}else if(originalMessage.type === 'videoMessage') {  
      async function videoMessageRetrive(){      var nameJpg = getRandom('');  
const ml = sms(conn, originalMessage)  
  
const vData = originalMessage.message.videoMessage.fileLength  
const vTime = originalMessage.message.videoMessage.seconds;  
const fileDataMB = config.MAX_SIZE  
const fileLengthBytes = vData  
const fileLengthMB = fileLengthBytes / (1024 * 1024);  
const fileseconds = vTime  
if(originalMessage.message.videoMessage.caption){  
if (fileLengthMB < fileDataMB && fileseconds < 30*60 ) {  
            let buff =  await ml.download(nameJpg)  
            let fileType = require('file-type');  
            let type = fileType.fromBuffer(buff);  
            await fs.promises.writeFile("./" + type.ext, buff);  
const messageText = originalMessage.message.videoMessage.caption;  
if (isGroup && messageText.includes('chat.whatsapp.com')) return;  
  
    await conn.sendMessage(delfrom, { video: fs.readFileSync("./" + type.ext), caption: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${originalMessage.message.videoMessage.caption}` })  
       }  
}else{  
            let buff =  await ml.download(nameJpg)  
            let fileType = require('file-type');  
            let type = fileType.fromBuffer(buff);  
            await fs.promises.writeFile("./" + type.ext, buff);  
    const vData = originalMessage.message.videoMessage.fileLength  
const vTime = originalMessage.message.videoMessage.seconds;  
const fileDataMB = config.MAX_SIZE  
const fileLengthBytes = vData  
const fileLengthMB = fileLengthBytes / (1024 * 1024);  
const fileseconds = vTime  
if (fileLengthMB < fileDataMB && fileseconds < 30*60 ) {  
    await conn.sendMessage(delfrom, { video: fs.readFileSync("./" + type.ext), caption: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_` })  
}  
}         
}  
videoMessageRetrive()  
}else if(originalMessage.type === 'documentMessage') {  
      async function documentMessageRetrive(){      var nameJpg = getRandom('');  
const ml = sms(conn, originalMessage)  
            let buff =  await ml.download(nameJpg)  
            let fileType = require('file-type');  
            let type = fileType.fromBuffer(buff);  
            await fs.promises.writeFile("./" + type.ext, buff);  
  
      
  
if(originalMessage.message.documentWithCaptionMessage){  
  
await conn.sendMessage(delfrom, { document: fs.readFileSync("./" + type.ext), mimetype: originalMessage.message.documentMessage.mimetype, fileName: originalMessage.message.documentMessage.fileName, caption: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n`});  
   
}else{  
  
await conn.sendMessage(delfrom, { document: fs.readFileSync("./" + type.ext), mimetype: originalMessage.message.documentMessage.mimetype, fileName: originalMessage.message.documentMessage.fileName, caption: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n`});  
  
}  
 }  
  
documentMessageRetrive()  
}else if(originalMessage.type === 'audioMessage') {  
      async function audioMessageRetrive(){      var nameJpg = getRandom('');  
const ml = sms(conn, originalMessage)  
            let buff =  await ml.download(nameJpg)  
            let fileType = require('file-type');  
            let type = fileType.fromBuffer(buff);  
            await fs.promises.writeFile("./" + type.ext, buff);  
if(originalMessage.message.audioMessage){  
const audioq = await conn.sendMessage(delfrom, { audio: fs.readFileSync("./" + type.ext), mimetype:  originalMessage.message.audioMessage.mimetype, fileName:  `${m.id}.mp3` })	  
return await conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n` },{quoted: audioq});  
  
}else{  
if(originalMessage.message.audioMessage.ptt === "true"){  
  
const pttt = await conn.sendMessage(delfrom, { audio: fs.readFileSync("./" + type.ext), mimetype:  originalMessage.message.audioMessage.mimetype, ptt: 'true',fileName: `${m.id}.mp3` })	  
return await conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n` },{quoted: pttt});  
  
 }  
  }  
 }  
  
audioMessageRetrive()  
}else if(originalMessage.type === 'stickerMessage') {  
      async function stickerMessageRetrive(){      var nameJpg = getRandom('');  
const ml = sms(conn, originalMessage)  
            let buff =  await ml.download(nameJpg)  
            let fileType = require('file-type');  
            let type = fileType.fromBuffer(buff);  
            await fs.promises.writeFile("./" + type.ext, buff);  
if(originalMessage.message.stickerMessage){  
   
//await conn.sendMessage(from, { audio: fs.readFileSync("./" + type.ext), mimetype:  originalMessage.message.audioMessage.mimetype, fileName:  `${m.id}.mp3` })	  
 const sdata = await conn.sendMessage(delfrom,{sticker: fs.readFileSync("./" + type.ext) ,package: 'ASITHA 🌟'})  
return await conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n` },{quoted: sdata});  
  
}else{  
  
const stdata = await conn.sendMessage(delfrom,{sticker: fs.readFileSync("./" + type.ext) ,package: 'ASITHA 🌟'})  
return await conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n` },{quoted: stdata});  
  
  }  
 }  
  
stickerMessageRetrive()  
         }  
       
  } else {  
    console.log('Original message not found for revocation.');  
  }  
}  
if(!isGroup){  
if (mek.msg && mek.msg.type === 0) {  
  handleMessageRevocation(mek);  
} else {//if(mek.message && mek.message.conversation && mek.message.conversation !== ''){  
  handleIncomingMessage(mek);  
  
    }  
}  
}  
}	  
}




    // Check if the message is a status update and auto-read
    if (mek.key && mek.key.remoteJid === 'status@broadcast') {
      if (config.AUTO_READ_STATUS === "true") {
        await conn.readMessages([mek.key]);

        // React with a random emoji    
        const emojis = ['🧩', '🍉', '💜', '🌸', '🪴', '💊', '💫', '🍂', '🌟', '🎋', '😶‍🌫️', '🫀', '🧿', '👀', '🤖', '🚩', '🥰', '🗿', '💜', '💙', '🌝', '🖤', '💚'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        await conn.sendMessage(mek.key.remoteJid, {    
          react: {    
            text: randomEmoji,    
            key: mek.key,    
          }    
        }, { statusJidList: [mek.key.participant] });
      }
    }

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

    // Auto status downloader logic
    const statesender = ["send", "dapan", "dapn", "ewhahn", "ewanna", "danna", "evano", "evpn", "ewano"];
    for (let word of statesender) {
      if (body.toLowerCase().includes(word)) {
        if (!body.includes('tent') && !body.includes('docu') && !body.includes('https')) {
          let quotedMessage = await quoted.download();
          let caption = quoted.imageMessage ? quoted.imageMessage.caption : quoted.videoMessage ? quoted.videoMessage.caption : '';

          if (quoted.imageMessage) {
            await conn.sendMessage(from, { image: quotedMessage, caption: caption }, { quoted: mek });
          } else if (quoted.videoMessage) {
            await conn.sendMessage(from, { video: quotedMessage, caption: caption }, { quoted: mek });
          } else {
            console.log('Unsupported media type:', quotedMessage.mimetype);
          }

          break;
        }
      }
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

    // Command body processing
    events.commands.map(async(command) => {
      if (body && command.on === "body") {
        command.function(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
      } else if (mek.q && command.on === "text") {
        command.function(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
      } else if ((command.on === "image" || command.on === "photo") && mek.type === "imageMessage") {
        command.function(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
      } else if (command.on === "sticker" && mek.type === "stickerMessage") {
        command.function(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
      }
    });
  });
}

app.get("/", (req, res) => {
  res.send("hey, bot started✅");
});

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

setTimeout(() => {
  connectToWA();
}, 4000);
