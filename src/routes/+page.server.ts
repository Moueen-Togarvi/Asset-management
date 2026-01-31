import type { PageServerLoad, Actions } from './$types';
import * as inventory from '$lib/server/inventory';

export const load: PageServerLoad = async () => {
    const [assets, stats] = await Promise.all([
        inventory.getRecentInventory(10),
        inventory.getDashboardStats()
    ]);

    return {
        assets,
        stats
    };
};

import { fail } from '@sveltejs/kit';

export const actions: Actions = {
    addAsset: async ({ request }: { request: Request }) => {
        try {
            const data = await request.formData();
            const lotNumber = data.get('lotNumber') as string;
            const description = data.get('description') as string;
            const location = data.get('location') as string;
            const quantity = parseInt(data.get('quantity') as string || '1');

            if (!lotNumber || !description) {
                return fail(400, { message: 'Missing required fields' });
            }

            await inventory.addAsset({ lotNumber, description, quantity, location });
            return { success: true };
        } catch (error: any) {
            console.error('Error adding asset:', error);
            return fail(500, { message: error.message || 'Failed to add asset' });
        }
    },

    deleteAsset: async ({ request }: { request: Request }) => {
        try {
            const formData = await request.formData();
            const id = formData.get('id') as string;

            if (!id) return fail(400, { message: 'ID is required' });

            await inventory.deleteAsset(id);
            return { success: true };
        } catch (error: any) {
            console.error('Error deleting asset:', error);
            return fail(500, { message: 'Failed to delete asset' });
        }
    }
};
