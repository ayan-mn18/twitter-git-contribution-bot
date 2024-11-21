import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import { setupBullBoard } from "./config/SetupBullBoard";
import { replaceJob } from "./jobs/tweet-scheduler";
import { getRecentContributions } from "./services/github";
import { githubConfig } from "./config/config";
import routes from './routes';
import { db } from "./db/config";
import { errorHandler } from "./middleware.ts/errorHandler";
import { uuid } from 'uuidv4'
import { generateTweetMesg } from "./services";

const app = express();

app.use(express.json())

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const HOST = process.env.HOST

// Setup Bull Board
const bullBoardAdapter = setupBullBoard();
app.use('/admin/queues', bullBoardAdapter.getRouter());

app.use(morgan('dev'));

app.get('/post', async (req,res) => {
  const contributions = await getRecentContributions(githubConfig.username!);
  console.log(`Contributions in the last 24 hours: ${contributions}`);

  // postTweet(`My lazy ass only did ${contributions} commits in last 24 hours \n\n\n\n Ayan's twitter bot`);
  res.json({ contributions:  contributions}); 
});

app.get('/tweets', async(req, res) => {
  // const resposne = await generateTweetMesg(25, '1');
  // console.log(resposne.choices[0].message.content)
  // res.json()
})

app.use('/api', routes);

app.use(errorHandler)
console.log(uuid())
// replaceJob();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} \n\n\n`);
  console.log(`BullBoard running on ${HOST}/admin/queues 🔥`)
});
  