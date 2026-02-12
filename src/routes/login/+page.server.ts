import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { signIn } from '$lib/server/auth';
import { loginSchema, formatValidationError } from '$lib/server/validation';

export const load: PageServerLoad = async ({ locals }) => {
    // Redirect if already logged in
    if (locals.session?.user) {
        throw redirect(303, '/');
    }
    return {};
};

export const actions: Actions = {
    default: async ({ request }) => {
        try {
            const formData = await request.formData();
            const data = {
                email: formData.get('email') as string,
                password: formData.get('password') as string,
            };

            // Validate input
            const validation = loginSchema.safeParse(data);
            if (!validation.success) {
                return fail(400, {
                    errors: formatValidationError(validation.error),
                });
            }

            const validatedData = validation.data;

            // Attempt to sign in (Auth.js will handle redirect)
            try {
                await signIn('credentials', {
                    email: validatedData.email,
                    password: validatedData.password,
                });
            } catch (error: any) {
                // Auth.js throws on invalid credentials
                return fail(401, {
                    error: 'Invalid email or password',
                });
            }

            // This won't be reached if signIn succeeds (it redirects)
            throw redirect(303, '/');
        } catch (error: any) {
            // If it's a redirect, rethrow it
            if (error.status === 303) {
                throw error;
            }

            console.error('Login error:', error);
            return fail(500, {
                error: 'An error occurred during login. Please try again.',
            });
        }
    },
};
