import express from "express";
import dotenv from "dotenv";
import cron from 'node-cron';
dotenv.config();

const app = express();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const USERNAME = process.env.GITHUB_USERNAME || 'ayan-mn18' ;

import { TwitterApi } from 'twitter-api-v2';
import getRecentContributions from "./fetchGithubContributions";


// Load credentials from environment variables
const client = new TwitterApi({
  appKey: process.env.X_API_KEY!,
  appSecret: process.env.X_API_SECRET!,
  accessToken: process.env.X_ACCESS_TOKEN!,
  accessSecret: process.env.X_ACCESS_SECRET!,
});

const postTweet = async (message: string) => {
  try {
    const response = await client.v2.tweet(message);
    console.log('Tweet posted:', response);
  } catch (error) {
    console.error('Error posting tweet:', error);
  }
};

app.get('/post', async (req,res) => {
  // postTweet('This is my bot tweeting for me :)')
  const contributions = await getRecentContributions(USERNAME);
  console.log(`Contributions in the last 24 hours: ${contributions}`);

  postTweet(`My lazy ass only did ${contributions} commits in last 24 hours \n\n\n\n Ayan's twitter bot`);
  res.json({ contributions:  contributions}); 
});

// Cron job to post a tweet every day just after midnight (00:01)
// cron.schedule('1 0 * * *', async () => {
//   const contributions = await getRecentContributions(USERNAME);
//   const message = `My lazy ass only did ${contributions} commits in last 24 hours \n\n\n\n Ayan's twitter bot`;
//   console.log(`Posting tweet at: ${new Date().toISOString()}`);
//   await postTweet(message);
// });

// console.log('Cron job scheduled to post a tweet every day at 00:01.');
  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  