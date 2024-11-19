// queue, worker, job, scheduler

import { Queue } from "bullmq";
import { Worker, Job} from 'bullmq';
import { BullMQConfig, githubConfig, redisConfig } from "../config/config";
import { generateTweetMesg, getRecentContributions, postTweet } from "../services";
import { clearQueue } from "../config/SetupBullBoard";

const options = {connection: { host: redisConfig.host, port: redisConfig.port}}

export const queue = new Queue('TestQueue', options);

const worker = new Worker('TestQueue', async (job: Job) => {
  // define your JOb Here
  console.log('fetching contributions.....')
  const contributions = await getRecentContributions(githubConfig.username!);

  console.log('posting tweet.....')
  console.log(generateTweetMesg(contributions))

  postTweet(generateTweetMesg(contributions))

  console.log('Success')
}, options);

// Function to add a new recurring job and replace the old one
export const replaceJob = async () => {
  // First, remove the old repeatable job
  clearQueue(queue);

  // Then, add a new repeatable job with the same name
  await queue.add(
    'fetchAndTweetJob', // Name of the job
    { }, // Job data
    {
      repeat: 
      { pattern: BullMQConfig.cronPattern, tz: BullMQConfig.timezone },
      // { every: 2000 },
      removeOnComplete: true, // Automatically remove completed jobs
    }
  );

  console.log('fetchAndTweetJob has been replaced!');
};