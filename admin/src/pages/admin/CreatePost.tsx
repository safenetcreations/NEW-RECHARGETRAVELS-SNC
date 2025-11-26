import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleGenerateContent = async () => {
    if (!title) {
      toast({
        title: 'Title is required',
        description: 'Please enter a title to generate content.',
        variant: 'destructive',
      });
      return;
    }
    setIsGenerating(true);
    // Replace with your actual AI content generation logic
    const generatedContent = await new Promise<string>(resolve => {
      setTimeout(() => {
        resolve(`This is some AI generated content about ${title}.`);
      }, 1000);
    });
    setContent(generatedContent);
    setIsGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast({
        title: 'Title and content are required',
        description: 'Please fill out all required fields.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `posts/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, 'posts'), {
        title,
        excerpt,
        content,
        author,
        category,
        imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({
        title: 'Post created successfully',
      });

      // Clear the form
      setTitle('');
      setExcerpt('');
      setContent('');
      setAuthor('');
      setCategory('');
      setImage(null);
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error creating post',
        description: 'An error occurred while creating the post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Create New Blog Post</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="content">Content</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleGenerateContent} disabled={isGenerating}>
                      {isGenerating ? 'Generating...' : <><Sparkles className="w-4 h-4 mr-2" />Generate with AI</>}
                    </Button>
                  </div>
                  <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={10} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="image">Featured Image</Label>
                  <Input id="image" type="file" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Post...' : 'Create Post'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
