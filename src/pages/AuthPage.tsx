import { useState } from 'react'
import { Button, Card, PasswordInput, SegmentedControl, Stack, Text, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { apiLogin, apiRegister } from '../lib/api'
import type { AuthPayload } from '../types'

const AUTH_STORAGE_KEY = 'calc_auth'

function loadAuth(): AuthPayload | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthPayload) : null
  } catch (error) {
    console.error('Failed to parse auth from storage', error)
    return null
  }
}

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [auth, setAuth] = useState<AuthPayload | null>(loadAuth)

  const handleSubmit = async () => {
    if (!email || !password) {
      notifications.show({ color: 'yellow', title: 'Заполните поля', message: 'Укажите email и пароль' })
      return
    }

    setLoading(true)
    try {
      const response = mode === 'login' ? await apiLogin(email, password) : await apiRegister(email, password)

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response))
      setAuth(response)

      notifications.show({
        color: 'teal',
        title: mode === 'login' ? 'Вход выполнен' : 'Аккаунт создан',
        message: response.user.email,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось выполнить запрос'
      notifications.show({ color: 'red', title: 'Ошибка авторизации', message })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setAuth(null)
    notifications.show({ color: 'gray', title: 'Вы вышли из аккаунта' })
  }

  const apiBase = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:8000'
  const statusText = auth ? `Вы вошли как ${auth.user.email}` : 'Не авторизован'

  return (
    <Card radius="md" withBorder>
      <Stack gap="md">
        <SegmentedControl
          value={mode}
          onChange={(value) => setMode(value as 'login' | 'register')}
          data={[
            { label: 'Вход', value: 'login' },
            { label: 'Регистрация', value: 'register' },
          ]}
        />

        <TextInput
          label="Email или телефон"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          disabled={loading}
        />
        <PasswordInput label="Пароль" value={password} onChange={(e) => setPassword(e.currentTarget.value)} disabled={loading} />

        <Button onClick={handleSubmit} loading={loading}>
          {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
        </Button>

        {auth ? (
          <Button variant="light" color="gray" onClick={handleLogout} disabled={loading}>
            Выйти
          </Button>
        ) : null}

        <Stack gap={4}>
          <Text size="sm" fw={600}>
            Статус
          </Text>
          <Text size="sm" c={auth ? 'teal' : 'dimmed'}>
            {statusText}
          </Text>
          <Text size="sm" c="dimmed">
            API база: {apiBase}. Запустите FastAPI сервер из папки server (`uvicorn app.main:app --reload`), чтобы авторизация работала.
          </Text>
          <Text size="sm" c="dimmed">
            Токен и пользователь сохраняются локально в {AUTH_STORAGE_KEY}.
          </Text>
        </Stack>
      </Stack>
    </Card>
  )
}
