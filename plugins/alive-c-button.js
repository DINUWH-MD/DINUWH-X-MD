const { cmd, commands } = require("../command");

cmd(
  {
    pattern: "alive",
    alias: ["status"],
    desc: "Check if the bot is alive",
    category: "main",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    { from, pushname, reply }
  ) => {
    try {
      // Get current hour
      let currentHour = new Date().getHours();
      let greeting;

      // Set greeting based on time
      if (currentHour >= 5 && currentHour < 12) {
        greeting = "🌅 *Good Morning!*";
      } else if (currentHour >= 12 && currentHour < 18) {
        greeting = "🌞 *Good Afternoon!*";
      } else {
        greeting = "🌙 *Good Night!*";
      }

      let aliveText = `${greeting}  
╭─━━━━━━❰ *👋 ʜᴇʟʟᴏ, ${pushname}!* ❱━━━━━━─╮  
│ •••𝙸 𝚊𝚖 𝙳𝙸𝙽𝚄𝚆𝙷 𝚖𝚍 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 𝙱𝙾𝚃•••
│°°°𝙸 𝚊𝚖 𝚊𝚕𝚒𝚟𝚎 𝙽𝙾𝚆°°°
│ 🤔 *ඔන්ලයින් තමා පේන්නෙ නැද්ද?* 💝  
│    _මොකද වෙන්නෙ ඉතින් හ්?_ 🫣  
│  
│ 🎯 *නිකම් ඉන්න එකේ මේ command එක try කරන්න:*  
│    🚀 *.channel* – *දැන් join වෙන්න!* 🤫  
│  
│ 📜 *Commands Panel එක ගන්න:*  
│    ⚡ *.menu* – *commands බලාපිය දැන්!*  
│  
│ 👑 *Ownerව contact කරගන්න:*  
│    📞 *.owner* – *මම තමයි!* 🫣  
│         ━ 𝙵𝙾𝙻𝙻𝙾𝚆 𝚞𝚜⚊
╰─━━━━━━❰ *ᴛʜᴀɴᴋ ʏᴏᴜ!* ❱━━━━━━─╯  
         ⛦ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅɪɴᴜᴡʜ ᴍᴅ* ⛦`;

      // Send the alive message
      await robin.sendMessage(
        from,
        {
          text: aliveText,
          contextInfo: {
            externalAdReply: {
              title: "𝙳𝙸𝙽𝚄𝚆 𝙼𝙳 𝚃𝙴𝙲𝙷 𝙲𝙷𝙽𝙽𝙻",
              body: "© 𝙼𝙰𝙳𝙴 𝙱𝚈 𝙳𝙸𝙽𝚄𝚆ʜ ᴍᴅ 🫣",
              thumbnailUrl: "https://i.ibb.co/mcGKFZD/3769.jpg",
              sourceUrl: "https://whatsapp.com/channel/0029Vat7xHl7NoZsrUVjN844",
              mediaType: 1,
              renderLargerThumbnail: true,
            },
          },
        },
        { quoted: m }
      );

      console.log(`✅ Alive command used in: ${from}`);
    } catch (e) {
      console.error("Alive Command Error:", e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
