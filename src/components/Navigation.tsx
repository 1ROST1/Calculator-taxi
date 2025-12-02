import { Navbar, Container, Nav } from 'react-bootstrap'
import { IconCalculator, IconHistory, IconSettings, IconMoon, IconSun, IconSparkles } from '@tabler/icons-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import './Navigation.css'

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
    <Navbar
      className={`navigation-bar ${colorScheme === 'dark' ? 'navbar-dark' : 'navbar-light'}`}
      fixed="top"
      expand="lg"
    >
      <Container fluid className="px-3 px-md-4 px-lg-5">
        {/* Logo */}
        <Navbar.Brand className="d-flex align-items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="logo-icon">
            <IconSparkles size={24} color="white" stroke={2.5} />
          </div>
          <span className="logo-text d-none d-md-inline">Такси Профит</span>
        </Navbar.Brand>

        {/* Navigation items */}
        <Nav className="ms-auto d-flex flex-row align-items-center gap-1 gap-md-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.value
            const Icon = item.icon
            const isHovered = hoverStates[item.value]

            return (
              <div
                key={item.value}
                className={`nav-item-custom ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
                onClick={() => navigate(item.value)}
                onMouseEnter={() => setHoverStates((prev) => ({ ...prev, [item.value]: true }))}
                onMouseLeave={() => setHoverStates((prev) => ({ ...prev, [item.value]: false }))}
              >
                <Icon size={22} stroke={isActive ? 2.5 : 2} />
                <span className="d-none d-md-inline">{item.label}</span>
              </div>
            )
          })}

          {/* Theme toggle button */}
          <div
            className={`theme-toggle-btn ${themeHover ? 'hovered' : ''}`}
            onClick={onToggleTheme}
            onMouseEnter={() => setThemeHover(true)}
            onMouseLeave={() => setThemeHover(false)}
            aria-label="Переключить тему"
          >
            {colorScheme === 'dark' ? <IconSun size={22} stroke={2.5} /> : <IconMoon size={22} stroke={2.5} />}
          </div>
        </Nav>
      </Container>
    </Navbar>
  )
}
