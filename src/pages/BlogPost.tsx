import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { Calendar, User, Clock, ArrowLeft, Headphones, Play, Pause, Facebook, Linkedin, Twitter, Mail, MessageCircle, Copy, Check } from 'lucide-react';
import { useBlogPost } from '@/hooks/useBlog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug!);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Social sharing functions
  const getShareUrl = () => window.location.href;
  const getShareText = () => post?.title || 'Check out this article';
  const getShareExcerpt = () => post?.excerpt || '';

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}&quote=${encodeURIComponent(getShareText())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(getShareText())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const text = `${getShareText()}\n\n${getShareExcerpt()}\n\n${getShareUrl()}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareByEmail = () => {
    const subject = encodeURIComponent(getShareText());
    const body = encodeURIComponent(`${getShareExcerpt()}\n\nRead more: ${getShareUrl()}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const sharePost = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 md:pt-28">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="aspect-video bg-muted rounded" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background pt-24 md:pt-28 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - Recharge Travels Blog</title>
        <meta name="description" content={post.excerpt || `${post.title} - Travel guide and tips for Sri Lanka`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ''} />
        {(post.featured_image || post.featuredImage) && <meta property="og:image" content={post.featured_image || post.featuredImage} />}
        <meta
          property="article:author"
          content={typeof post.author === 'string' ? post.author : post.author?.name || 'Recharge Travels'}
        />
        <meta property="article:published_time" content={post.published_at || post.created_at} />
        {post.category && (
          <meta property="article:section" content={post.category.name} />
        )}
      </Helmet>

      <div className="min-h-screen bg-background pt-24 md:pt-28">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">

            {/* Navigation */}
            <div className="mb-8">
              <Link to="/blog">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </div>

            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                {post.category && (
                  <Badge variant="outline">{post.category.name}</Badge>
                )}
                <Calendar className="h-4 w-4" />
                {formatDate(post.published_at || post.created_at)}
                {post.reading_time && (
                  <>
                    <Clock className="h-4 w-4 ml-2" />
                    {post.reading_time} min read
                  </>
                )}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>
              
              {post.excerpt && (
                <p className="text-xl text-muted-foreground mb-6">
                  {post.excerpt}
                </p>
              )}
              
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>
                    By {typeof post.author === 'string' ? post.author : post.author?.name || 'Recharge Travels'}
                  </span>
                </div>

                {/* Social Share Icons */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground mr-1">Share:</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={shareToFacebook}
                    className="h-9 w-9 rounded-full hover:bg-blue-100"
                    title="Share on Facebook"
                  >
                    <Facebook className="h-5 w-5 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={shareToLinkedIn}
                    className="h-9 w-9 rounded-full hover:bg-blue-100"
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="h-5 w-5 text-blue-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={shareToTwitter}
                    className="h-9 w-9 rounded-full hover:bg-sky-100"
                    title="Share on Twitter"
                  >
                    <Twitter className="h-5 w-5 text-sky-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={shareToWhatsApp}
                    className="h-9 w-9 rounded-full hover:bg-green-100"
                    title="Share on WhatsApp"
                  >
                    <MessageCircle className="h-5 w-5 text-green-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={shareByEmail}
                    className="h-9 w-9 rounded-full hover:bg-gray-100"
                    title="Share via Email"
                  >
                    <Mail className="h-5 w-5 text-gray-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyToClipboard}
                    className="h-9 w-9 rounded-full hover:bg-gray-100"
                    title="Copy Link"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
            </header>

            {/* Podcast Player */}
            {post.podcast_episode?.audio_url && (
              <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleAudio}
                      className="h-12 w-12 rounded-full"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Headphones className="h-4 w-4 text-primary" />
                        <span className="font-medium">Listen to this article</span>
                      </div>
                      {post.podcast_episode.duration_seconds && (
                        <span className="text-sm text-muted-foreground">
                          Duration: {formatDuration(post.podcast_episode.duration_seconds)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <audio
                    ref={audioRef}
                    src={post.podcast_episode.audio_url}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    className="w-full mt-4"
                    controls
                  />
                </CardContent>
              </Card>
            )}

            {/* Featured Image */}
            {(post.featured_image || post.featuredImage) && (
              <div className="mb-8">
                <img
                  src={post.featured_image || post.featuredImage}
                  alt={post.title}
                  className="w-full aspect-video object-cover rounded-lg"
                />
              </div>
            )}

            {/* Article Content */}
            <article className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-semibold mt-6 mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-medium mt-4 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary/30 pl-4 italic my-6 text-muted-foreground">
                      {children}
                    </blockquote>
                  ),
                  img: ({ src, alt }) => (
                    <img src={src} alt={alt} className="w-full rounded-lg my-6" />
                  ),
                }}
              >
                {post.body_md || post.content || ''}
              </ReactMarkdown>
            </article>

            {/* Social Share Bar */}
            <div className="my-8 p-6 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium text-center mb-4">Share this article</p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={shareToFacebook}
                  className="h-12 w-12 rounded-full hover:bg-blue-100 hover:border-blue-300"
                  title="Facebook"
                >
                  <Facebook className="h-6 w-6 text-blue-600" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={shareToLinkedIn}
                  className="h-12 w-12 rounded-full hover:bg-blue-100 hover:border-blue-300"
                  title="LinkedIn"
                >
                  <Linkedin className="h-6 w-6 text-blue-700" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={shareToTwitter}
                  className="h-12 w-12 rounded-full hover:bg-sky-100 hover:border-sky-300"
                  title="Twitter"
                >
                  <Twitter className="h-6 w-6 text-sky-500" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={shareToWhatsApp}
                  className="h-12 w-12 rounded-full hover:bg-green-100 hover:border-green-300"
                  title="WhatsApp"
                >
                  <MessageCircle className="h-6 w-6 text-green-500" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={shareByEmail}
                  className="h-12 w-12 rounded-full hover:bg-gray-100"
                  title="Email"
                >
                  <Mail className="h-6 w-6 text-gray-600" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  className="h-12 w-12 rounded-full hover:bg-gray-100"
                  title="Copy Link"
                >
                  {copied ? (
                    <Check className="h-6 w-6 text-green-500" />
                  ) : (
                    <Copy className="h-6 w-6 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Published {formatDate(post.published_at || post.created_at)}
                  </span>
                  {post.category && (
                    <Badge variant="outline">{post.category.name}</Badge>
                  )}
                </div>

                <Link to="/blog">
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    More Articles
                  </Button>
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}