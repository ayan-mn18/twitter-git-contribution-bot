import { TwitterApi } from 'twitter-api-v2';
import { XConfig } from '../config/config';
import { db } from '../db/config';
import { tweet, users } from '../db/schema';
import { uuid } from 'uuidv4';
import { generateAiResponse } from './openai';
import { eq } from 'drizzle-orm';
import { desc } from 'drizzle-orm';

const client = new TwitterApi(XConfig);


export const postTweet = async (message: string, userId: string) => {
  try {
    const response = await client.v2.tweet(message);

    // adding tweets in db
    db.insert(tweet).values({
      id: uuid(),
      content: message,
      postedAt: new Date(),
      userId: userId
    })
  
    console.log('Tweet posted:', response);
  } catch (error) {
    console.error('Error posting tweet:', error);
  }
};

export const generateTweetMesg = async (contributions: number, userId: string) => {

  const tweets = getTweetsOfUserInDb(userId);

  const system = `You are Ayan's Twitter bot. Your job is to tweet about daily contributions in a creative, motivational tone. 
You have three levels of performance: low which is <=3 , medium <= 8, and high > 8.

Past performance: ${tweets}
Today's contributions: ${contributions}

Tweet templates:
  low: [
    "I am being lazy, only managed ${contributions} contributions in the last 24 hours. \n\n\n Ayan's Twitter bot",
    "Not my best day, just ${contributions} contributions today. Let's do better tomorrow! \n\n\n Ayan's Twitter bot",
    "Slacking off today, only ${contributions} contributions. 😅 \n\n\n Ayan's Twitter bot",
  ],
  medium: [
    "Working my way up, completed ${contributions} contributions in the last 24 hours! \n\n\n Ayan's Twitter bot",
    "${contributions} contributions today. Not bad, but there's room for improvement! 🚀 \n\n\n Ayan's Twitter bot",
    "Getting into the groove, ${contributions} contributions done today. Let's keep it up! \n\n\n Ayan's Twitter bot",
  ],
  high: [
    "Demon mode activated: ${contributions} contributions in the last 24 hours! 🗿🔥 \n\n\n Ayan's Twitter bot",
    "Absolutely crushing it with ${contributions} contributions today. Feeling unstoppable! 💪 \n\n\n Ayan's Twitter bot",
    "Peak performance unlocked: ${contributions} contributions today. Who's next? 👀 \n\n\n Ayan's Twitter bot",
  ],
`

const prompt = "Compose a tweet that reflects today's performance and motivates improvement if necessary. Try to use different emojis & trending hastags & trending words. Also add in every tweet add different famous lines of drake song which is very obvious & funny at the same time. Also use GenZ & GenAlpha lingo. And add hooks add the end of the tweet which can add more interactions. Important: Keep the tweet within 270 characters"

  const aiResponse = await generateAiResponse({system, prompt});

  return aiResponse.choices[0].message.content;
}

export const getTweetsOfUserInDb = async (userId: string) => {
  return await db.query.tweet.findMany({
    where: eq(users.userId, userId),
    limit: 10,
    orderBy: [desc(tweet.postedAt)]
  });
}