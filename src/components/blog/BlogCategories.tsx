import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { BlogCategory } from '@/hooks/useBlog';

interface BlogCategoriesProps {
  categories: BlogCategory[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  postCounts?: Record<string, number>;
}

const BlogCategories: React.FC<BlogCategoriesProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  postCounts = {}
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-6 border-b bg-background/95 backdrop-blur-sm sticky top-16 z-40"
    >
      <div className="container mx-auto px-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex items-center gap-3 pb-2">
            {/* All Categories Button */}
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange('')}
              className="rounded-full transition-all duration-300"
            >
              All Posts
              <span className="ml-2 text-xs opacity-70">
                ({Object.values(postCounts).reduce((a, b) => a + b, 0) || '...'})
              </span>
            </Button>

            {/* Category Buttons */}
            {categories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onCategoryChange(category.id)}
                  className="rounded-full transition-all duration-300"
                >
                  {category.name}
                  {postCounts[category.id] !== undefined && (
                    <span className="ml-2 text-xs opacity-70">
                      ({postCounts[category.id]})
                    </span>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>
    </motion.section>
  );
};

export default BlogCategories;
