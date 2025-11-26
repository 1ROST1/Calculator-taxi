import { ActionIcon, Box, Group, Text, UnstyledButton } from '@mantine/core'
import { IconCalculator, IconHistory, IconSettings, IconMoon, IconSun } from '@tabler/icons-react'
import { useNavigate, useLocation } from 'react-router-dom'

type Props = {
  colorScheme: 'light' | 'dark'
  onToggleTheme: () => void
}

const navItems = [
  { label: 'Калькулятор', value: '/', icon: IconCalculator },
  { label: 'История', value: '/history', icon: IconHistory },
  { label: 'Настройки', value: '/settings', icon: IconSettings },
]

export function Navigation({ colorScheme, onToggleTheme }: Props) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box
      h={64}
      px="md"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: colorScheme === 'dark' ? '1px solid #2a2a2a' : '1px solid #e0e0e0',
        background: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
      }}
    >
      <Text size="xl" fw={700}>
        Такси Профит
      </Text>

      <Group gap="xs">
        {navItems.map((item) => {
          const isActive = location.pathname === item.value
          const Icon = item.icon

          return (
            <UnstyledButton
              key={item.value}
              onClick={() => navigate(item.value)}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isActive
                  ? colorScheme === 'dark'
                    ? '#2a2a2a'
                    : '#e0e0e0'
                  : 'transparent',
                color: isActive
                  ? colorScheme === 'dark'
                    ? '#ffffff'
                    : '#1a1a1a'
                  : colorScheme === 'dark'
                  ? '#757575'
                  : '#9e9e9e',
              }}
            >
              <Icon size={24} stroke={2} />
            </UnstyledButton>
          )
        })}

        <ActionIcon
          onClick={onToggleTheme}
          size={48}
          radius="md"
          variant="subtle"
          aria-label="Переключить тему"
        >
          {colorScheme === 'dark' ? <IconSun size={24} /> : <IconMoon size={24} />}
        </ActionIcon>
      </Group>
    </Box>
  )
}
