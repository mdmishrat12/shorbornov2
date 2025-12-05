'use server';

import { db } from "../../../db";
import { posts } from "../../../schema/user.schema";
import { desc, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "./../auth/auth";
import { v4 as uuidv4 } from 'uuid';

export async function createPost(title: string, content: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  try {
    await db.insert(posts).values({
      id: uuidv4(),
      title,
      content,
      userId: session.user.id,
    });

    return { success: true };
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }
}

export async function getUserPosts() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    const userPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        createdAt: posts.createdAt,
      })
      .from(posts)
      .where(eq(posts.userId, session.user.id))
      .orderBy(desc(posts.createdAt));

    return userPosts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
}