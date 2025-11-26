import { openDB } from 'idb'
import type { DayRecord, UserSettings } from '../types'

const DB_NAME = 'taxi-profit'
const DB_VERSION = 1
const DAYS_STORE = 'days'
const SETTINGS_STORE = 'settings'
const SETTINGS_KEY = 'user-settings'

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(DAYS_STORE)) {
      db.createObjectStore(DAYS_STORE, { keyPath: 'id' })
    }
    if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
      db.createObjectStore(SETTINGS_STORE, { keyPath: 'key' })
    }
  },
})

export async function saveDay(day: DayRecord) {
  const db = await dbPromise
  await db.put(DAYS_STORE, day)
  return day
}

export async function getDay(id: string) {
  const db = await dbPromise
  return db.get(DAYS_STORE, id)
}

export async function deleteDay(id: string) {
  const db = await dbPromise
  return db.delete(DAYS_STORE, id)
}

export async function listDays(): Promise<DayRecord[]> {
  const db = await dbPromise
  const all = await db.getAll(DAYS_STORE)
  return all.sort((a, b) => b.createdAt - a.createdAt)
}

export async function saveSettings(settings: UserSettings) {
  const db = await dbPromise
  await db.put(SETTINGS_STORE, { key: SETTINGS_KEY, ...settings })
  return settings
}

export async function loadSettings(): Promise<UserSettings | null> {
  const db = await dbPromise
  const stored = await db.get(SETTINGS_STORE, SETTINGS_KEY)
  if (!stored) return null

  const { key, ...settings } = stored as UserSettings & { key: string }
  return settings
}
