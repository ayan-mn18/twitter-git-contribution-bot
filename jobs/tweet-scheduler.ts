// queue, worker, job, scheduler

import { Queue } from "bullmq";
import { Worker, Job} from 'bullmq';
import { BullMQConfig, githubConfig, redisConfig } from "../config/config";
import { generateTweetMesg, getRecentContributions, postTweet } from "../services";
import { clearQueue, stopUserJobs } from "../config/SetupBullBoard";

const options = {connection: { host: redisConfig.host, port: redisConfig.port}}

export const queue = new Queue('TwitterBotQueue', options);

const worker = new Worker('TwitterBotQueue', async (job: Job) => {

  const { userId } = job.data;
  // define your JOb Here
  console.log('fetching contributions.....')
  const contributions = await getRecentContributions(githubConfig.username!);

  console.log('posting tweet.....')
  const tweetContent = await generateTweetMesg(contributions, userId)

  await postTweet(tweetContent!, userId)

  console.log('Success')
}, options);

// Function to add a new recurring job
export const activateJob = async (jobFrequencyCronPattern: string, timezone: string, email: string, userId: string) => {
  // First, remove the old repeatable job
  await stopUserJobs(queue, userId)

  // Then, add a new repeatable job with the same name
  await queue.add(
    `${email} Twitter Job`, // Name of the job
    { userId: userId }, // Job data
    {
      repeat: 
      { pattern: jobFrequencyCronPattern, tz: timezone },
      // { every: 2000 },
      removeOnComplete: true, // Automatically remove completed jobs
    }
  );

  console.log('Job added in twitter-bot queue!');
};

export const testActivationJobs = async () => {

  // Then, add a new repeatable job with the same name
  await queue.add(
    `Test Twitter Job`, // Name of the job
    { userId: 'userId' }, // Job data
    {
      repeat: 
      { pattern: '15 4 * * *', tz: 'Asia/Kolkata' },
      // { every: 2000 },
      removeOnComplete: true, // Automatically remove completed jobs
    }
  );

  console.log('Job added in twitter-bot queue!');
};