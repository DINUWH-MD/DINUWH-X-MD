const { cmd, commands } = require("../command");

   cmd({
    pattern: "support",
    desc: "To get the bot informations.",
    category: "main",
    react: "⛓",
    filename: __filename
},
async(conn, mek, m, { from, pushname, reply }) => {
    try {
        let desc = `*👋 Hello ${pushname}*\n\n` +
                   `*👨‍💻 SAHAS-MD-V2 Support Channels 💗*\n\n` +
                   `*📺 YouTube:* https://www.youtube.com/@Sahas_Tech\n` +
                   `*💬 WhatsApp Channel:* https://whatsapp.com/channel/0029VaiTjMlK5cDLek3bB533\n\n` +
                   `> *© Powered by Sahas Tech*`;

        // Send the message as a forwarded style
        await conn.sendMessage(from, {
            text: desc,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: '👾 ＳＡＨＡＳ  |   𝚃𝙴𝙲𝙷 ジ',
                    newsletterJid: "120363296605464049@newsletter",
                },
                externalAdReply: {
                    title: "SAHAS-MD-V2 Support Channels",
                    body: "Click here for support",
                    thumbnailUrl: "https://pomf2.lain.la/f/gssbhhf4.jpg",
                    sourceUrl: "https://sahas-md-main-web.vercel.app/",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply(`*Error:* ${e.message}`);
    }
});
