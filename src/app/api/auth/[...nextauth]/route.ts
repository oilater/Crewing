import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import kakaoProvider from "next-auth/providers/kakao";
import saveUser from "../../../../lib/firestore/user";

const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt", // middleware에서 토큰을 가져오기 위함
    },
    providers: [
        kakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID as string,
            clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user }) {
            if (!user) return false;

            await saveUser({
                email: user.email,
                name: user.name ?? '',
                imageUrl: user.image ?? '',
            });

            return true;
        },
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };