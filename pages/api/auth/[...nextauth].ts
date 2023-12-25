import clientPromise from '@/lib/mongodb';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const adminEmails = ['dq2209@gmail.com']

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session, token, user }: any) {
      console.log({ session, token, user });
      if (session?.user?.email){
        if (adminEmails.includes(session.user.email)) {
          console.log("approved");
          return session;
        } else {
          console.log("not approved - not found the correct email")
          return null;
        } 
      } else {
        console.log("not approved - no session")
        return null;
      }     
    }
  }
})

