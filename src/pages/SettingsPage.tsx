import { Container as BSContainer, Row, Col } from 'react-bootstrap'
import { Text, Paper, Switch, Button, Box, NumberInput } from '@mantine/core'
import { IconMoon, IconSun, IconPalette, IconMoneybag, IconEye, IconSettings } from '@tabler/icons-react'
import { useSettings } from '../hooks/useSettings'
import './SettingsPage.css'

export function SettingsPage() {
  const { settings, updateSettings } = useSettings()

  return (
    <div className="settings-page">
      <BSContainer className="py-3 py-md-4 py-lg-5">
        <div className="d-flex flex-column gap-4">
          {/* Header */}
          <div className="animate-fade-in">
            <h1 className="page-title mb-2">Настройки</h1>
            <Text size="md" c="dimmed" fw={500}>
              Настройте приложение под себя
            </Text>
          </div>

          {/* Theme Settings */}
          <div className="settings-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="settings-card-header">
              <div className={`settings-icon ${settings.colorScheme === 'dark' ? 'dark' : 'light'}`}>
                {settings.colorScheme === 'dark' ? <IconMoon size={24} color="white" /> : <IconSun size={24} color="white" />}
              </div>
              <div>
                <Text size="xl" fw={800}>Тема оформления</Text>
                <Text size="sm" c="dimmed" fw={500}>Выберите светлую или тёмную тему</Text>
              </div>
            </div>

            <Row className="g-3">
              <Col xs={12} md={6}>
                <Button
                  size="xl"
                  radius="xl"
                  variant={settings.colorScheme === 'light' ? 'filled' : 'light'}
                  onClick={() => updateSettings({ colorScheme: 'light' })}
                  leftSection={<IconSun size={20} />}
                  fullWidth
                  className="theme-btn light"
                  style={{
                    background: settings.colorScheme === 'light' ? 'linear-gradient(135deg, #fab005, #fd7e14)' : undefined,
                    fontWeight: 700,
                    boxShadow: settings.colorScheme === 'light' ? '0 8px 24px rgba(253, 126, 20, 0.3)' : undefined,
                  }}
                >
                  Светлая
                </Button>
              </Col>
              <Col xs={12} md={6}>
                <Button
                  size="xl"
                  radius="xl"
                  variant={settings.colorScheme === 'dark' ? 'filled' : 'light'}
                  onClick={() => updateSettings({ colorScheme: 'dark' })}
                  leftSection={<IconMoon size={20} />}
                  fullWidth
                  className="theme-btn dark"
                  style={{
                    background: settings.colorScheme === 'dark' ? 'linear-gradient(135deg, #364fc7, #4c6ef5)' : undefined,
                    fontWeight: 700,
                    boxShadow: settings.colorScheme === 'dark' ? '0 8px 24px rgba(54, 79, 199, 0.3)' : undefined,
                  }}
                >
                  Тёмная
                </Button>
              </Col>
            </Row>
          </div>

          {/* Accent Color */}
          <div className="settings-card animate-scale-in" style={{ animationDelay: '0.15s' }}>
            <div className="settings-card-header">
              <div className="settings-icon accent">
                <IconPalette size={24} color="white" />
              </div>
              <div>
                <Text size="xl" fw={800}>Акцентный цвет</Text>
                <Text size="sm" c="dimmed" fw={500}>Основной цвет интерфейса</Text>
              </div>
            </div>

            <Row className="g-2 g-md-3">
              {[
                { value: 'cyan', label: 'Бирюза', gradient: ['#15aabf', '#0c8599'] },
                { value: 'teal', label: 'Изумрудный', gradient: ['#12b886', '#099268'] },
                { value: 'green', label: 'Зелёный', gradient: ['#2f9e44', '#2b8a3e'] },
                { value: 'blue', label: 'Синий', gradient: ['#228be6', '#1971c2'] },
              ].map((item) => (
                <Col xs={6} md={3} key={item.value}>
                  <Button
                    size="xl"
                    radius="xl"
                    variant={settings.accentColor === item.value ? 'filled' : 'light'}
                    color={item.value}
                    onClick={() => updateSettings({ accentColor: item.value as typeof settings.accentColor })}
                    fullWidth
                    style={{
                      background: settings.accentColor === item.value
                        ? `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})`
                        : undefined,
                      fontWeight: 700,
                      boxShadow: settings.accentColor === item.value ? `0 8px 24px ${item.gradient[0]}4d` : undefined,
                    }}
                  >
                    {item.label}
                  </Button>
                </Col>
              ))}
            </Row>
          </div>

          {/* Display Settings */}
          <div className="settings-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="settings-card-header mb-3">
              <div className="settings-icon display">
                <IconEye size={24} color="white" />
              </div>
              <Text size="xl" fw={800}>Отображение полей</Text>
            </div>

            <div className="d-flex flex-column gap-3">
              {[
                { key: 'showOrderTime', label: 'Показывать время заказа', description: 'Отображать время каждого заказа' },
                { key: 'showTips', label: 'Учитывать чаевые', description: 'Добавлять поле для чаевых в форме заказа' },
                { key: 'showInfoServiceCost', label: 'Информационные услуги', description: 'Показывать поле инфо-услуг в расходах' },
                { key: 'showRentPercent', label: 'Процент аренды', description: 'Отображать поле процента аренды' },
                { key: 'showMedicMechanic', label: 'Медик и механик', description: 'Показывать поля для расходов на медика и механика' },
              ].map((item) => (
                <Paper
                  key={item.key}
                  p="lg"
                  radius="16px"
                  className={`switch-card ${settings[item.key as keyof typeof settings] ? 'active' : ''}`}
                >
                  <Switch
                    size="lg"
                    label={
                      <Box>
                        <Text size="md" fw={700}>{item.label}</Text>
                        <Text size="sm" c="dimmed">{item.description}</Text>
                      </Box>
                    }
                    checked={settings[item.key as keyof typeof settings] as boolean}
                    onChange={(event) => updateSettings({ [item.key]: event.currentTarget.checked })}
                    styles={{ track: { cursor: 'pointer' } }}
                  />
                </Paper>
              ))}
            </div>
          </div>

          {/* Calculation Settings */}
          <div className="settings-card animate-scale-in" style={{ animationDelay: '0.25s' }}>
            <div className="settings-card-header mb-3">
              <div className="settings-icon calculation">
                <IconSettings size={24} color="white" />
              </div>
              <Text size="xl" fw={800}>Расчёты</Text>
            </div>

            <Paper
              p="lg"
              radius="16px"
              className={`switch-card ${settings.includeRentInProfit ? 'active' : ''}`}
            >
              <Switch
                size="lg"
                label={
                  <Box>
                    <Text size="md" fw={700}>Вычитать аренду из прибыли</Text>
                    <Text size="sm" c="dimmed">Учитывать процент аренды при расчёте чистой прибыли</Text>
                  </Box>
                }
                checked={settings.includeRentInProfit}
                onChange={(event) => updateSettings({ includeRentInProfit: event.currentTarget.checked })}
                styles={{ track: { cursor: 'pointer' } }}
              />
            </Paper>
          </div>

          {/* Tariffs Settings */}
          <div className="tariffs-card animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="tariffs-decorations">
              <div className="blur-circle blur-circle-1"></div>
              <div className="blur-circle blur-circle-2"></div>
            </div>

            <div className="tariffs-content">
              <div className="tariffs-header mb-4">
                <div className="tariffs-icon">
                  <IconMoneybag size={28} color="white" />
                </div>
                <div>
                  <Text size="24px" fw={900} c="white">Персональные тарифы</Text>
                  <Text size="sm" c="rgba(255, 255, 255, 0.85)" fw={500}>
                    Установите значения по умолчанию для расчётов
                  </Text>
                </div>
              </div>

              <Row className="g-3 mb-3">
                <Col xs={12} md={6}>
                  <div className="tariff-input-card">
                    <NumberInput
                      label={<Text c="white" fw={700} mb={1}>Процент комиссии/аренды</Text>}
                      description={<Text size="xs" c="rgba(255, 255, 255, 0.75)">% от выручки</Text>}
                      value={settings.defaultRentPercent}
                      onChange={(value) => updateSettings({ defaultRentPercent: Number(value) || 0 })}
                      min={0}
                      max={100}
                      step={0.5}
                      decimalScale={2}
                      suffix=" %"
                      size="lg"
                      styles={{
                        input: {
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '18px',
                        },
                      }}
                    />
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="tariff-input-card">
                    <NumberInput
                      label={<Text c="white" fw={700} mb={1}>Информационные услуги</Text>}
                      description={<Text size="xs" c="rgba(255, 255, 255, 0.75)">Фиксированная сумма за смену</Text>}
                      value={settings.defaultInfoServiceCost}
                      onChange={(value) => updateSettings({ defaultInfoServiceCost: Number(value) || 0 })}
                      min={0}
                      step={50}
                      thousandSeparator=" "
                      suffix=" ₽"
                      size="lg"
                      styles={{
                        input: {
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '18px',
                        },
                      }}
                    />
                  </div>
                </Col>
              </Row>

              <Row className="g-3 mb-3">
                <Col xs={12} md={6}>
                  <div className="tariff-input-card">
                    <NumberInput
                      label={<Text c="white" fw={700} mb={1}>Медицинские услуги</Text>}
                      description={<Text size="xs" c="rgba(255, 255, 255, 0.75)">Фиксированная сумма за смену</Text>}
                      value={settings.defaultMedicCost}
                      onChange={(value) => updateSettings({ defaultMedicCost: Number(value) || 0 })}
                      min={0}
                      step={100}
                      thousandSeparator=" "
                      suffix=" ₽"
                      size="lg"
                      styles={{
                        input: {
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '18px',
                        },
                      }}
                    />
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="tariff-input-card">
                    <NumberInput
                      label={<Text c="white" fw={700} mb={1}>Услуги механика</Text>}
                      description={<Text size="xs" c="rgba(255, 255, 255, 0.75)">Фиксированная сумма за смену</Text>}
                      value={settings.defaultMechanicCost}
                      onChange={(value) => updateSettings({ defaultMechanicCost: Number(value) || 0 })}
                      min={0}
                      step={100}
                      thousandSeparator=" "
                      suffix=" ₽"
                      size="lg"
                      styles={{
                        input: {
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '18px',
                        },
                      }}
                    />
                  </div>
                </Col>
              </Row>

              <div className="tariff-note">
                <Text size="sm" c="white" fw={600}>
                  <strong>Примечание:</strong> Установленные тарифы применяются ко всем новым расчётам. Ранее сохранённые смены не изменятся.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </BSContainer>
    </div>
  )
}
