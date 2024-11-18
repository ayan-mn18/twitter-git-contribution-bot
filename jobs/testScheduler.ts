// queue, worker, job, scheduler

import { Queue } from "bullmq";
import { Worker, Job} from 'bullmq';
import { redisConfig } from "../config/RedisConfig";

const options = {connection: { host: redisConfig.host, port: redisConfig.port}}

export const queue = new Queue('TestQueue', options);

const worker = new Worker('TestQueue', async (job: Job) => {
  // define your JOb Here
  console.log('job.data')
  // fetchContribution()
  // postTweet()
}, options);

// Function to add a new recurring job and replace the old one
const replaceJob = async () => {
  // First, remove the old repeatable job
  await queue.removeRepeatable('fetchAndTweetJob', { pattern: '*/5 * * * *' });

  // Then, add a new repeatable job with the same name
  await queue.add(
    'fetchAndTweetJob', // Name of the job
    { message: 'Run the worker task' }, // Job data
    {
      repeat: { pattern: '*/5 * * * *' }, // Run every 5000ms (5 seconds)
      removeOnComplete: true, // Automatically remove completed jobs
    }
  );

  console.log('fetchAndTweetJob has been replaced!');
};

// Add the recurring job when starting
replaceJob()
  .then(() => console.log('New recurring job added to the queue!'))
  .catch((err) => console.error('Error replacing job:', err));