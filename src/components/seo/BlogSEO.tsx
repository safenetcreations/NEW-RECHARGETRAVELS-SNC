import React from 'react';
import { Helmet } from 'react-helmet-async';
import type { BlogPost } from '@/hooks/useBlog';
import { buildBrand, getBaseUrl } from '@/utils/seoSchemaHelpers';

interface BlogSEOProps {
  post?: BlogPost | null;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

const BlogSEO: React.FC<BlogSEOProps> = ({
  post,
  title = 'Sri Lanka Travel Blog - Recharge Travels',
  description = 'Discover Sri Lanka through our travel blog featuring destinations, wildlife, culture, food, and adventure guides.',
  image = '/images/blog-og.jpg',
  url = 'https://www.rechargetravels.com/blog',
  type = 'website'
}) => {
  const baseUrl = getBaseUrl();
  const brand = buildBrand(baseUrl);
  const getAuthorName = (author: BlogPost['author'] | undefined) => {
    if (!author) return 'Recharge Travels';
    if (typeof author === 'string') return author;
    return author.name || 'Recharge Travels';
  };
  // Use post data if available
  const seoTitle = post?.title
    ? `${post.title} | Recharge Travels Blog`
    : title;

  const seoDescription = post?.excerpt || description;
  const seoImage = post?.featured_image || image;
  const seoUrl = post?.slug
    ? `${baseUrl}/blog/${post.slug}`
    : url;

  // Article schema for blog posts
  const articleSchema = post ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || '',
    image: post.featured_image || '',
    author: {
      '@type': 'Person',
      name: getAuthorName(post.author)
    },
    publisher: brand,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.created_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': seoUrl
    }
  } : null;

  // Blog listing schema
  const blogListingSchema = !post ? {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Recharge Travels Blog',
    description: description,
    url: url,
    publisher: brand
  } : null;

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${baseUrl}/blog`
      },
      ...(post ? [{
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: seoUrl
      }] : [])
    ]
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />

      {/* Keywords */}
      {post?.category?.seo_keywords && (
        <meta name="keywords" content={post.category.seo_keywords.join(', ')} />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={post ? 'article' : type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content="Recharge Travels" />

      {/* Article specific OG tags */}
      {post && (
        <>
          <meta property="article:published_time" content={post.published_at || post.created_at} />
          <meta property="article:modified_time" content={post.updated_at || post.created_at} />
          <meta property="article:author" content={getAuthorName(post.author)} />
          {post.category && (
            <meta property="article:section" content={post.category.name} />
          )}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Structured Data */}
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}

      {blogListingSchema && (
        <script type="application/ld+json">
          {JSON.stringify(blogListingSchema)}
        </script>
      )}

      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

export default BlogSEO;
