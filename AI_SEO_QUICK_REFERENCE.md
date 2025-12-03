# 🚀 AI SEO Quick Reference - Recharge Travels

## Files Created

| File | Purpose | Strategy |
|------|---------|----------|
| `AI_SEO_STRATEGY_2025.md` | Complete 10-strategy implementation guide | All |
| `public/robots.txt` | Updated to ALLOW AI crawlers | 5 |
| `src/components/seo/AISEOSchema.tsx` | AI-optimized structured data component | 5 |
| `src/components/seo/AIOptimizedFAQ.tsx` | FAQ component for AI citations | 7 |
| `src/data/brandFrameworks.ts` | Brand patterns & terminology | 8 |
| `src/data/contentClusters.ts` | Content cluster architecture | 4 |
| `src/data/authoritativeSources.ts` | E-E-A-T data & statistics | 9 |
| `src/data/localEntities.ts` | Core 30 location data | 10 |

---

## Quick Implementation Checklist

### Week 1-2: Foundation

- [ ] **Deploy updated robots.txt** (now allows AI crawlers)
- [ ] Set up brand monitoring with Brand24 or Google Alerts
- [ ] Create YouTube channel and upload first video
- [ ] Create Reddit account and start engaging on r/srilanka, r/travel

### Week 3-4: Content Updates

- [ ] Add AISEOSchema component to all major pages
- [ ] Add AIOptimizedFAQ to tour, destination, and experience pages
- [ ] Update 10 top pages with authoritative statistics
- [ ] Implement brand frameworks in marketing copy

### Month 2-3: Content Production

- [ ] Produce first content cluster (Sigiriya guide)
- [ ] Create 5 YouTube destination videos
- [ ] Build out Core 30 local entity pages
- [ ] Launch brand mention campaign

---

## Using the New Components

### 1. AISEOSchema Component

```tsx
import AISEOSchema from '@/components/seo/AISEOSchema';

<AISEOSchema
  pageType="tour"
  title="Cultural Heritage Tour Sri Lanka"
  description="7-day cultural tour covering UNESCO sites..."
  url="/tours/cultural-heritage"
  price="1200"
  duration="P7D"
  rating={4.9}
  reviewCount={150}
  faqs={[
    { 
      question: "How long is this tour?", 
      answer: "This tour is 7 days..." 
    }
  ]}
  breadcrumbs={[
    { name: "Home", url: "/" },
    { name: "Tours", url: "/tours" },
    { name: "Cultural Heritage", url: "/tours/cultural-heritage" }
  ]}
/>
```

### 2. AIOptimizedFAQ Component

```tsx
import AIOptimizedFAQ from '@/components/seo/AIOptimizedFAQ';

<AIOptimizedFAQ
  faqs={[
    {
      question: "What is included in the tour?",
      answer: "All accommodation, transport, and entrance fees are included. Specifically, you get: 6 nights in 4-star hotels, private chauffeur-driven vehicle, all national park entrance fees, daily breakfast, and English-speaking guide.",
      category: "Inclusions"
    }
  ]}
  title="Frequently Asked Questions"
  pageUrl="/tours/wildlife"
  showCategories={true}
/>
```

### 3. Using Brand Frameworks

```tsx
import { RECHARGE_METHOD, CEYLON_TRIANGLE } from '@/data/brandFrameworks';

// Display the Recharge Method
<div>
  <h3>{RECHARGE_METHOD.name}</h3>
  <p>{RECHARGE_METHOD.tagline}</p>
  {RECHARGE_METHOD.steps.map(step => (
    <div key={step.letter}>
      <strong>{step.letter}</strong> - {step.word}: {step.description}
    </div>
  ))}
</div>
```

### 4. Using Authoritative Sources

```tsx
import { WILDLIFE_STATISTICS, EXPERT_QUOTES, getExpertQuote } from '@/data/authoritativeSources';

// Display statistic with source
<p>
  {WILDLIFE_STATISTICS.leopards.stat} leopard density in Yala National Park 
  <span className="text-sm text-slate-500">
    (Source: {WILDLIFE_STATISTICS.leopards.source})
  </span>
</p>

// Display expert quote
<blockquote>
  {getExpertQuote('whaleWatching')}
</blockquote>
```

