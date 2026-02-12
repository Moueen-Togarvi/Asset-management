import { SvelteKitAuth } from '@auth/sveltekit';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import Credentials from '@auth/sveltekit/providers/credentials';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { env } from '$env/dynamic/private';

export const { handle, signIn, signOut } = SvelteKitAuth({
    adapter: DrizzleAdapter(db),
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const [user] = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, credentials.email as string))
                    .limit(1);

                if (!user || !user.passwordHash) {
                    return null;
                }

                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.passwordHash
                );

                if (!isValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
    secret: env.AUTH_SECRET,
    trustHost: true,
});

// Helper to hash passwords
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

// Helper to verify user is authenticated
export function requireAuth(locals: App.Locals) {
    const session = locals.session;
    if (!session?.user) {
        throw new Error('Unauthorized');
    }
    return session;
}

// Helper to check user role
export function requireRole(locals: App.Locals, allowedRoles: string[]) {
    const session = requireAuth(locals);
    const userRole = (session.user as any).role;

    if (!allowedRoles.includes(userRole)) {
        throw new Error('Forbidden');
    }

    return session;
}

// Get current user ID
export function getUserId(locals: App.Locals): string {
    const session = requireAuth(locals);
    return (session.user as any).id;
}
