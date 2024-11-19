import dotenv from "dotenv";

dotenv.config();
import express from "express";


const app = express();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const USERNAME = process.env.GITHUB_USERNAME || 'ayan-mn18' ;

import { TwitterApi } from 'twitter-api-v2';
import { setupBullBoard } from "./config/SetupBullBoard";
import { queue, replaceJob } from "./jobs/tweet-scheduler";
import { getRecentContributions } from "./services/github";
import { githubConfig } from "./config/config";
import moment from "moment-timezone";


// Load credentials from environment variables
// const client = new TwitterApi({
//   appKey: process.env.X_API_KEY!,
//   appSecret: process.env.X_API_SECRET!,
//   accessToken: process.env.X_ACCESS_TOKEN!,
//   accessSecret: process.env.X_ACCESS_SECRET!,
// });

// const postTweet = async (message: string) => {
//   try {
//     const response = await client.v2.tweet(message);
//     console.log('Tweet posted:', response);
//   } catch (error) {
//     console.error('Error posting tweet:', error);
//   }
// };

app.get('/post', async (req,res) => {
  const contributions = await getRecentContributions(githubConfig.username!);
  console.log(`Contributions in the last 24 hours: ${contributions}`);

  // postTweet(`My lazy ass only did ${contributions} commits in last 24 hours \n\n\n\n Ayan's twitter bot`);
  res.json({ contributions:  contributions}); 
});
  
// Setup Bull Board
const bullBoardAdapter = setupBullBoard();
app.use('/admin/queues', bullBoardAdapter.getRouter());

replaceJob();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} \n\n\n`);
  console.log(`BullBoard running on http://localhost:${PORT}/admin/queues 🔥`)
});
  