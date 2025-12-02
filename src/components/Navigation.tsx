import { Box, Group, Text, UnstyledButton, ActionIcon, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
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
  const theme = useMantineTheme()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)')
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({})
  const [themeHover, setThemeHover] = useState(false)

  return (
    <Box
      h={isMobile ? 60 : 70}
      px={isMobile ? 'sm' : isTablet ? 'md' : 'xl'}
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
      <Group gap={isMobile ? 6 : 'xs'}>
        <Box
          style={{
            width: isMobile ? '36px' : '44px',
            height: isMobile ? '36px' : '44px',
            borderRadius: isMobile ? '10px' : '14px',
            background: 'linear-gradient(135deg, #12b886 0%, #15aabf 50%, #0ca678 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(18, 184, 134, 0.4)',
          }}
        >
          <IconSparkles size={isMobile ? 20 : 24} color="white" stroke={2.5} />
        </Box>
        {!isMobile && (
          <Box>
            <Text
              size={isTablet ? '22px' : '26px'}
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
        )}
      </Group>

      {/* Navigation items */}
      <Group gap={isMobile ? 4 : 'xs'}>
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
                padding: isMobile ? '10px' : isTablet ? '10px 16px' : '12px 20px',
                borderRadius: isMobile ? '12px' : '14px',
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? 0 : '10px',
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
                transform: isHovered && !isActive && !isMobile ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isActive
                  ? '0 8px 20px rgba(18, 184, 134, 0.35)'
                  : isHovered && !isMobile
                  ? colorScheme === 'dark'
                    ? '0 4px 12px rgba(255, 255, 255, 0.05)'
                    : '0 4px 12px rgba(0, 0, 0, 0.08)'
                  : 'none',
              }}
            >
              <Icon size={isMobile ? 20 : 22} stroke={isActive ? 2.5 : 2} />
              {!isMobile && (
                <Text size={isTablet ? 'sm' : 'md'} fw={isActive ? 700 : 600}>
                  {item.label}
                </Text>
              )}
            </UnstyledButton>
          )
        })}

        {/* Theme toggle button */}
        <Box
          onMouseEnter={() => setThemeHover(true)}
          onMouseLeave={() => setThemeHover(false)}
          style={{
            marginLeft: isMobile ? '4px' : '8px',
          }}
        >
          <ActionIcon
            onClick={onToggleTheme}
            size={isMobile ? 40 : 48}
            radius={isMobile ? '12px' : '14px'}
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
              transform: themeHover && !isMobile ? 'translateY(-2px) rotate(15deg)' : 'translateY(0) rotate(0deg)',
              boxShadow: themeHover && !isMobile
                ? colorScheme === 'dark'
                  ? '0 8px 20px rgba(253, 126, 20, 0.4)'
                  : '0 8px 20px rgba(54, 79, 199, 0.4)'
                : 'none',
            }}
          >
            {colorScheme === 'dark' ? <IconSun size={isMobile ? 20 : 22} stroke={2.5} /> : <IconMoon size={isMobile ? 20 : 22} stroke={2.5} />}
          </ActionIcon>
        </Box>
      </Group>
    </Box>
  )
}