### 5. Using Local Entity Data

```tsx
import { getLocationBySlug, TIER_1_LOCATIONS } from '@/data/localEntities';

// Get single location
const sigiriya = getLocationBySlug('sigiriya');

// Display location info
<div>
  <h1>{sigiriya.name}</h1>
  <p>{sigiriya.description}</p>
  <ul>
    {sigiriya.highlights.map(h => <li key={h}>{h}</li>)}
  </ul>
</div>
```

---

## AI Citation Testing Process

### Monthly Testing Checklist

Test these queries across ChatGPT, Perplexity, Google AI, and Claude:

**Destination Queries:**
1. "Best places to visit in Sri Lanka"
2. "Sigiriya rock fortress guide"
3. "Things to do in Galle Sri Lanka"

**Experience Queries:**
1. "Whale watching Sri Lanka"
2. "Sri Lanka wildlife safari"
3. "Kandy to Ella train"

**Brand Queries:**
1. "Best Sri Lanka tour company"
2. "Sri Lanka travel agency reviews"
3. "Luxury tours Sri Lanka"

### Record Results

| Date | Platform | Query | Cited? | Position | Notes |
|------|----------|-------|--------|----------|-------|
| | ChatGPT | | | | |
| | Perplexity | | | | |
| | Google AI | | | | |

---

## Content Writing Guidelines for AI

### DO:
✅ Start with a direct answer in the first sentence  
✅ Include specific numbers, dates, and facts  
✅ Add FAQ sections with schema markup  
✅ Use clear, scannable headings  
✅ Include authoritative sources and citations  
✅ Update content regularly with "Last Updated" dates  
✅ Use brand terminology consistently  

### DON'T:
❌ Start with marketing fluff ("Welcome to our amazing...")  
❌ Use vague statements without specifics  
❌ Write walls of text without structure  
❌ Forget to include schema markup  
❌ Leave content without update dates  
❌ Use inconsistent brand terminology  

---

## Example: AI-Optimized Content Structure

```markdown
# Sigiriya Rock Fortress: Complete 2025 Guide

**Quick Answer:** Sigiriya is a UNESCO World Heritage Site and ancient 
rock fortress in Sri Lanka, featuring a 200-meter climb with 1,200 steps. 
Entry costs $30 USD for foreigners. Best visited early morning (7am) 
to avoid heat.

## Key Facts
- **Location:** North Central Province, Sri Lanka
- **Entry Fee:** $30 USD (foreigners), Free (Sri Lankans)
- **Climb Duration:** 1.5-2 hours up, 45 min down
- **Best Time:** January-April (dry season)

## What to Expect
[Detailed content with subheadings...]

## FAQ

### How much does Sigiriya cost?
The entrance fee for Sigiriya is $30 USD for foreign adults...

### Is Sigiriya worth visiting?
Yes, Sigiriya is absolutely worth visiting. As a UNESCO World Heritage 
Site and one of the best-preserved ancient urban sites in Asia...

---
*Last Updated: December 2025*  
*Source: Central Cultural Fund, Sri Lanka Tourism*
```

---

## Platform-Specific Quick Tips

### For Google AI Overviews:
- YouTube videos are heavily cited
- Reddit posts get featured
- FAQ schema is critical
- Recent content preferred

### For ChatGPT:
- News and publisher content preferred
- Wikipedia references help
- Clear, factual content
- Expert quotes add authority

### For Perplexity:
- Niche blogs rank well
- Recent content preferred
- Technical depth matters
- Clear citations help

---

## Monthly Review Template

### Citation Tracking
- [ ] Tested 20 queries across platforms
- [ ] Recorded all citations/mentions
- [ ] Compared to previous month

### Content Updates
- [ ] Updated 5 pages with fresh stats
- [ ] Added FAQs to 3 pages
- [ ] Published 2 blog posts

### Brand Monitoring
- [ ] Reviewed brand mentions
- [ ] Responded to reviews
- [ ] Tracked competitor citations

---

## Contact

For questions about implementation:
- Email: info@rechargetravels.com
- Phone: +94 77 772 1999

---

*Version: 1.0 | December 2025*

