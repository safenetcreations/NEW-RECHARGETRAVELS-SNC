import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/services/firebaseService';

interface Post {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
}

const PostsSection: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'blog_posts'),
          orderBy('date', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as Post[];
        setPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
        <Link to="/admin/posts/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create New Post
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Title</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Author</th>
                <th className="text-left p-4">Date</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center p-8">Loading...</td>
                </tr>
              ) : (
                posts.map(post => (
                  <tr key={post.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{post.title}</td>
                    <td className="p-4">{post.category}</td>
                    <td className="p-4">{post.author}</td>
                    <td className="p-4">{post.date}</td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostsSection;
