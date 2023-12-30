import clientPromise from '@/lib/mongodb';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import NextAuth, {getServerSession} from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next';
import GoogleProvider from 'next-auth/providers/google'

const adminEmails = ['dq2209@gmail.comm', 'andy.nguyen9661@gmail.com']

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session, token, user }: any) {
      console.log(session.user.email);
      if (session?.user?.email){
        if (adminEmails.includes(session.user.email)) {
          console.log("approved");
          return session;
        } else {
          console.log("not approved - not found the correct email");
          return false;
        } 
      } else {
        console.log("not approved - no session");
        return false;
      }     
    }
  }
}

// return session
export default NextAuth(authOptions)

// check if admin
export async function isAdminRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req,res,authOptions);
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw 'not an admin';
  }
}

