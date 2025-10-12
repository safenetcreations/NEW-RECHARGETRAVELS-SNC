#!/bin/bash

echo "🐆 Yalu Knowledge Base Builder"
echo "=============================="
echo ""

# Check if dependencies are installed
echo "📦 Checking dependencies..."
npm list @pinecone-database/pinecone openai cheerio node-fetch > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "📥 Installing required dependencies..."
    npm install --save-dev @pinecone-database/pinecone openai cheerio node-fetch @types/node
fi

# Set environment variables (if not already set)
export VITE_PINECONE_API_KEY="${VITE_PINECONE_API_KEY}"
export VITE_PINECONE_ENVIRONMENT="${VITE_PINECONE_ENVIRONMENT}"
export VITE_OPENAI_API_KEY="${VITE_OPENAI_API_KEY}"

# Check if environment variables are set
if [ -z "$VITE_PINECONE_API_KEY" ] || [ -z "$VITE_OPENAI_API_KEY" ]; then
    echo "❌ Error: Required environment variables not set!"
    echo "Please ensure the following are set in your .env file:"
    echo "  - VITE_PINECONE_API_KEY"
    echo "  - VITE_PINECONE_ENVIRONMENT" 
    echo "  - VITE_OPENAI_API_KEY"
    exit 1
fi

echo "✅ Environment variables loaded"
echo ""

# Run the knowledge builder
echo "🚀 Starting knowledge base build..."
echo "This will:"
echo "  1. Process structured Sri Lankan travel knowledge"
echo "  2. Scrape relevant websites for current information"
echo "  3. Create embeddings using OpenAI"
echo "  4. Store everything in Pinecone for Yalu to access"
echo ""

npx ts-node scripts/pinecone-knowledge-builder.ts

echo ""
echo "🎉 Knowledge base build complete!"
echo "🐆 Yalu is now smarter about Sri Lankan travel!"