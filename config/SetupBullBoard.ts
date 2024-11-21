import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { queue } from '../jobs/tweet-scheduler';
import { Job, Queue } from 'bullmq';


export function setupBullBoard() {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    createBullBoard({
        queues: [
            new BullMQAdapter(queue)
            // new BullMQAdapter(testQueue),
            // new BullMQAdapter(pipelineQueue),
            // new BullMQAdapter(aiNodeQueue),
        ],
        serverAdapter,
    });

    return serverAdapter;
}

export const clearQueue = async (queue: Queue) => {
    try {
      await queue.obliterate({ force: true }); // Use force: true to bypass job count check
      console.log('Queue cleared successfully.');
    } catch (error) {
      console.error('Error clearing queue:', error);
    }
  };

  export const stopUserJobs = async (queue: Queue, userId: string) => {
    try {
      // Fetch all jobs in the queue (you can customize this based on job status)
      const jobs = await queue.getJobs(); // You may specify 'waiting', 'active', etc. depending on the job status
      
      // Filter jobs by the userId field
      const userJobs = jobs.filter((job: Job) => job.data.userId === userId);
      
      if (userJobs.length === 0) {
        console.log(`No jobs found for userId: ${userId}`);
        return;
      }
  
      // Remove jobs matching the userId
      await Promise.all(userJobs.map( (job: Job) => {
        const id = job.id?.split(":")[1]
        queue.removeJobScheduler(id!)
      }));
  
      console.log(`Stopped ${userJobs.length} jobs for userId: ${userId}`);
    } catch (error) {
      console.error('Error stopping user jobs:', error);
    }
  };