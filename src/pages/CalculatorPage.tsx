import { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Stack,
  Text,
  TextInput,
  Group,
  ActionIcon,
  Container,
  UnstyledButton,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
  IconPlus,
  IconTrash,
  IconDeviceFloppy,
  IconCash,
  IconCreditCard,
  IconCalendar,
  IconSparkles,
  IconTrendingUp,
  IconMinus,
} from '@tabler/icons-react'
import dayjs from 'dayjs'
import { nanoid } from 'nanoid/non-secure'
import { calculateDay } from '../lib/calculator'
import { saveDay } from '../lib/db'
import { formatCurrency } from '../lib/format'
import { useSettings, defaultSettings } from '../hooks/useSettings'
import type { OrderInput, DayExtras, DayRecord } from '../types'

export function CalculatorPage() {
  const { settings } = useSettings()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)')
  const [orders, setOrders] = useState<OrderInput[]>([])
  const [date] = useState(dayjs().format('YYYY-MM-DD'))
  const [amount, setAmount] = useState('')
  const [paymentType, setPaymentType] = useState<'cash' | 'card'>('cash')

  const extras: DayExtras = {
    dailyExpenses: 0,
    infoServiceCost: settings.defaultInfoServiceCost,
    rentPercent: settings.defaultRentPercent,
    medicCost: settings.defaultMedicCost,
    mechanicCost: settings.defaultMechanicCost,
  }

  const totals = useMemo(
    () =>
      calculateDay({
        orders,
        extras,
        settings: settings || defaultSettings,
      }),
    [orders, extras, settings]
  )

  const handleAddOrder = () => {
    const amountNum = Number(amount)
    if (!amountNum || amountNum <= 0) {
      notifications.show({
        color: 'red',
        title: 'Ошибка',
        message: 'Введите корректную сумму',
      })
      return
    }

    const order: OrderInput = {
      id: nanoid(10),
      amount: amountNum,
      paymentType,
      tips: 0,
    }

    setOrders((prev) => [...prev, order])
    setAmount('')
    notifications.show({
      color: 'teal',
      message: `Заказ ${formatCurrency(amountNum)} добавлен`,
    })
  }

  const handleRemoveOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }

  const handleSaveDay = async () => {
    if (!orders.length) {
      notifications.show({
        color: 'yellow',
        title: 'Нет заказов',
        message: 'Добавьте хотя бы один заказ',
      })
      return
    }

    const record: DayRecord = {
      id: `${date}-${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}`,
      date,
      orders,
      totals,
      createdAt: Date.now(),
      ...extras,
    }

    await saveDay(record)
    notifications.show({
      color: 'teal',
      title: 'Смена сохранена',
      message: `${dayjs(date).format('DD.MM.YYYY')} · ${formatCurrency(totals.netProfit)}`,
    })
    setOrders([])
  }

  return (
    <Box
      style={{
        minHeight: 'calc(100vh - 70px)',
        background: 'transparent',
      }}
    >
      <Container size="md" p={isMobile ? 'sm' : isTablet ? 'md' : 'lg'}>
        <Stack gap={isMobile ? 20 : isTablet ? 24 : 32}>
          {/* Header */}
          <Box className="animate-fade-in">
            <Text
              size={isMobile ? '28px' : isTablet ? '36px' : '42px'}
              fw={900}
              mb={isMobile ? 4 : 8}
              style={{
                background: 'linear-gradient(135deg, #12b886 0%, #0ca678 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              Калькулятор смены
            </Text>
            <Group gap={8}>
              <IconCalendar size={18} style={{ opacity: 0.6 }} />
              <Text size="sm" c="dimmed" fw={500}>
                {dayjs(date).format('DD MMMM YYYY, dddd')}
              </Text>
            </Group>
          </Box>

          {/* Main Profit Card */}
          <Box
            className="animate-scale-in hover-lift"
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: isMobile ? '16px' : isTablet ? '20px' : '24px',
              padding: isMobile ? '20px' : isTablet ? '24px' : '32px',
              background:
                totals.netProfit >= 0
                  ? 'linear-gradient(135deg, #12b886 0%, #0ca678 50%, #099268 100%)'
                  : 'linear-gradient(135deg, #fa5252 0%, #e03131 50%, #c92a2a 100%)',
              boxShadow: totals.netProfit >= 0
                ? '0 20px 60px rgba(18, 184, 134, 0.4)'
                : '0 20px 60px rgba(250, 82, 82, 0.4)',
            }}
          >
            {/* Decorative elements */}
            <Box
              style={{
                position: 'absolute',
                top: '-50%',
                right: '-10%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                filter: 'blur(60px)',
              }}
            />
            <Box
              style={{
                position: 'absolute',
                bottom: '-30%',
                left: '-5%',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                filter: 'blur(50px)',
              }}
            />

            <Stack gap={16} align="center" style={{ position: 'relative' }}>
              <Group gap={8}>
                <IconSparkles size={20} color="rgba(255, 255, 255, 0.9)" />
                <Text
                  size="13px"
                  fw={700}
                  tt="uppercase"
                  lts={2}
                  style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                >
                  Чистая прибыль
                </Text>
              </Group>

              <Text
                size={isMobile ? '36px' : isTablet ? '48px' : '64px'}
                fw={900}
                lh={1}
                style={{
                  color: '#ffffff',
                  fontVariantNumeric: 'tabular-nums',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                  letterSpacing: '-0.03em',
                }}
              >
                {formatCurrency(totals.netProfit)}
              </Text>

              <Group gap={isMobile ? 16 : isTablet ? 24 : 40} mt={isMobile ? 12 : 16} wrap={isMobile ? 'wrap' : 'nowrap'} justify="center">
                <Box ta="center">
                  <Text size="xs" fw={600} tt="uppercase" lts={1} style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Выручка
                  </Text>
                  <Text size={isMobile ? 'lg' : 'xl'} fw={800} style={{ color: '#ffffff' }}>
                    {formatCurrency(totals.gross)}
                  </Text>
                </Box>
                <Box ta="center">
                  <Text size="xs" fw={600} tt="uppercase" lts={1} style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Заказов
                  </Text>
                  <Text size={isMobile ? 'lg' : 'xl'} fw={800} style={{ color: '#ffffff' }}>
                    {orders.length}
                  </Text>
                </Box>
                <Box ta="center">
                  <Text size="xs" fw={600} tt="uppercase" lts={1} style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Расходы
                  </Text>
                  <Text size={isMobile ? 'lg' : 'xl'} fw={800} style={{ color: '#ffffff' }}>
                    {formatCurrency(totals.extrasTotal)}
                  </Text>
                </Box>
              </Group>
            </Stack>
          </Box>

          {/* Payment Stats */}
          <Stack gap={isMobile ? 12 : 16} className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Box
              className="glass-card hover-lift"
              style={{
                borderRadius: isMobile ? '16px' : '20px',
                padding: isMobile ? '16px' : '20px',
                border: '2px solid rgba(18, 184, 134, 0.2)',
              }}
            >
              <Group gap={16}>
                <Box
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #12b886 0%, #0ca678 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(18, 184, 134, 0.3)',
                  }}
                >
                  <IconCash size={28} stroke={2.5} color="#ffffff" />
                </Box>
                <Box style={{ flex: 1 }}>
                  <Text size="xs" c="dimmed" fw={600} tt="uppercase" lts={1}>
                    Наличные
                  </Text>
                  <Text size="28px" fw={900} lh={1.2} mt={4}>
                    {formatCurrency(totals.totalCash)}
                  </Text>
                </Box>
              </Group>
            </Box>

            <Box
              className="glass-card hover-lift"
              style={{
                borderRadius: isMobile ? '16px' : '20px',
                padding: isMobile ? '16px' : '20px',
                border: '2px solid rgba(34, 139, 230, 0.2)',
              }}
            >
              <Group gap={16}>
                <Box
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #228be6 0%, #1c7ed6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(34, 139, 230, 0.3)',
                  }}
                >
                  <IconCreditCard size={28} stroke={2.5} color="#ffffff" />
                </Box>
                <Box style={{ flex: 1 }}>
                  <Text size="xs" c="dimmed" fw={600} tt="uppercase" lts={1}>
                    Безналичные
                  </Text>
                  <Text size="28px" fw={900} lh={1.2} mt={4}>
                    {formatCurrency(totals.totalCard)}
                  </Text>
                </Box>
              </Group>
            </Box>
          </Stack>

          {/* Add Order Section */}
          <Box
            className="glass-card animate-fade-in"
            style={{
              borderRadius: isMobile ? '16px' : isTablet ? '20px' : '24px',
              padding: isMobile ? '20px' : isTablet ? '24px' : '32px',
              animationDelay: '0.2s',
            }}
          >
            <Stack gap={24}>
              <Group gap={12}>
                <IconTrendingUp size={24} stroke={2} style={{ color: 'var(--mantine-color-teal-6)' }} />
                <Text size="xl" fw={800}>
                  Добавить заказ
                </Text>
              </Group>

              {/* Payment Type Selector */}
              <Group grow>
                <UnstyledButton
                  onClick={() => setPaymentType('cash')}
                  style={{
                    padding: '16px 24px',
                    borderRadius: '16px',
                    background:
                      paymentType === 'cash'
                        ? 'linear-gradient(135deg, #12b886 0%, #0ca678 100%)'
                        : 'transparent',
                    border:
                      paymentType === 'cash'
                        ? '2px solid transparent'
                        : '2px solid rgba(18, 184, 134, 0.3)',
                    transition: 'all 0.3s ease',
                    boxShadow:
                      paymentType === 'cash' ? '0 8px 24px rgba(18, 184, 134, 0.3)' : 'none',
                  }}
                >
                  <Group gap={12} justify="center">
                    <IconCash size={24} color={paymentType === 'cash' ? '#ffffff' : 'currentColor'} />
                    <Text fw={700} size="lg" style={{ color: paymentType === 'cash' ? '#ffffff' : 'inherit' }}>
                      Наличные
                    </Text>
                  </Group>
                </UnstyledButton>

                <UnstyledButton
                  onClick={() => setPaymentType('card')}
                  style={{
                    padding: '16px 24px',
                    borderRadius: '16px',
                    background:
                      paymentType === 'card'
                        ? 'linear-gradient(135deg, #228be6 0%, #1c7ed6 100%)'
                        : 'transparent',
                    border:
                      paymentType === 'card'
                        ? '2px solid transparent'
                        : '2px solid rgba(34, 139, 230, 0.3)',
                    transition: 'all 0.3s ease',
                    boxShadow:
                      paymentType === 'card' ? '0 8px 24px rgba(34, 139, 230, 0.3)' : 'none',
                  }}
                >
                  <Group gap={12} justify="center">
                    <IconCreditCard size={24} color={paymentType === 'card' ? '#ffffff' : 'currentColor'} />
                    <Text fw={700} size="lg" style={{ color: paymentType === 'card' ? '#ffffff' : 'inherit' }}>
                      Безналичные
                    </Text>
                  </Group>
                </UnstyledButton>
              </Group>

              <TextInput
                size="xl"
                placeholder="Введите сумму"
                value={amount}
                onChange={(e) => setAmount(e.currentTarget.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddOrder()}
                type="number"
                rightSection={
                  <Text size="xl" fw={600} c="dimmed" mr={16}>
                    ₽
                  </Text>
                }
                styles={{
                  input: {
                    fontSize: '32px',
                    fontWeight: 800,
                    textAlign: 'center',
                    height: '80px',
                    borderRadius: '16px',
                    border: '2px solid rgba(18, 184, 134, 0.2)',
                    background: 'rgba(18, 184, 134, 0.05)',
                    transition: 'all 0.3s ease',
                    ':focus': {
                      border: '2px solid rgba(18, 184, 134, 0.5)',
                      background: 'rgba(18, 184, 134, 0.08)',
                    },
                  },
                }}
              />

              <Button
                size="xl"
                leftSection={<IconPlus size={24} />}
                onClick={handleAddOrder}
                fullWidth
                style={{
                  height: '64px',
                  borderRadius: '16px',
                  fontSize: '18px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #12b886 0%, #0ca678 100%)',
                  border: 'none',
                  boxShadow: '0 8px 24px rgba(18, 184, 134, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(18, 184, 134, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(18, 184, 134, 0.3)'
                }}
              >
                Добавить заказ
              </Button>
            </Stack>
          </Box>

          {/* Orders List */}
          {orders.length > 0 && (
            <Box
              className="glass-card animate-fade-in"
              style={{
                borderRadius: isMobile ? '16px' : isTablet ? '20px' : '24px',
                padding: isMobile ? '20px' : isTablet ? '24px' : '32px',
                animationDelay: '0.3s',
              }}
            >
              <Stack gap={20}>
                <Group justify="space-between">
                  <Text size="xl" fw={800}>
                    Заказы смены
                  </Text>
                  <Box
                    style={{
                      padding: '8px 16px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #12b886 0%, #0ca678 100%)',
                      boxShadow: '0 4px 16px rgba(18, 184, 134, 0.3)',
                    }}
                  >
                    <Text size="lg" fw={800} style={{ color: '#ffffff' }}>
                      {orders.length}
                    </Text>
                  </Box>
                </Group>

                <Stack gap={12}>
                  {orders.map((order, index) => (
                    <Box
                      key={order.id}
                      className="hover-lift"
                      style={{
                        padding: '20px',
                        borderRadius: '16px',
                        background:
                          order.paymentType === 'cash'
                            ? 'rgba(18, 184, 134, 0.08)'
                            : 'rgba(34, 139, 230, 0.08)',
                        border:
                          order.paymentType === 'cash'
                            ? '2px solid rgba(18, 184, 134, 0.2)'
                            : '2px solid rgba(34, 139, 230, 0.2)',
                        animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`,
                      }}
                    >
                      <Group justify="space-between" align="center">
                        <Group gap={16}>
                          <Box
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: '12px',
                              background:
                                order.paymentType === 'cash'
                                  ? 'linear-gradient(135deg, #12b886 0%, #0ca678 100%)'
                                  : 'linear-gradient(135deg, #228be6 0%, #1c7ed6 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow:
                                order.paymentType === 'cash'
                                  ? '0 4px 16px rgba(18, 184, 134, 0.3)'
                                  : '0 4px 16px rgba(34, 139, 230, 0.3)',
                            }}
                          >
                            {order.paymentType === 'cash' ? (
                              <IconCash size={24} color="#ffffff" stroke={2.5} />
                            ) : (
                              <IconCreditCard size={24} color="#ffffff" stroke={2.5} />
                            )}
                          </Box>
                          <Box>
                            <Text size="24px" fw={900} lh={1.2}>
                              {formatCurrency(order.amount)}
                            </Text>
                            <Text size="sm" c="dimmed" fw={600} mt={4}>
                              {order.paymentType === 'cash' ? 'Наличные' : 'Безналичные'}
                            </Text>
                          </Box>
                        </Group>
                        <ActionIcon
                          size={48}
                          radius="12px"
                          variant="light"
                          color="red"
                          onClick={() => handleRemoveOrder(order.id)}
                          style={{
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)'
                          }}
                        >
                          <IconTrash size={22} />
                        </ActionIcon>
                      </Group>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Box>
          )}

          {/* Action Buttons */}
          <Stack gap={isMobile ? 12 : 0} className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button
              size={isMobile ? 'lg' : 'xl'}
              fullWidth
              leftSection={<IconDeviceFloppy size={isMobile ? 20 : 24} />}
              onClick={handleSaveDay}
              disabled={!orders.length}
              style={{
                height: isMobile ? '56px' : '64px',
                borderRadius: isMobile ? '14px' : '16px',
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 700,
                background: orders.length
                  ? 'linear-gradient(135deg, #12b886 0%, #0ca678 100%)'
                  : 'rgba(128, 128, 128, 0.3)',
                border: 'none',
                boxShadow: orders.length ? '0 8px 24px rgba(18, 184, 134, 0.3)' : 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (orders.length) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(18, 184, 134, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (orders.length) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(18, 184, 134, 0.3)'
                }
              }}
            >
              Сохранить смену
            </Button>
            <Button
              size={isMobile ? 'lg' : 'xl'}
              fullWidth
              leftSection={<IconMinus size={isMobile ? 20 : 24} />}
              variant="light"
              color="gray"
              onClick={() => setOrders([])}
              disabled={!orders.length}
              style={{
                height: isMobile ? '56px' : '64px',
                borderRadius: isMobile ? '14px' : '16px',
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 700,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (orders.length) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => {
                if (orders.length) {
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              Очистить
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
