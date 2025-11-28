import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import {
  Driver,
  DriverDocument,
  DriverPhoto,
  DriverAvailability,
  DriverVehicle,
  DocumentType,
  PhotoType
} from '@/types/driver'

const DRIVER_COLLECTION = 'drivers'
const DRIVER_DOCUMENTS_COLLECTION = 'driver_documents'
const DRIVER_PHOTOS_COLLECTION = 'driver_photos'
const DRIVER_AVAILABILITY_COLLECTION = 'driver_availability'
const DRIVER_VEHICLES_COLLECTION = 'driver_vehicles'
const DRIVER_WALLET_COLLECTION = 'driver_wallets'

const nowIso = () => new Date().toISOString()

export async function createOrUpdateDriverProfile(driverId: string, data: Partial<Driver>) {
  const driverRef = doc(db, DRIVER_COLLECTION, driverId)
  const payload: Partial<Driver> = {
    ...data,
    user_id: driverId,
    current_status: data.current_status || 'pending_verification',
    verified_level: data.verified_level || 1,
    created_at: data.created_at || nowIso(),
    updated_at: nowIso()
  }

  await setDoc(driverRef, payload, { merge: true })
  return driverRef
}

export async function uploadDriverAsset(
  driverId: string,
  file: File,
  kind: 'docs' | 'photos' | 'videos',
  metadata?: Record<string, string>
) {
  const safeName = file.name.replace(/\s+/g, '_')
  const path = `drivers/${driverId}/${kind}/${Date.now()}_${safeName}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file, { customMetadata: metadata })
  const url = await getDownloadURL(storageRef)
  return { url, path }
}

export async function addDriverDocument(
  driverId: string,
  documentType: DocumentType,
  file: File,
  expiryDate?: string
): Promise<DriverDocument> {
  const upload = await uploadDriverAsset(driverId, file, 'docs', { driverId, documentType })
  const docRef = await addDoc(collection(db, DRIVER_DOCUMENTS_COLLECTION), {
    driver_id: driverId,
    document_type: documentType,
    file_path: upload.url,
    upload_date: nowIso(),
    expiry_date: expiryDate || null,
    verification_status: 'pending'
  })

  return {
    id: docRef.id,
    driver_id: driverId,
    document_type: documentType,
    file_path: upload.url,
    upload_date: nowIso(),
    expiry_date: expiryDate,
    verification_status: 'pending'
  }
}

export async function addDriverPhoto(
  driverId: string,
  photoType: PhotoType,
  file: File,
  opts?: { isMobileCapture?: boolean; deviceMetadata?: Record<string, unknown> }
): Promise<DriverPhoto> {
  const upload = await uploadDriverAsset(driverId, file, 'photos', {
    driverId,
    photoType,
    isMobileCapture: String(opts?.isMobileCapture ?? false)
  })

  const docRef = await addDoc(collection(db, DRIVER_PHOTOS_COLLECTION), {
    driver_id: driverId,
    photo_type: photoType,
    file_path: upload.url,
    upload_date: nowIso(),
    verification_status: 'pending',
    is_mobile_capture: opts?.isMobileCapture ?? false,
    device_metadata: opts?.deviceMetadata || {}
  })

  return {
    id: docRef.id,
    driver_id: driverId,
    photo_type: photoType,
    file_path: upload.url,
    upload_date: nowIso(),
    verification_status: 'pending',
    is_mobile_capture: opts?.isMobileCapture ?? false,
    device_metadata: opts?.deviceMetadata
  }
}

export async function addDriverAvailability(entry: DriverAvailability) {
  return addDoc(collection(db, DRIVER_AVAILABILITY_COLLECTION), {
    ...entry,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  })
}

export async function upsertDriverVehicle(driverId: string, vehicle: DriverVehicle) {
  const refId = vehicle.id || doc(collection(db, DRIVER_VEHICLES_COLLECTION)).id
  await setDoc(
    doc(db, DRIVER_VEHICLES_COLLECTION, refId),
    {
      ...vehicle,
      driver_id: driverId,
      verification_status: vehicle.verification_status || 'pending',
      updated_at: nowIso()
    },
    { merge: true }
  )
  return refId
}

export async function initializeDriverWallet(driverId: string, currency = 'LKR') {
  const walletRef = doc(db, DRIVER_WALLET_COLLECTION, driverId)
  await setDoc(
    walletRef,
    {
      driver_id: driverId,
      balance: 0,
      currency,
      updated_at: nowIso()
    },
    { merge: true }
  )
  return walletRef
}

export async function updateDriverWalletBalance(driverId: string, balance: number) {
  const walletRef = doc(db, DRIVER_WALLET_COLLECTION, driverId)
  await updateDoc(walletRef, { balance, updated_at: nowIso() })
}
