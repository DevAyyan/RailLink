import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        //Replace with query
        const user = {
          id: "1",
          email: "test@email.com",
          password: "$2a$12$3G9UKO7a0V6VJz3B2b3OYOe3XHjfGZhiVZ8l9X/o0zPy0B80yROmi" 
        };

        const passwordMatch = await compare(credentials.password, user.password);
        if (!passwordMatch) return null;

        return { id: user.id, email: user.email };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
