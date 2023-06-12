"use client"
import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
  const { data : session } = useSession();
  if (!session){
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button className="bg-white p-2 px-4 rounded-lg" onClick={() => signIn('google')}>Login with Google</button> 
          <button className="bg-white p-2 px-4 rounded-lg" onClick={() => console.log(process.env.GOOGLE_ID)}>Test</button> 
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>logged in as {session.user?.email}</div>
      <button className="bg-white p-2 px-4 rounded-lg" onClick={() => signOut()}>Sign Out</button> 
    </div>
  )
}
