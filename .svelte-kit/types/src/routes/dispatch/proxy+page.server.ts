// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import * as inventory from '$lib/server/inventory';
import { syncToNetSuite } from '$lib/server/netsuite';
import { db } from '$lib/server/db';
import { salesOrders, allocations } from '$lib/server/db/schema';

export const load = async () => {
    const [availableAssets, activeAllocations] = await Promise.all([
        inventory.getAvailableLots(),
        inventory.getActiveAllocations()
    ]);

    return {
        assets: availableAssets,
        allocations: activeAllocations
    };
};

export const actions = {
    autoAllocate: async ({ request }: { request: Request }) => {
        const data = await request.formData();
        const qty = parseInt(data.get('qty') as string || '1');

        const availableLots = await inventory.getFIFOAvailable();

        if (availableLots.length < qty) {
            return { error: 'Insufficient stock' };
        }

        const [order] = await db.insert(salesOrders).values({
            orderNumber: `SO-${Date.now()}`,
            hospitalName: 'General Hospital'
        }).returning();

        for (let i = 0; i < qty; i++) {
            await inventory.createAllocation(order.id, availableLots[i].id, 1);
        }

        return { success: true };
    },

    pickAndSync: async ({ request }: { request: Request }) => {
        const data = await request.formData();
        const allocationId = data.get('allocationId') as string;

        const allocation = await inventory.updateAllocationStep(allocationId, 'Picked');
        await syncToNetSuite(allocation);

        return { success: true };
    },

    updateStep: async ({ request }: { request: Request }) => {
        const data = await request.formData();
        const allocationId = data.get('allocationId') as string;
        const step = data.get('step') as any;

        await inventory.updateAllocationStep(allocationId, step);

        return { success: true };
    },

    returnAsset: async ({ request }: { request: Request }) => {
        const data = await request.formData();
        const allocationId = data.get('allocationId') as string;

        await inventory.returnAsset(allocationId);

        return { success: true };
    }
};
;null as any as PageServerLoad;;null as any as Actions;