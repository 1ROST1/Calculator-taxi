import { Container, Stack, Text, Paper, Switch, Group, Button, Box, Divider, NumberInput } from '@mantine/core'
import { IconMoon, IconSun, IconPalette, IconMoneybag, IconEye, IconSettings } from '@tabler/icons-react'
import { useSettings } from '../hooks/useSettings'
import { useState } from 'react'

export function SettingsPage() {
  const { settings, updateSettings } = useSettings()
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({})

  return (
    <Container size="md" p="lg">
      <Stack gap="xl">
        {/* Gradient Header */}
        <Box className="animate-fade-in">
          <Text
            size="42px"
            fw={900}
            mb={8}
            style={{
              background: 'linear-gradient(135deg, #15aabf 0%, #12b886 50%, #0ca678 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Настройки
          </Text>
          <Text size="md" c="dimmed" fw={500}>
            Настройте приложение под себя
          </Text>
        </Box>

        {/* Theme Settings */}
        <Box className="animate-scale-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <Paper
            radius="24px"
            p="xl"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Stack gap="xl">
              <Group gap="xs">
                <Box
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: settings.colorScheme === 'dark'
                      ? 'linear-gradient(135deg, #364fc7, #4c6ef5)'
                      : 'linear-gradient(135deg, #fab005, #fd7e14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: settings.colorScheme === 'dark'
                      ? '0 4px 12px rgba(54, 79, 199, 0.3)'
                      : '0 4px 12px rgba(253, 126, 20, 0.3)',
                  }}
                >
                  {settings.colorScheme === 'dark' ? (
                    <IconMoon size={24} color="white" />
                  ) : (
                    <IconSun size={24} color="white" />
                  )}
                </Box>
                <Box>
                  <Text size="xl" fw={800}>
                    Тема оформления
                  </Text>
                  <Text size="sm" c="dimmed" fw={500}>
                    Выберите светлую или тёмную тему
                  </Text>
                </Box>
              </Group>

              <Group grow>
                <Button
                  size="xl"
                  radius="xl"
                  variant={settings.colorScheme === 'light' ? 'filled' : 'light'}
                  onClick={() => updateSettings({ colorScheme: 'light' })}
                  leftSection={<IconSun size={20} />}
                  style={{
                    background: settings.colorScheme === 'light'
                      ? 'linear-gradient(135deg, #fab005, #fd7e14)'
                      : undefined,
                    fontWeight: 700,
                    boxShadow: settings.colorScheme === 'light'
                      ? '0 8px 24px rgba(253, 126, 20, 0.3)'
                      : undefined,
                    transition: 'all 0.3s ease',
                  }}
                >
                  Светлая
                </Button>
                <Button
                  size="xl"
                  radius="xl"
                  variant={settings.colorScheme === 'dark' ? 'filled' : 'light'}
                  onClick={() => updateSettings({ colorScheme: 'dark' })}
                  leftSection={<IconMoon size={20} />}
                  style={{
                    background: settings.colorScheme === 'dark'
                      ? 'linear-gradient(135deg, #364fc7, #4c6ef5)'
                      : undefined,
                    fontWeight: 700,
                    boxShadow: settings.colorScheme === 'dark'
                      ? '0 8px 24px rgba(54, 79, 199, 0.3)'
                      : undefined,
                    transition: 'all 0.3s ease',
                  }}
                >
                  Тёмная
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Box>

        {/* Accent Color */}
        <Box className="animate-scale-in" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
          <Paper
            radius="24px"
            p="xl"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Stack gap="xl">
              <Group gap="xs">
                <Box
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #15aabf, #12b886)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(21, 170, 191, 0.3)',
                  }}
                >
                  <IconPalette size={24} color="white" />
                </Box>
                <Box>
                  <Text size="xl" fw={800}>
                    Акцентный цвет
                  </Text>
                  <Text size="sm" c="dimmed" fw={500}>
                    Основной цвет интерфейса
                  </Text>
                </Box>
              </Group>

              <Group grow>
                {[
                  { value: 'cyan', label: 'Бирюза', gradient: ['#15aabf', '#0c8599'] },
                  { value: 'teal', label: 'Изумрудный', gradient: ['#12b886', '#099268'] },
                  { value: 'green', label: 'Зелёный', gradient: ['#2f9e44', '#2b8a3e'] },
                  { value: 'blue', label: 'Синий', gradient: ['#228be6', '#1971c2'] },
                ].map((item) => (
                  <Button
                    key={item.value}
                    size="xl"
                    radius="xl"
                    variant={settings.accentColor === item.value ? 'filled' : 'light'}
                    color={item.value}
                    onClick={() => updateSettings({ accentColor: item.value as typeof settings.accentColor })}
                    style={{
                      background: settings.accentColor === item.value
                        ? `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})`
                        : undefined,
                      fontWeight: 700,
                      boxShadow: settings.accentColor === item.value
                        ? `0 8px 24px ${item.gradient[0]}4d`
                        : undefined,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Group>
            </Stack>
          </Paper>
        </Box>

        {/* Display Settings */}
        <Box className="animate-scale-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <Paper
            radius="24px"
            p="xl"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Stack gap="lg">
              <Group gap="xs" mb="sm">
                <Box
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #228be6, #1971c2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(34, 139, 230, 0.3)',
                  }}
                >
                  <IconEye size={24} color="white" />
                </Box>
                <Text size="xl" fw={800}>
                  Отображение полей
                </Text>
              </Group>

              <Stack gap="lg">
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
                    style={{
                      background: settings[item.key as keyof typeof settings]
                        ? 'rgba(18, 184, 134, 0.08)'
                        : 'rgba(255, 255, 255, 0.5)',
                      border: settings[item.key as keyof typeof settings]
                        ? '1px solid rgba(18, 184, 134, 0.2)'
                        : '1px solid rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Switch
                      size="lg"
                      label={
                        <Box>
                          <Text size="md" fw={700}>
                            {item.label}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {item.description}
                          </Text>
                        </Box>
                      }
                      checked={settings[item.key as keyof typeof settings] as boolean}
                      onChange={(event) => updateSettings({ [item.key]: event.currentTarget.checked })}
                      styles={{
                        track: {
                          cursor: 'pointer',
                        },
                      }}
                    />
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Box>

        {/* Calculation Settings */}
        <Box className="animate-scale-in" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
          <Paper
            radius="24px"
            p="xl"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Stack gap="lg">
              <Group gap="xs" mb="sm">
                <Box
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #fab005, #fd7e14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(253, 126, 20, 0.3)',
                  }}
                >
                  <IconSettings size={24} color="white" />
                </Box>
                <Text size="xl" fw={800}>
                  Расчёты
                </Text>
              </Group>

              <Paper
                p="lg"
                radius="16px"
                style={{
                  background: settings.includeRentInProfit
                    ? 'rgba(18, 184, 134, 0.08)'
                    : 'rgba(255, 255, 255, 0.5)',
                  border: settings.includeRentInProfit
                    ? '1px solid rgba(18, 184, 134, 0.2)'
                    : '1px solid rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                }}
              >
                <Switch
                  size="lg"
                  label={
                    <Box>
                      <Text size="md" fw={700}>
                        Вычитать аренду из прибыли
                      </Text>
                      <Text size="sm" c="dimmed">
                        Учитывать процент аренды при расчёте чистой прибыли
                      </Text>
                    </Box>
                  }
                  checked={settings.includeRentInProfit}
                  onChange={(event) => updateSettings({ includeRentInProfit: event.currentTarget.checked })}
                  styles={{
                    track: {
                      cursor: 'pointer',
                    },
                  }}
                />
              </Paper>
            </Stack>
          </Paper>
        </Box>

        {/* Tariffs Settings */}
        <Box className="animate-scale-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          <Paper
            radius="24px"
            p="xl"
            style={{
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #fab005 0%, #fd7e14 50%, #f76707 100%)',
              boxShadow: '0 20px 60px rgba(253, 126, 20, 0.35)',
              border: 'none',
            }}
          >
            {/* Decorative blur elements */}
            <Box
              style={{
                position: 'absolute',
                top: '-40%',
                right: '-10%',
                width: '250px',
                height: '250px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.15)',
                filter: 'blur(70px)',
              }}
            />
            <Box
              style={{
                position: 'absolute',
                bottom: '-20%',
                left: '-5%',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                filter: 'blur(50px)',
              }}
            />

            <Stack gap="xl" style={{ position: 'relative', zIndex: 1 }}>
              <Group gap="xs">
                <Box
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconMoneybag size={28} color="white" />
                </Box>
                <Box>
                  <Text size="24px" fw={900} c="white">
                    Персональные тарифы
                  </Text>
                  <Text size="sm" c="rgba(255, 255, 255, 0.85)" fw={500}>
                    Установите значения по умолчанию для расчётов
                  </Text>
                </Box>
              </Group>

              <Group grow>
                <Box
                  style={{
                    borderRadius: '16px',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <NumberInput
                    label={
                      <Text c="white" fw={700} mb={4}>
                        Процент комиссии/аренды
                      </Text>
                    }
                    description={
                      <Text size="xs" c="rgba(255, 255, 255, 0.75)">
                        % от выручки
                      </Text>
                    }
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
                </Box>

                <Box
                  style={{
                    borderRadius: '16px',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <NumberInput
                    label={
                      <Text c="white" fw={700} mb={4}>
                        Информационные услуги
                      </Text>
                    }
                    description={
                      <Text size="xs" c="rgba(255, 255, 255, 0.75)">
                        Фиксированная сумма за смену
                      </Text>
                    }
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
                </Box>
              </Group>

              <Group grow>
                <Box
                  style={{
                    borderRadius: '16px',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <NumberInput
                    label={
                      <Text c="white" fw={700} mb={4}>
                        Медицинские услуги
                      </Text>
                    }
                    description={
                      <Text size="xs" c="rgba(255, 255, 255, 0.75)">
                        Фиксированная сумма за смену
                      </Text>
                    }
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
                </Box>

                <Box
                  style={{
                    borderRadius: '16px',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <NumberInput
                    label={
                      <Text c="white" fw={700} mb={4}>
                        Услуги механика
                      </Text>
                    }
                    description={
                      <Text size="xs" c="rgba(255, 255, 255, 0.75)">
                        Фиксированная сумма за смену
                      </Text>
                    }
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
                </Box>
              </Group>

              <Box
                p="lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <Text size="sm" c="white" fw={600}>
                  <strong>Примечание:</strong> Установленные тарифы применяются ко всем новым расчётам. Ранее сохранённые смены не изменятся.
                </Text>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Stack>
    </Container>
  )
}
