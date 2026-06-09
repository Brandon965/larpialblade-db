import { file } from "bun";
import { readdirSync, writeFileSync } from "node:fs";

const users = readdirSync("./users");
const tuberList = []

const API_KEY = process.env.YOUTUBE_API;


async function getChannel(handle) {
  const channelRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${handle}&key=${API_KEY}`,
  );

  const channelData = await channelRes.json();
  const channel = channelData.items[0];

  return {
    icon: channel.snippet.thumbnails.high.url,
    youtube: {
      url: `https://youtube.com/@${handle}`,
      description: channel.snippet.description,
      subs: Number(channel.statistics.subscriberCount),
      views: Number(channel.statistics.viewCount),
      videos: Number(channel.statistics.videoCount),
    },
  };
}

for (const e of users) {
  const f = JSON.parse(await file(`users/${e}`).text());
  const r = await getChannel(f.youtube.url.split('@')[1]);

  if (f.icon != r.icon) {
    f.icon = r.icon;
  }

  if (f.youtube.description != r.youtube.description) {
    f.youtube.description = r.youtube.description;
  }
  if (f.youtube.subs != r.youtube.subs) {
    f.youtube.subs = r.youtube.subs;
  }
  if (f.youtube.views != r.youtube.views) {
    f.youtube.views = r.youtube.views;
  }
  if (f.youtube.videos != r.youtube.videos) {
    f.youtube.videos = r.youtube.videos;
  }

  tuberList.push(f);
  
  writeFileSync(`users/${e}`, JSON.stringify(f))
}

writeFileSync('lists/larptubers.json', JSON.stringify(larpList))
