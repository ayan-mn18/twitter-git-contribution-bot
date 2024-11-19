import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { queue } from '../jobs/tweet-scheduler';
import { Queue } from 'bullmq';


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