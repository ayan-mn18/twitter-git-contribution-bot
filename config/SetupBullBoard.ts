import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { queue } from '../jobs/tweet-scheduler';


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