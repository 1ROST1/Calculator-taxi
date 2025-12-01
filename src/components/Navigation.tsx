import { Box, Group, Text, UnstyledButton, ActionIcon } from '@mantine/core'
import { IconCalculator, IconHistory, IconSettings, IconMoon, IconSun, IconSparkles } from '@tabler/icons-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

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
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({})
  const [themeHover, setThemeHover] = useState(false)

  return (
    <Box
      h={70}
      px="xl"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: 'none',
        background: colorScheme === 'dark'
          ? 'rgba(26, 26, 26, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        boxShadow: colorScheme === 'dark'
          ? '0 4px 24px rgba(0, 0, 0, 0.5)'
          : '0 4px 24px rgba(0, 0, 0, 0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo with gradient and icon */}
      <Group gap="xs">
        <Box
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #12b886 0%, #15aabf 50%, #0ca678 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(18, 184, 134, 0.4)',
          }}
        >
          <IconSparkles size={24} color="white" stroke={2.5} />
        </Box>
        <Box>
          <Text
            size="26px"
            fw={900}
            style={{
              background: 'linear-gradient(135deg, #12b886 0%, #15aabf 50%, #0ca678 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1,
            }}
          >
            Такси Профит
          </Text>
        </Box>
      </Group>

      {/* Navigation items */}
      <Group gap="xs">
        {navItems.map((item) => {
          const isActive = location.pathname === item.value
          const Icon = item.icon
          const isHovered = hoverStates[item.value]

          return (
            <UnstyledButton
              key={item.value}
              onClick={() => navigate(item.value)}
              onMouseEnter={() => setHoverStates((prev) => ({ ...prev, [item.value]: true }))}
              onMouseLeave={() => setHoverStates((prev) => ({ ...prev, [item.value]: false }))}
              style={{
                padding: '12px 20px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: isActive
                  ? 'linear-gradient(135deg, #12b886, #0ca678)'
                  : isHovered
                  ? colorScheme === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.04)'
                  : 'transparent',
                color: isActive ? 'white' : colorScheme === 'dark' ? '#b0b0b0' : '#666',
                fontWeight: isActive ? 700 : 600,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered && !isActive ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isActive
                  ? '0 8px 20px rgba(18, 184, 134, 0.35)'
                  : isHovered
                  ? colorScheme === 'dark'
                    ? '0 4px 12px rgba(255, 255, 255, 0.05)'
                    : '0 4px 12px rgba(0, 0, 0, 0.08)'
                  : 'none',
              }}
            >
              <Icon size={22} stroke={isActive ? 2.5 : 2} />
              <Text size="md" fw={isActive ? 700 : 600}>
                {item.label}
              </Text>
            </UnstyledButton>
          )
        })}

        {/* Theme toggle button */}
        <Box
          onMouseEnter={() => setThemeHover(true)}
          onMouseLeave={() => setThemeHover(false)}
          style={{
            marginLeft: '8px',
          }}
        >
          <ActionIcon
            onClick={onToggleTheme}
            size={48}
            radius="14px"
            aria-label="Переключить тему"
            style={{
              background: themeHover
                ? colorScheme === 'dark'
                  ? 'linear-gradient(135deg, #fab005, #fd7e14)'
                  : 'linear-gradient(135deg, #364fc7, #4c6ef5)'
                : colorScheme === 'dark'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.05)',
              color: themeHover ? 'white' : colorScheme === 'dark' ? '#b0b0b0' : '#666',
              border: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: themeHover ? 'translateY(-2px) rotate(15deg)' : 'translateY(0) rotate(0deg)',
              boxShadow: themeHover
                ? colorScheme === 'dark'
                  ? '0 8px 20px rgba(253, 126, 20, 0.4)'
                  : '0 8px 20px rgba(54, 79, 199, 0.4)'
                : 'none',
            }}
          >
            {colorScheme === 'dark' ? <IconSun size={22} stroke={2.5} /> : <IconMoon size={22} stroke={2.5} />}
          </ActionIcon>
        </Box>
      </Group>
    </Box>
  )
}
