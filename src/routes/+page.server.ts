import type { PageServerLoad, Actions } from './$types';
import * as inventory from '$lib/server/inventory';
import { fail, redirect } from '@sveltejs/kit';
import { requireAuth, getUserId } from '$lib/server/auth';
import { assetSchema, sanitizeText, formatValidationError } from '$lib/server/validation';

export const load: PageServerLoad = async ({ locals }) => {
    // Require authentication
    try {
        requireAuth(locals);
    } catch {
        throw redirect(303, '/login');
    }

    const userId = getUserId(locals);
    const [assets, stats] = await Promise.all([
        inventory.getRecentInventory(userId, 10),
        inventory.getDashboardStats(userId)
    ]);

    return {
        assets,
        stats,
        user: locals.session?.user
    };
};

export const actions: Actions = {
    addAsset: async ({ request, locals }) => {
        try {
            // Require authentication
            requireAuth(locals);
            const userId = getUserId(locals);

            const data = await request.formData();
            const rawData = {
                lotNumber: sanitizeText(data.get('lotNumber') as string || ''),
                description: sanitizeText(data.get('description') as string || ''),
                location: sanitizeText(data.get('location') as string || ''),
                quantity: parseInt(data.get('quantity') as string || '1'),
            };

            // Validate input
            const validation = assetSchema.safeParse(rawData);
            if (!validation.success) {
                return fail(400, {
                    errors: formatValidationError(validation.error),
                    message: 'Invalid input data'
                });
            }

            const validatedData = validation.data;

            await inventory.addAsset({
                ...validatedData,
                userId
            });

            return { success: true };
        } catch (error: any) {
            if (error.message === 'Unauthorized') {
                throw redirect(303, '/login');
            }

            console.error('Error adding asset:', error);
            return fail(500, { message: 'Failed to add asset' });
        }
    },

    deleteAsset: async ({ request, locals }) => {
        try {
            // Require authentication
            requireAuth(locals);
            const userId = getUserId(locals);

            const formData = await request.formData();
            const id = formData.get('id') as string;

            if (!id) return fail(400, { message: 'ID is required' });

            // Delete only if asset belongs to user
            await inventory.deleteAsset(id, userId);
            return { success: true };
        } catch (error: any) {
            if (error.message === 'Unauthorized') {
                throw redirect(303, '/login');
            }

            console.error('Error deleting asset:', error);
            return fail(500, { message: 'Failed to delete asset' });
        }
    }
};
