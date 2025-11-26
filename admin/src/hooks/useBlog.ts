export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  author?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useBlog = () => {
  const posts: BlogPost[] = [];
  const createPost = async (post: BlogPost) => ({ success: true });
  const updatePost = async (id: string, post: Partial<BlogPost>) => ({ success: true });
  const deletePost = async (id: string) => ({ success: true });

  return { posts, createPost, updatePost, deletePost };
};