import api from './api';

export interface Comment {
  id: number;
  content: string;
  authorName: string;
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  authorName: string;
  publicationStatus: string;
  createdAt: string;
  comments: Comment[];
}

export const getAllPosts = async (): Promise<Post[]> => {
  const response = await api.get('/community/posts');
  return response.data;
};

export const createPost = async (data: Partial<Post>): Promise<Post> => {
  const response = await api.post('/community/posts', data);
  return response.data;
};

export const addComment = async (postId: number, data: Partial<Comment>): Promise<Comment> => {
  const response = await api.post(`/community/posts/${postId}/comments`, data);
  return response.data;
};
