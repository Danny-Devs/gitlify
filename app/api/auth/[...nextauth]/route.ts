import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GitHub from 'next-auth/providers/github';
import prisma from '@/app/lib/prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          // We get read-only access to public repositories by default
          // If we need more access, we can add more scopes here
          scope: 'read:user user:email'
        }
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      // Add user ID to the session so we can use it in our app
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
    // signOut: '/auth/signout',
    // verifyRequest: '/auth/verify-request',
    // newUser: '/auth/new-user'
  },
  session: {
    strategy: 'database'
  },
  debug: process.env.NODE_ENV === 'development' // Enable debug in development
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
