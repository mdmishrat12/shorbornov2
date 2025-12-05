import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/auth";
import { getUserPosts } from "../api/posts/posts";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  try {
    const posts = await getUserPosts();
    return <DashboardClient session={session} initialPosts={posts} />;
  } catch (error) {
    console.error('Error loading posts:', error);
    return <DashboardClient session={session} initialPosts={[]} />;
  }
}