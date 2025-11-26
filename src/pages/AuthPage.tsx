import { useState } from 'react'
import { Button, Card, PasswordInput, SegmentedControl, Stack, Text, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = () => {
    notifications.show({
      color: 'blue',
      title: mode === 'login' ? 'Заглушка входа' : 'Заглушка регистрации',
      message: 'Подключите реальное API, чтобы продолжить.',
    })
  }

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

        <TextInput label="Email или телефон" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
        <PasswordInput label="Пароль" value={password} onChange={(e) => setPassword(e.currentTarget.value)} />

        <Button onClick={handleSubmit}>{mode === 'login' ? 'Войти' : 'Создать аккаунт'}</Button>

        <Text size="sm" c="dimmed">
          Авторизация пока не связана с сервером. После подключения API здесь появится реальный вход.
        </Text>
      </Stack>
    </Card>
  )
}
