import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { AxiosAuthErrorResponse } from "@/models/interfaces/axios";
import {
  AuthSignInRequest,
  AuthSignInResponse,
} from "@/models/interfaces/services/auth";

import { AuthCustomError } from "@/models/class/next-auth";
import { SignInService } from "@/services/entities/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        const { email, password } = credentials as AuthSignInRequest;

        try {
          const response = await SignInService({
            email,
            password,
          });

          const user = response.data as unknown as AuthSignInResponse;

          return {
            id: user.data.id,
            accessToken: user.access_token,
            surname: user.data.surname,
            name: user.data.name,
            email: user.data.email,
            createdAt: user.data.createdAt,
            updatedAt: user.data.updatedAt,
          };
        } catch (error) {
          const axiosError = error as AxiosAuthErrorResponse;
          const data = axiosError.response?.data;

          if (data) {
            throw new AuthCustomError(data.message);
          } else {
            throw new AuthCustomError("An unknown error occurred");
          }
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || "",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.surname = user.surname;
        token.name = user.name;
        token.email = user.email;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        accessToken: token.accessToken as string,
        surname: token.surname as string,
        name: token.name as string,
        email: token.email as string,
        createdAt: token.createdAt as string,
        updatedAt: token.updatedAt as string,
      };
      return session;
    },
  },
});
