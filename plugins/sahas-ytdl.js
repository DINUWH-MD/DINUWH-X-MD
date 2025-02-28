const { cmd, commands } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js'); 

// Video Download Command
cmd({ 
    pattern: "2video", 
    alias: ["2ytmp4", "2mp4"], 
    react: "🎥", 
    desc: "Download Youtube video", 
    category: "download", 
    use: '.video < Yt URL or Name >', 
    filename: __filename 
}, async (conn, mek, m, { from, q, reply }) => { 
    try { 
        if (!q) return reply("🔍 *Please provide a YouTube URL or song name!*");

        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("❌ *No results found!*");
        
        let yts = yt.results[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;
        
        let response = await fetch(apiUrl);
        let data = await response.json();
        
        if (data.status !== 200 || !data.success || !data.result.download_url) {
            return reply("⚠️ *Failed to fetch the video. Try again later!*");
        }
        
        let ytmsg = `╭━━━〔 *🎥 VIDEO DOWNLOADER 🎥* 〕━━━╮
┃ 📌 *Title:* ${yts.title}
┃ ⏳ *Duration:* ${yts.timestamp}
┃ 👀 *Views:* ${yts.views}
┃ 👤 *Author:* ${yts.author.name}
┃ 🔗 *Link:* ${yts.url}
╰━━━━━━━━━━━━━━━━━━━━━━━━━╯
> *© POWERED BY DINUWH MD*`;

        await conn.sendMessage(from, { image: { url: data.result.thumbnail || '' }, caption: ytmsg }, { quoted: mek });
        await conn.sendMessage(from, { video: { url: data.result.download_url }, mimetype: "video/mp4" }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ *An error occurred. Please try again later!*");
    }
});  

// Song Download Command (PTT, Document & Normal Audio)
cmd({ 
    pattern: "2song", 
    alias: ["2ytmp3", "play", "2mp3"], 
    react: "🎶", 
    desc: "Download Youtube song",
    category: "download", 
    use: '.song < Yt URL or Name >', 
    filename: __filename 
}, async (conn, mek, m, { from, q, reply }) => { 
    try { 
        if (!q) return reply("🔍 *Please provide a YouTube URL or song name!*");

        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("❌ *No results found!*");

        let yts = yt.results[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(yts.url)}`;
        
        let response = await fetch(apiUrl);
        let data = await response.json();
        
        if (data.status !== 200 || !data.success || !data.result.downloadUrl) {
            return reply("⚠️ *Failed to fetch the audio. Try again later!*");
        }
        
        let ytmsg = `╭━━━〔 *🎵 MUSIC DOWNLOADER 🎵* 〕━━━╮
┃ 📌 *Title:* ${yts.title}
┃ ⏳ *Duration:* ${yts.timestamp}
┃ 👀 *Views:* ${yts.views}
┃ 👤 *Author:* ${yts.author.name}
┃ 🔗 *Link:* ${yts.url}
╰━━━━━━━━━━━━━━━━━━━━━━━━━╯
> *© POWERED BY DINUWH MD*`;

        await conn.sendMessage(from, { image: { url: data.result.image || '' }, caption: ytmsg }, { quoted: mek });

        // Send as Normal Audio
        await conn.sendMessage(from, { 
            audio: { url: data.result.downloadUrl }, 
            mimetype: "audio/mpeg" 
        }, { quoted: mek });

        // Send as PTT (Voice Note)
        await conn.sendMessage(from, { 
            audio: { url: data.result.downloadUrl }, 
            mimetype: "audio/mpeg", 
            ptt: true 
        }, { quoted: mek });

        // Send as Document
        await conn.sendMessage(from, { 
            document: { url: data.result.downloadUrl }, 
            mimetype: "audio/mpeg", 
            fileName: `${yts.title}.mp3`, 
            caption: `🎵 *${yts.title}*\n> *© POWERED BY DINUWH MD*`
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ *An error occurred. Please try again later!*");
    }
});
