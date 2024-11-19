import dotenv from "dotenv";

dotenv.config();
import express from "express";


const app = express();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const HOST = process.env.HOST

import { setupBullBoard } from "./config/SetupBullBoard";
import { replaceJob } from "./jobs/tweet-scheduler";
import { getRecentContributions } from "./services/github";
import { githubConfig, LeetcodeConfig } from "./config/config";
import { getLeetcodeSubmissions } from "./services";

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
(async () => {
  const submissions = await getLeetcodeSubmissions(LeetcodeConfig.username!)
  console.log(`Leetcode Submissions: ${submissions}`);
})();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} \n\n\n`);
  console.log(`BullBoard running on ${HOST}/admin/queues 🔥`)
});
  