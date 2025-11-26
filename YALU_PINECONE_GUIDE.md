# 🧠 Yalu's Brain: Pinecone Knowledge Base Guide

## What is Pinecone?

Pinecone is a **vector database** that gives Yalu long-term memory and deep knowledge about Sri Lanka. Think of it as Yalu's brain where all travel information is stored and can be instantly retrieved.

## How It Works

### 1. **Knowledge Storage**
```
Text about beaches → AI converts to numbers (vectors) → Stored in Pinecone
```

### 2. **Smart Retrieval**
```
User asks question → Convert to vector → Find similar vectors → Return relevant info
```

### 3. **Semantic Understanding**
- Understands meaning, not just keywords
- "Best beaches" finds info about Mirissa, Unawatuna, etc.
- "Where to see elephants" finds wildlife park information

## What Knowledge We Store

### 📚 Structured Knowledge (Hand-crafted)
- **Beaches**: Complete guide to all beach areas
- **Wildlife**: Detailed park information, safari tips
- **Culture**: Temple etiquette, heritage sites
- **Food**: Restaurant recommendations, must-try dishes
- **Practical**: Visa, transport, money, safety

### 🌐 Scraped Knowledge (Automated)
- Official tourism websites
- Travel blogs and guides
- Current events and updates
- Real-time information

## Building Yalu's Knowledge

### Quick Start
```bash
# Run this command to fill Yalu's brain with knowledge
./scripts/build-yalu-knowledge.sh
```

### What Happens
1. **Processes** all structured guides about Sri Lanka
2. **Scrapes** travel websites for current info
3. **Creates embeddings** (converts text to vectors)
4. **Stores** in Pinecone for instant access

### Time Required
- First run: ~10-15 minutes
- Updates: ~5 minutes
- Runs automatically: Daily at 2 AM

## How Yalu Uses This Knowledge

### Example Flow
1. **User**: "What's the best beach for surfing?"
2. **Yalu**: 
   - Converts question to vector
   - Searches Pinecone for similar content
   - Finds: Arugam Bay (expert), Weligama (beginner)
   - Responds with specific, accurate information

### Knowledge Categories

| Category | What's Included | Example Questions |
|----------|----------------|-------------------|
| 🏖️ Beaches | All coastal areas, activities | "Best beaches in December?" |
| 🦁 Wildlife | Parks, animals, safari info | "Where to see leopards?" |
| 🏛️ Culture | Temples, heritage, festivals | "Temple dress code?" |
| 🍛 Food | Cuisine, restaurants, costs | "Must-try street food?" |
| ✈️ Practical | Visa, transport, money | "How to get around?" |
| 🏨 Hotels | Accommodations, areas | "Where to stay in Ella?" |
| 🎉 Events | Festivals, seasons | "What's happening in August?" |

## Adding New Knowledge

### Method 1: Update Structured Knowledge
Edit `/scripts/pinecone-knowledge-builder.ts`:
```typescript
{
  id: 'your-topic',
  title: 'Your Topic Title',
  content: `Your detailed content here...`,
  category: KNOWLEDGE_CATEGORIES.RELEVANT_CATEGORY,
  metadata: {
    type: 'guide',
    tags: ['relevant', 'tags']
  }
}
```

### Method 2: Add New Sources
Add websites to scrape:
```typescript
{
  url: 'https://example.com/sri-lanka-info',
  category: KNOWLEDGE_CATEGORIES.DESTINATIONS,
  selector: '.main-content' // Optional
}
```

### Method 3: Manual Upload
```typescript
import { queryKnowledge } from './pinecone-knowledge-builder'

// Test your knowledge
const results = await queryKnowledge("whale watching season")
console.log(results)
```

## Maintaining Knowledge Quality

### Regular Updates
- **Daily**: Automated scraping of news/updates
- **Weekly**: Review and update prices/availability
- **Monthly**: Add new destinations/experiences
- **Seasonal**: Update weather and festival info

### Quality Checks
```bash
# Test knowledge retrieval
npm run test-knowledge "your question here"

# Check knowledge stats
npm run knowledge-stats

# Find knowledge gaps
npm run analyze-queries
```

## Advanced Features

### 1. **Contextual Memory**
- Remembers user preferences
- Personalizes recommendations
- Learns from conversations

### 2. **Multi-language Support**
- Stores content in multiple languages
- Retrieves based on user language
- Automatic translation when needed

### 3. **Real-time Updates**
- Webhooks for price changes
- API integration for availability
- News feed processing

## Troubleshooting

### Common Issues

**"Yalu doesn't know about X"**
- Add it to structured knowledge
- Run `./scripts/build-yalu-knowledge.sh`

**"Information seems outdated"**
- Check last update time
- Run scraper for fresh data
- Update structured content

**"Wrong information returned"**
- Check embedding quality
- Adjust chunk size
- Review metadata tags

## Cost Optimization

### Pinecone Free Tier
- **Vectors**: Up to 1M (plenty for Yalu)
- **Queries**: Unlimited
- **Performance**: Fast enough

### Tips
- Chunk text optimally (800 chars)
- Remove duplicate content
- Use metadata filters
- Cache frequent queries

## Monitoring Dashboard

Access Pinecone dashboard to see:
- Total vectors stored
- Query performance
- Popular topics
- Knowledge gaps

## Future Enhancements

### Planned Features
- [ ] Auto-update from RSS feeds
- [ ] User feedback learning
- [ ] Image recognition for places
- [ ] Voice memory snippets
- [ ] Booking availability sync

### Community Contributions
Help Yalu learn more:
1. Submit new content via GitHub
2. Report knowledge gaps
3. Translate content
4. Verify information

---

## Quick Commands

```bash
# Build knowledge base
./scripts/build-yalu-knowledge.sh

# Test knowledge query
npm run query-knowledge "best time to visit"

# Update specific category
npm run update-category beaches

# Check knowledge stats
npm run knowledge-report
```

With Pinecone, Yalu has become a true Sri Lankan travel expert, ready to help visitors discover the beauty of the island! 🐆🇱🇰