import { TwitterApi } from 'twitter-api-v2';
import { XConfig } from '../config/config';

const client = new TwitterApi(XConfig);


export const postTweet = async (message: string) => {
  try {
    const response = await client.v2.tweet(message);
    console.log('Tweet posted:', response);
  } catch (error) {
    console.error('Error posting tweet:', error);
  }
};