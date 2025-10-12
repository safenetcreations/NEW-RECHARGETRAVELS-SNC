import React from 'react';

const EmbeddedPerplexityApp = () => (
  <div style={{ width: '100%', height: '800px' }}>
    <iframe
      src="https://www.perplexity.ai/apps/2bc740ec-a202-4da1-84cf-dc9ffbb241b8?0=d&1=d"
      title="Perplexity Labs App"
      width="100%"
      height="100%"
      style={{ border: 'none', overflow: 'auto' }}
      allowFullScreen
    />
  </div>
);

export default EmbeddedPerplexityApp;