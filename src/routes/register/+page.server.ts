import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { hashPassword } from '$lib/server/auth';
import { registerSchema, formatValidationError } from '$lib/server/validation';
import { eq } from 'drizzle-orm';

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
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                password: formData.get('password') as string,
            };

            // Validate input
            const validation = registerSchema.safeParse(data);
            if (!validation.success) {
                return fail(400, {
                    errors: formatValidationError(validation.error),
                });
            }

            const validatedData = validation.data;

            // Check if user already exists
            const [existingUser] = await db
                .select()
                .from(users)
                .where(eq(users.email, validatedData.email))
                .limit(1);

            if (existingUser) {
                return fail(400, {
                    error: 'An account with this email already exists',
                });
            }

            // Hash password and create user
            const passwordHash = await hashPassword(validatedData.password);

            await db.insert(users).values({
                name: validatedData.name,
                email: validatedData.email,
                passwordHash,
                role: 'user',
            });

            // Redirect to login
            throw redirect(303, '/login?registered=true');
        } catch (error: any) {
            // If it's a redirect, rethrow it
            if (error.status === 303) {
                throw error;
            }

            console.error('Registration error:', error);
            return fail(500, {
                error: 'An error occurred during registration. Please try again.',
            });
        }
    },
};
