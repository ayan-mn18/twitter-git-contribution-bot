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

export const generateTweetMesg = (contributions: number) => {

  let tweetMesg: string;

  const tweetMessageLowContri = `I am being lazy, did only ${contributions} contributions in last 24 hrs \n\n\n Ayan's twitter bot`;
  const tweetMessageMediumContri = `Working my way up a bit, did ${contributions} contributions in last 24 hrs \n\n\n Ayan's twitter bot`;
  const tweetMessageHighContri = `Demon mode, ${contributions} contributions in last 24 hrs 🗿 \n\n\n Ayan's twitter bot`

  if (contributions <= 3) {
    tweetMesg = tweetMessageLowContri
  } else if (contributions <= 10) {
    tweetMesg = tweetMessageMediumContri
  } else tweetMesg = tweetMessageHighContri

  return tweetMesg;
}