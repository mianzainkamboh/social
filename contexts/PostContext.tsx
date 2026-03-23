import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userProfilePicture?: string;
  content: string;
  image?: string;
  timestamp: number;
  likes: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
}

interface PostContextType {
  posts: Post[];
  createPost: (content: string, image?: string) => Promise<void>;
  likePost: (postId: string, userId: string) => Promise<void>;
  addComment: (postId: string, userId: string, userName: string, content: string) => Promise<void>;
  refreshPosts: () => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const postsData = await AsyncStorage.getItem('posts');
      if (postsData) {
        setPosts(JSON.parse(postsData));
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const savePosts = async (newPosts: Post[]) => {
    try {
      await AsyncStorage.setItem('posts', JSON.stringify(newPosts));
      setPosts(newPosts);
    } catch (error) {
      console.error('Error saving posts:', error);
    }
  };

  const createPost = async (content: string, image?: string) => {
    const userData = await AsyncStorage.getItem('user');
    if (!userData) return;
    
    const user = JSON.parse(userData);
    const newPost: Post = {
      id: uuid.v4() as string,
      userId: user.id,
      userName: user.name,
      userProfilePicture: user.profilePicture,
      content,
      image,
      timestamp: Date.now(),
      likes: [],
      comments: [],
    };

    const updatedPosts = [newPost, ...posts];
    await savePosts(updatedPosts);
  };

  const likePost = async (postId: string, userId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const likes = post.likes.includes(userId)
          ? post.likes.filter(id => id !== userId)
          : [...post.likes, userId];
        return { ...post, likes };
      }
      return post;
    });
    await savePosts(updatedPosts);
  };

  const addComment = async (postId: string, userId: string, userName: string, content: string) => {
    const newComment: Comment = {
      id: uuid.v4() as string,
      userId,
      userName,
      content,
      timestamp: Date.now(),
    };

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    });
    await savePosts(updatedPosts);
  };

  const refreshPosts = async () => {
    await loadPosts();
  };

  return (
    <PostContext.Provider value={{ posts, createPost, likePost, addComment, refreshPosts }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error('usePosts must be used within PostProvider');
  return context;
};
