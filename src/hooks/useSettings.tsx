import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { loadSettings, saveSettings } from '../lib/db'
import type { UserSettings } from '../types'

export const defaultSettings: UserSettings = {
  showOrderTime: false,
  showTips: true,
  showInfoServiceCost: false,
  showRentPercent: true,
  showMedicMechanic: false,
  includeRentInProfit: true,
  colorScheme: 'light',
  accentColor: 'cyan',
  // Тарифы по умолчанию
  defaultRentPercent: 3,
  defaultInfoServiceCost: 300,
  defaultMedicCost: 500,
  defaultMechanicCost: 1000,
}

type SettingsContextValue = {
  settings: UserSettings
  updateSettings: (next: Partial<UserSettings>) => void
  ready: boolean
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    loadSettings()
      .then((stored) => {
        if (stored) {
          // Мигрировать старые настройки с новыми дефолтными значениями
          const migratedSettings = {
            ...defaultSettings,
            ...stored,
          }
          setSettings(migratedSettings)
          // Сохранить мигрированные настройки
          if (!stored.defaultRentPercent) {
            saveSettings(migratedSettings)
          }
        }
      })
      .finally(() => setReady(true))
  }, [])

  const updateSettings = (next: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...next }
      saveSettings(updated)
      return updated
    })
  }

  return <SettingsContext.Provider value={{ settings, updateSettings, ready }}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider')
  return ctx
}
