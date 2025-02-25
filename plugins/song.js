const { cmd } = require('../command');
const fetch = require("node-fetch");
const ytsearch = require("yt-search");

cmd({ 
    pattern: "song", 
    alias: ["audio", "mp3"], 
    react: "🎵", 
    desc: "Download YouTube audio", 
    category: "download", 
    use: '.song <YouTube URL or Name>', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("⚠️ Please provide a YouTube URL or song name!");

        const yt = await ytsearch(q);
        if (yt.videos.length < 1) return reply("❌ No results found!");

        let yts = yt.videos[0];  
        let apiUrl = `https://api.davidcyril.tech/ytmp3?url=${encodeURIComponent(yts.url)}`;

        let response = await fetch(apiUrl);
        let data = await response.json();

        if (!data || !data.status || !data.result || !data.result.download_url) {
            return reply("⚠️ Failed to fetch the audio. Please try again later.");
        }

        let audioUrl = data.result.download_url;
        let ytmsg = `╭━━━〔 *🌟 DINUWH MD 🌟* 〕━━━┈⊷
┃▸╭─────────────────
┃▸┃ 🎵 *AUDIO DOWNLOADER*
┃▸└─────────────────···
╰──────────────────────┈⊷
╭━━❐━⪼
┇📌 *Title:* ${yts.title}
┇⏱️ *Duration:* ${yts.timestamp}
┇👀 *Views:* ${yts.views}
┇👤 *Author:* ${yts.author.name}
┇🔗 *Link:* ${yts.url}
╰━━❑━⪼

*💫 Quality Audio Downloader By DINUWH MD*`;

        await conn.sendMessage(from, { image: { url: yts.thumbnail || '' }, caption: ytmsg }, { quoted: mek });

        await conn.sendMessage(from, { audio: { url: audioUrl }, mimetype: "audio/mpeg", ptt: false }, { quoted: mek });

        await conn.sendMessage(from, { 
            document: { url: audioUrl }, 
            mimetype: "audio/mpeg", 
            fileName: `${yts.title}.mp3`, 
            caption: `🎵 *${yts.title}*\n\n*🌟 Created By:* DINUWH\n*🤖 Bot:* DINUWH MD`
        }, { quoted: mek });

        await conn.sendMessage(from, { audio: { url: audioUrl }, mimetype: "audio/mpeg", ptt: true }, { quoted: mek });

        await reply("✅ *Thanks for using my bot!*");

    } catch (e) {
        console.error(e);
        reply("❌ An error occurred. Please try again later.");
    }
});

module.exports = { cmd };
