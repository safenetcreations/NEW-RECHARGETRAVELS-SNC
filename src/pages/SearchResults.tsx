import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, FileText, ArrowRight, Filter, Loader2 } from 'lucide-react';
import { searchContent, SearchResult } from '@/lib/search';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [contentType, setContentType] = useState<'all' | 'destination' | 'article'>('all');

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query, contentType]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const response = await searchContent(searchTerm, {
        regions: [],
        categories: [],
        contentType: contentType
      });
      setResults(response.results);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getResultLink = (result: SearchResult) => {
    if (result.content_type === 'destination') {
      return `/destinations/${result.slug || result.content_id}`;
    } else {
      return `/articles/${result.slug || result.content_id}`;
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Search Results
            </h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative max-w-3xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search destinations, articles, attractions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-32 h-14 text-lg"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  disabled={isLoading}
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Filter by:</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={contentType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setContentType('all')}
                >
                  All Results
                </Button>
                <Button
                  variant={contentType === 'destination' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setContentType('destination')}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Destinations
                </Button>
                <Button
                  variant={contentType === 'article' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setContentType('article')}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Articles
                </Button>
              </div>
            </div>
          </div>

          {/* Results Info */}
          {query && (
            <div className="mb-6">
              <p className="text-lg text-gray-600">
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Searching...
                  </span>
                ) : (
                  <>
                    Found <span className="font-semibold text-gray-900">{totalCount}</span> results for
                    <span className="font-semibold text-orange-600 ml-1">"{query}"</span>
                  </>
                )}
              </p>
            </div>
          )}

          {/* Results Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
            </div>
          ) : results.length > 0 ? (
            <div className="grid gap-6">
              {results.map((result) => (
                <Card key={result.content_id} className="hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={result.content_type === 'destination' ? 'default' : 'secondary'}>
                            {result.content_type === 'destination' ? (
                              <><MapPin className="h-3 w-3 mr-1" /> Destination</>
                            ) : (
                              <><FileText className="h-3 w-3 mr-1" /> Article</>
                            )}
                          </Badge>
                          {result.published && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Published
                            </Badge>
                          )}
                        </div>
                        <Link
                          to={getResultLink(result)}
                          className="group"
                        >
                          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                            {result.title}
                          </h2>
                        </Link>
                        {result.summary && (
                          <p className="text-gray-600 line-clamp-2 mb-4">
                            {result.summary}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {result.region_id && (
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {result.region_id}
                          </span>
                        )}
                      </div>
                      <Link to={getResultLink(result)}>
                        <Button variant="outline" size="sm" className="group">
                          View Details
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : query ? (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any destinations or articles matching "{query}".
                  Try searching with different keywords.
                </p>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-700">Popular searches:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Sigiriya', 'Kandy', 'Ella', 'Galle', 'Yala', 'Mirissa'].map((term) => (
                      <Button
                        key={term}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery(term);
                          navigate(`/search?q=${encodeURIComponent(term)}`);
                        }}
                      >
                        {term}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Start Your Search
              </h3>
              <p className="text-gray-600">
                Enter a destination, attraction, or topic to discover Sri Lanka
              </p>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;
