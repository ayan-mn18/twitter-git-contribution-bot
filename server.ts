import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

import { TwitterApi } from 'twitter-api-v2';


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

app.get('/post', (req,res) => {
  postTweet('This is my bot tweeting for me :)')
  return;
})
  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  