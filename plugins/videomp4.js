const { cmd, commands } = require("../command");
const fetch = require("node-fetch");
const fs = require("fs");
const axios = require("axios"); // For downloading video

cmd({
    pattern: "yt360",
    alias: ["ytmp4_360"],
    react: "🎥",
    desc: "Download YouTube video in 360p and send",
    category: "download",
    use: '.yt360 <YT URL>',
    filename: __filename
}, async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return await reply("⚠️ Please provide a valid YouTube URL!");

        let apiUrl = `https://nethuofc.vercel.app/youtube/mp4?link=${encodeURIComponent(q)}&quality=360`;
        let response = await fetch(apiUrl);
        let data = await response.json();

        if (!data || !data.result || !data.result.url) return reply("❌ Failed to fetch video. Try another link!");

        let videoUrl = data.result.url;
        let title = data.result.title || "YouTube Video";
        let thumbnail = data.result.thumbnail || "";
        let duration = data.result.duration || "Unknown";
        let channel = data.result.channel || "Unknown";
        
        let msg = `╭━━━〔 *🌟 DINUWH MD 🌟* 〕━━━┈⊷
┃▸ 📽️ *YOUTUBE VIDEO 360p*
┃▸ 🎬 *Title:* ${title}
┃▸ ⏱️ *Duration:* ${duration}
┃▸ 👤 *Channel:* ${channel}
┃▸ 🔗 *Link:* ${q}
╰━━━⪼ *💫 Downloaded by DINUWH MD*`;

        await conn.sendMessage(from, { image: { url: thumbnail }, caption: msg }, { quoted: mek });

        // 🔽 Download video
        let filePath = `./temp/${title.replace(/[^\w\s]/gi, '')}.mp4`; // Save with sanitized name
        let videoStream = fs.createWriteStream(filePath);
        let videoResponse = await axios({ url: videoUrl, responseType: "stream" });

        videoResponse.data.pipe(videoStream);

        videoStream.on("finish", async () => {
            await conn.sendMessage(from, { video: fs.readFileSync(filePath), mimetype: "video/mp4" }, { quoted: mek });
            fs.unlinkSync(filePath); // Remove file after sending
        });

    } catch (e) {
        console.log(e);
        reply("❌ An error occurred. Please try again later.");
    }
});
