
import React, { useEffect, useState } from 'react';
import { SitemapGenerator } from '@/lib/sitemap-generator';

const Sitemap: React.FC = () => {
  const [sitemapXML, setSitemapXML] = useState<string>('');

  useEffect(() => {
    const generateSitemap = async () => {
      const xml = await SitemapGenerator.generateMainSitemap();
      setSitemapXML(xml);
    };

    generateSitemap();
  }, []);

  useEffect(() => {
    // Set the correct content type for XML
    document.querySelector('meta[name="content-type"]')?.setAttribute('content', 'application/xml');
  }, []);

  return (
    <div>
      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
        {sitemapXML}
      </pre>
    </div>
  );
};

export default Sitemap;
