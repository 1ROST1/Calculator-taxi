import { MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CalculatorPage } from './pages/CalculatorPage'
import { HistoryPage } from './pages/HistoryPage'
import { SettingsPage } from './pages/SettingsPage'
import { AuthPage } from './pages/AuthPage'
import { Navigation } from './components/Navigation'
import { useSettings } from './hooks/useSettings'
import './App.css'

export function App() {
  const { settings, updateSettings } = useSettings()

  const theme = createTheme({
    primaryColor: settings.accentColor,
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif',
    defaultRadius: 'md',
    white: '#ffffff',
    black: '#1a1a1a',
    fontSizes: {
      xs: '14px',
      sm: '16px',
      md: '18px',
      lg: '24px',
      xl: '32px',
    },
    spacing: {
      xs: '8px',
      sm: '12px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    colors: {
      dark: [
        '#f5f5f5',
        '#e0e0e0',
        '#bdbdbd',
        '#9e9e9e',
        '#757575',
        '#616161',
        '#424242',
        '#303030',
        '#212121',
        '#1a1a1a',
      ],
    },
    components: {
      Button: {
        defaultProps: {
          radius: 'md',
          size: 'xl',
        },
        styles: {
          root: {
            fontWeight: 700,
            fontSize: '18px',
            height: '64px',
            transition: 'none',
          },
        },
      },
      NumberInput: {
        defaultProps: {
          radius: 'md',
          size: 'xl',
        },
        styles: {
          input: {
            fontSize: '24px',
            fontWeight: 700,
            height: '64px',
            textAlign: 'center',
          },
        },
      },
      TextInput: {
        defaultProps: {
          radius: 'md',
          size: 'xl',
        },
        styles: {
          input: {
            fontSize: '18px',
            height: '64px',
          },
        },
      },
      Select: {
        defaultProps: {
          radius: 'md',
          size: 'xl',
        },
        styles: {
          input: {
            fontSize: '18px',
            fontWeight: 500,
            height: '64px',
          },
        },
      },
    },
  })

  return (
    <MantineProvider theme={theme} defaultColorScheme="light" forceColorScheme={settings.colorScheme}>
      <Notifications position="top-center" limit={1} autoClose={2000} />
      <BrowserRouter>
        <div className={`app-wrapper ${settings.colorScheme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
          <Navigation
            colorScheme={settings.colorScheme}
            onToggleTheme={() =>
              updateSettings({ colorScheme: settings.colorScheme === 'dark' ? 'light' : 'dark' })
            }
          />

          <main className="app-main">
            <Routes>
              <Route path="/" element={<CalculatorPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </MantineProvider>
  )
}
