import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const contentPath = resolve(__dirname, 'sea_cucumber_content.json');
const content = JSON.parse(readFileSync(contentPath, 'utf-8'));

initializeApp({
  credential: applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID || 'recharge-travels-73e76'
});

const db = getFirestore();

async function seed() {
  await db.doc('pageContent/sea-cucumber-farming').set({
    ...content,
    updatedAt: new Date().toISOString()
  }, { merge: false });
  console.log('✅ Seeded sea-cucumber-farming document via Admin SDK');
}

seed().catch((err) => {
  console.error('❌ Failed to seed sea cucumber content via Admin SDK', err);
  process.exit(1);
});
