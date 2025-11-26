import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface BlogSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const BlogSearch: React.FC<BlogSearchProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = useCallback(() => {
    onSearchChange('');
  }, [onSearchChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
    >
      {/* Search Input */}
      <div className="relative flex-1">
        <motion.div
          animate={{
            boxShadow: isFocused
              ? '0 0 0 2px hsl(var(--primary) / 0.2)'
              : '0 0 0 0px transparent'
          }}
          className="relative rounded-lg"
        >
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${
            isFocused ? 'text-primary' : 'text-muted-foreground'
          }`} />
          <Input
            type="text"
            placeholder="Search articles, destinations, tips..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="pl-12 pr-10 py-6 text-base bg-background border-2 focus:border-primary transition-colors"
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Sort & Filter */}
      <div className="flex gap-2">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[160px] py-6 border-2">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="reading_time">Quick Reads</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-[52px] w-[52px] border-2">
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="end">
            <div className="space-y-4">
              <h4 className="font-medium">Advanced Filters</h4>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">
                  Reading Time
                </label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any length</SelectItem>
                    <SelectItem value="short">Under 5 min</SelectItem>
                    <SelectItem value="medium">5-10 min</SelectItem>
                    <SelectItem value="long">10+ min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">
                  Content Type
                </label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="article">Articles</SelectItem>
                    <SelectItem value="podcast">With Podcast</SelectItem>
                    <SelectItem value="guide">Travel Guides</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </motion.div>
  );
};

export default BlogSearch;
