// queue, worker, job, scheduler

import { Queue } from "bullmq";
import { Worker, Job} from 'bullmq';
import { githubConfig, redisConfig } from "../config/config";
import { getRecentContributions, postTweet } from "../services";

const options = {connection: { host: redisConfig.host, port: redisConfig.port}}
const cronPattern = '0 0 * * *'; // Runs every day at midnight

export const queue = new Queue('TestQueue', options);

const worker = new Worker('TestQueue', async (job: Job) => {
  // define your JOb Here
  console.log('fetching contributions.....')
  const contributions = await getRecentContributions(githubConfig.username!);

  console.log('posting tweet.....')
  postTweet(`Working my way up a bit, did ${contributions} contributions in last 24 hrs \n\n\n Ayan's twitter bot`)


  console.log('Success')
}, options);

// Function to add a new recurring job and replace the old one
export const replaceJob = async () => {
  // First, remove the old repeatable job
  await queue.removeRepeatable('fetchAndTweetJob', 
    { pattern: cronPattern },
    // { every: 2000 }
  );

  // Then, add a new repeatable job with the same name
  await queue.add(
    'fetchAndTweetJob', // Name of the job
    { }, // Job data
    {
      repeat: 
      { pattern: cronPattern },
      // { every: 2000 },
      removeOnComplete: true, // Automatically remove completed jobs
    }
  );

  console.log(process.env.GITHUB_USERNAME)

  console.log('fetchAndTweetJob has been replaced!');
};