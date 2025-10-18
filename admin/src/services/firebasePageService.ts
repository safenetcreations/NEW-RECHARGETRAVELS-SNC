import { db } from '@/lib/firebase'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore'

export interface Page {
  id: string
  title: string
  slug: string
  content: string
  createdAt: string
  updatedAt: string
}

const PAGES_COLLECTION = 'pages'

export const firebasePageService = {
  async getAllPages(): Promise<Page[]> {
    try {
      const pagesRef = collection(db, PAGES_COLLECTION)
      const q = query(pagesRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)

      const pages: Page[] = []

      for (const docSnap of querySnapshot.docs) {
        const pageData = docSnap.data()
        const pageId = docSnap.id

        pages.push({
          id: pageId,
          title: pageData.title || '',
          slug: pageData.slug || '',
          content: pageData.content || '',
          createdAt: pageData.createdAt || new Date().toISOString(),
          updatedAt: pageData.updatedAt || new Date().toISOString(),
        })
      }

      return pages
    } catch (error) {
      console.error('Error fetching pages from Firebase:', error)
      return []
    }
  },

  async getPageById(pageId: string): Promise<Page | null> {
    try {
      const pageRef = doc(db, PAGES_COLLECTION, pageId)
      const pageSnap = await getDoc(pageRef)

      if (!pageSnap.exists()) {
        return null
      }

      const pageData = pageSnap.data()

      return {
        id: pageId,
        title: pageData.title || '',
        slug: pageData.slug || '',
        content: pageData.content || '',
        createdAt: pageData.createdAt || new Date().toISOString(),
        updatedAt: pageData.updatedAt || new Date().toISOString(),
      }
    } catch (error) {
      console.error('Error fetching page by ID:', error)
      return null
    }
  },

  async createPage(pageData: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, PAGES_COLLECTION), {
        ...pageData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating page:', error)
      throw error
    }
  },

  async updatePage(pageId: string, updates: Partial<Page>): Promise<void> {
    try {
      const pageRef = doc(db, PAGES_COLLECTION, pageId)
      await updateDoc(pageRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error updating page:', error)
      throw error
    }
  },

  async deletePage(pageId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, PAGES_COLLECTION, pageId))
    } catch (error) {
      console.error('Error deleting page:', error)
      throw error
    }
  },
}
