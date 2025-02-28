const { cmd, commands } = require("../command");
const yts = require("yt-search");
const axios = require("axios");

cmd(
{
    pattern: "sytmp4",
    alias: "svideo",
    react: "🎥",
    desc: "Download YouTube Videos",
    category: "download",
    filename: __filename,
},
async (
    robin,
    mek,
    m,
    {
        from,
        quoted,
        q,
        reply,
    }
) => {
    try {
        if (!q) return reply("🔍 කරුණාකර YouTube ලින්ක් එක හෝ Video නම ලබාදෙන්න!");

        // 🔎 YouTube Video සොයන්න
        const search = await yts(q);
        if (!search.videos.length) return reply("❌ Requested video not found!");

        const data = search.videos[0];
        const videoUrl = data.url;

        // 🎥 Video Info
        let desc = `┏━━━━━━━━━━━━━━━┓
┃  🎥 *DINUWH MD - MP4 Downloader* 🎬  ┃
┗━━━━━━━━━━━━━━━┛

🎬 *Title:* ${data.title}
⏳ *Duration:* ${data.timestamp}
📅 *Uploaded:* ${data.ago}
👀 *Views:* ${data.views}
🔗 *Watch Here:* ${data.url}

📥 *Fetching & Downloading...*
`;

        // 📌 Send Initial Message
        await robin.sendMessage(
            from,
            {
                text: desc,
                contextInfo: {
                    externalAdReply: {
                        title: "DINUWH MD - TECH CHANNEL",
                        body: `👀 Views: ${data.views}`,
                        thumbnail: { url: data.thumbnail },
                        sourceUrl: "https://whatsapp.com/channel/0029Vat7xHl7NoZsrUVjN844",
                        mediaType: 1,
                        renderLargerThumbnail: true,
                    },
                },
            },
            { quoted: mek }
        );

        // 🎞️ Fetch MP4 Download Link (New API)
        let apiUrl = `https://yt1s.com/api/ajaxSearch/index?vid=${encodeURIComponent(videoUrl)}`;
        let response = await axios.get(apiUrl);

        if (!response.data || !response.data.links || !response.data.links.mp4["720p"]) {
            return reply("❌ Video download link not found!");
        }

        let downloadUrl = response.data.links.mp4["720p"].url;

        // 📽️ Send Video
        await robin.sendMessage(
            from,
            {
                video: { url: downloadUrl },
                mimetype: "video/mp4",
                caption: `✅ *Downloaded via DINUWH MD* 🎬`,
            },
            { quoted: mek }
        );

        return reply("✅ *Download Complete!* Enjoy your video 🎥");

    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
    }
}
);
