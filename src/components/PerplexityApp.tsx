import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, ExternalLink, MessageCircle } from 'lucide-react';

interface PerplexityAppProps {
  title?: string;
  height?: string;
  className?: string;
}

const PerplexityApp: React.FC<PerplexityAppProps> = ({ 
  title = "AI Travel Assistant", 
  height = "600px",
  className = ""
}) => {
  const [attemptEmbed, setAttemptEmbed] = useState(true);

  const handleOpenExternal = () => {
    window.open('https://www.perplexity.ai/apps/2bc740ec-a202-4da1-84cf-dc9ffbb241b8?0=d&1=d', '_blank');
  };

  if (!attemptEmbed) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 mb-4">
            <Bot className="w-6 h-6 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h3 className="text-xl font-semibold mb-4">AI Travel Assistant</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get instant answers about Sri Lankan wildlife, tour planning, and destination recommendations
          </p>
          <Button onClick={handleOpenExternal} size="lg" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Open AI Assistant
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <iframe 
          src="https://www.perplexity.ai/apps/2bc740ec-a202-4da1-84cf-dc9ffbb241b8?0=d&1=d" 
          title="Perplexity AI Assistant"
          width="100%" 
          height={height}
          style={{ 
            border: 'none', 
            overflow: 'auto',
            borderRadius: '0 0 8px 8px'
          }}
          className="w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          loading="lazy"
          onError={() => setAttemptEmbed(false)}
        />
        <div className="p-4 border-t bg-muted/20">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleOpenExternal}
            className="w-full gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open in New Tab
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerplexityApp;