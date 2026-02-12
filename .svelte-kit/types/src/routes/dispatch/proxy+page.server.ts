// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import * as inventory from '$lib/server/inventory';
import { syncToNetSuite } from '$lib/server/netsuite';
import { db } from '$lib/server/db';
import { salesOrders, allocations } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { requireAuth, getUserId } from '$lib/server/auth';
import { allocationStepSchema, uuidSchema, formatValidationError } from '$lib/server/validation';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
    // Require authentication
    try {
        requireAuth(locals);
    } catch {
        throw redirect(303, '/login');
    }

    const userId = getUserId(locals);
    const [availableAssets, activeAllocations] = await Promise.all([
        inventory.getAvailableLots(userId),
        inventory.getActiveAllocations(userId)
    ]);

    return {
        assets: availableAssets,
        allocations: activeAllocations,
        user: locals.session?.user
    };
};

export const actions = {
    autoAllocate: async ({ request, locals }: import('./$types').RequestEvent) => {
        try {
            requireAuth(locals);
            const userId = getUserId(locals);

            const data = await request.formData();
            const qty = parseInt(data.get('qty') as string || '1');

            if (isNaN(qty) || qty < 1 || qty > 100) {
                return fail(400, { error: 'Invalid quantity' });
            }

            const availableLots = await inventory.getFIFOAvailable(userId);

            if (availableLots.length < qty) {
                return fail(400, { error: 'Insufficient stock' });
            }

            const [order] = await db.insert(salesOrders).values({
                orderNumber: `SO-${Date.now()}`,
                hospitalName: 'General Hospital',
                userId
            }).returning();

            for (let i = 0; i < qty; i++) {
                await inventory.createAllocation(order.id, availableLots[i].id, 1);
            }

            return { success: true };
        } catch (error: any) {
            if (error.message === 'Unauthorized') {
                throw redirect(303, '/login');
            }
            console.error('Auto-allocate error:', error);
            return fail(500, { error: 'Failed to allocate assets' });
        }
    },

    pickAndSync: async ({ request, locals }: import('./$types').RequestEvent) => {
        try {
            requireAuth(locals);
            const userId = getUserId(locals);

            const data = await request.formData();
            const allocationId = data.get('allocationId') as string;

            // Validate UUID
            const validation = uuidSchema.safeParse(allocationId);
            if (!validation.success) {
                return fail(400, { error: 'Invalid allocation ID' });
            }

            const allocation = await inventory.updateAllocationStep(allocationId, 'Picked', userId);
            await syncToNetSuite(allocation);

            return { success: true };
        } catch (error: any) {
            if (error.message === 'Unauthorized') {
                throw redirect(303, '/login');
            }
            console.error('Pick and sync error:', error);
            return fail(500, { error: 'Failed to update allocation' });
        }
    },

    updateStep: async ({ request, locals }: import('./$types').RequestEvent) => {
        try {
            requireAuth(locals);
            const userId = getUserId(locals);

            const data = await request.formData();
            const rawData = {
                allocationId: data.get('allocationId') as string,
                step: data.get('step') as any,
            };

            // Validate input
            const validation = allocationStepSchema.safeParse(rawData);
            if (!validation.success) {
                return fail(400, {
                    errors: formatValidationError(validation.error),
                    error: 'Invalid input data'
                });
            }

            const validatedData = validation.data;
            await inventory.updateAllocationStep(validatedData.allocationId, validatedData.step, userId);

            return { success: true };
        } catch (error: any) {
            if (error.message === 'Unauthorized') {
                throw redirect(303, '/login');
            }
            console.error('Update step error:', error);
            return fail(500, { error: 'Failed to update step' });
        }
    },

    returnAsset: async ({ request, locals }: import('./$types').RequestEvent) => {
        try {
            requireAuth(locals);
            const userId = getUserId(locals);

            const data = await request.formData();
            const allocationId = data.get('allocationId') as string;

            // Validate UUID
            const validation = uuidSchema.safeParse(allocationId);
            if (!validation.success) {
                return fail(400, { error: 'Invalid allocation ID' });
            }

            await inventory.returnAsset(allocationId, userId);

            return { success: true };
        } catch (error: any) {
            if (error.message === 'Unauthorized') {
                throw redirect(303, '/login');
            }
            console.error('Return asset error:', error);
            return fail(500, { error: 'Failed to return asset' });
        }
    }
};
;null as any as Actions;