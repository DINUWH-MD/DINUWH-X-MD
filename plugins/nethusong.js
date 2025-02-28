const { cmd } = require("../command");
const fetch = require("node-fetch");

// 🎵 YouTube MP3 Downloader
cmd(
{
    pattern: "aytmp3",
    react: "🎵",
    desc: "Download YouTube MP3",
    category: "download",
    filename: __filename,
},
async (DINUWH, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("⚠️ කරුණාකර YouTube ලින්ක් එකක් හෝ ගීත නමක් දෙන්න!");

        let apiUrl = `https://nethuofc.vercel.app/youtube/mp3?link=${encodeURIComponent(q)}&quality=128`;

        let desc = `🎧 *DINUWH MD - MP3 Downloader* 🎶
🔗 *Download Link:* ${apiUrl}

🔄 *Downloading & Processing...*`;

        await DINUWH.sendMessage(from, { text: desc }, { quoted: mek });

        await DINUWH.sendMessage(
            from,
            {
                document: { url: apiUrl },
                mimetype: "audio/mpeg",
                fileName: "Downloaded.mp3",
                caption: "🎵 *Downloaded by DINUWH MD* ❤️",
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error(e);
        reply(`❌ *Error:* ${e.message}`);
    }
});

// 🎥 YouTube MP4 Downloader
cmd(
{
    pattern: "aytmp4",
    react: "🎬",
    desc: "Download YouTube MP4",
    category: "download",
    filename: __filename,
},
async (DINUWH, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("⚠️ කරුණාකර YouTube ලින්ක් එකක් දෙන්න!");

        let apiUrl = `https://nethuofc.vercel.app/youtube/mp4?link=${encodeURIComponent(q)}&quality=720`;

        let desc = `🎥 *DINUWH MD - MP4 Downloader* 🎬
🔗 *Download Link:* ${apiUrl}

🔄 *Downloading & Processing...*`;

        await DINUWH.sendMessage(from, { text: desc }, { quoted: mek });

        await DINUWH.sendMessage(
            from,
            {
                video: { url: apiUrl },
                mimetype: "video/mp4",
                caption: "🎥 *Downloaded by DINUWH MD* ❤️",
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error(e);
        reply(`❌ *Error:* ${e.message}`);
    }
});

// 🔍 YouTube Search Command
cmd(
{
    pattern: "ayts",
    react: "🔍",
    desc: "Search YouTube videos",
    category: "search",
    filename: __filename,
},
async (DINUWH, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("⚠️ කරුණාකර සෙවුම් පදයක් දෙන්න!");

        let apiUrl = `https://nethuofc.vercel.app/youtube/search?q=${encodeURIComponent(q)}`;
        let response = await fetch(apiUrl);
        let data = await response.json();

        if (!data || !data.results || data.results.length === 0) {
            return reply("❌ කිසිවක් හමු නොවීය!");
        }

        let results = data.results.slice(0, 5);
        let msg = "🔍 *YouTube Search Results:* 📺\n\n";

        results.forEach((video, index) => {
            msg += `📌 *${video.title}*\n`;
            msg += `📺 Channel: ${video.author.name}\n`;
            msg += `⏳ Duration: ${video.timestamp}\n`;
            msg += `👀 Views: ${video.views}\n`;
            msg += `🔗 Link: ${video.url}\n\n`;
        });

        await DINUWH.sendMessage(from, { text: msg }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply(`❌ *Error:* ${e.message}`);
    }
});
