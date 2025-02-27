const { cmd, commands } = require("../command");
const yts = require("yt-search");
const { ytmp3 } = require("@vreden/youtube_scraper");

cmd(
{
    pattern: "song",
    alias: "ytmp3",
    react: "🎵",
    desc: "Download Songs from YouTube",
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
        if (!q) return reply("🔍 කරුණාකර ගීතයෙ නම හෝ YouTube ලින්ක් එක ලබාදෙන්න!");

        // 🔎 YouTube Video සොයන්න
        const search = await yts(q);
        if (!search.videos.length) return reply("❌ Requested song not found!");

        const data = search.videos[0];
        const url = data.url;

        // 🎶 Song Information
        let desc = `┏━━━━━━━━━━━━━━━┓
┃   🎧 *DINUWH MD - SONG DOWNLOADER* 🎧   ┃
┗━━━━━━━━━━━━━━━┛

🎵 *Title:* ${data.title}
⏳ *Duration:* ${data.timestamp}
📅 *Uploaded:* ${data.ago}
👀 *Views:* ${data.views}
🔗 *Listen Here:* ${data.url}

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

        // 🎼 Download MP3
        const songData = await ytmp3(url, "128");
        if (!songData || !songData.download || !songData.download.url) {
            return reply("❌ Download Failed!");
        }

        // ⏱️ Check Duration (Limit: 30 minutes)
        let durationParts = data.timestamp.split(":").map(Number);
        let totalSeconds =
            durationParts.length === 3
                ? durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2]
                : durationParts[0] * 60 + durationParts[1];

        if (totalSeconds > 1800) {
            return reply("⏱️ Sorry! Audio limit is 30 minutes!");
        }

        // 📢 Send as Normal Audio
        await robin.sendMessage(
            from,
            {
                audio: { url: songData.download.url },
                mimetype: "audio/mpeg",
            },
            { quoted: mek }
        );

        // 📄 Send as Document
        await robin.sendMessage(
            from,
            {
                document: { url: songData.download.url },
                mimetype: "audio/mpeg",
                fileName: `${data.title}.mp3`,
                caption: "🔥 *Downloaded via DINUWH MD* ❤️",
            },
            { quoted: mek }
        );

        // 🎤 Send as Voice Note
        await robin.sendMessage(
            from,
            {
                audio: { url: songData.download.url },
                mimetype: "audio/mpeg",
                ptt: true, // Voice note
            },
            { quoted: mek }
        );

        return reply("✅ *Download Complete!* Enjoy your song 🎶");

    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
    }
}
);
