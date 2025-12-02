import { useState, useMemo } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Button, Text, TextInput, ActionIcon } from '@mantine/core'
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
import './CalculatorPage.css'

export function CalculatorPage() {
  const { settings } = useSettings()
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
    <div className="calculator-page">
      <Container className="py-3 py-md-4 py-lg-5">
        <div className="d-flex flex-column gap-4">
          {/* Header */}
          <div className="animate-fade-in">
            <h1 className="page-title mb-2">Калькулятор смены</h1>
            <div className="d-flex align-items-center gap-2">
              <IconCalendar size={18} style={{ opacity: 0.6 }} />
              <Text size="sm" c="dimmed" fw={500}>
                {dayjs(date).format('DD MMMM YYYY, dddd')}
              </Text>
            </div>
          </div>

          {/* Main Profit Card */}
          <div className={`profit-card animate-scale-in ${totals.netProfit >= 0 ? 'positive' : 'negative'}`}>
            <div className="profit-card-decorations">
              <div className="blur-circle blur-circle-1"></div>
              <div className="blur-circle blur-circle-2"></div>
            </div>

            <div className="profit-card-content">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                <IconSparkles size={20} color="rgba(255, 255, 255, 0.9)" />
                <span className="profit-label">Чистая прибыль</span>
              </div>

              <div className="profit-amount">{formatCurrency(totals.netProfit)}</div>

              <Row className="g-3 g-md-4 mt-3 justify-content-center">
                <Col xs={4} className="text-center">
                  <div className="profit-stat-label">Выручка</div>
                  <div className="profit-stat-value">{formatCurrency(totals.gross)}</div>
                </Col>
                <Col xs={4} className="text-center">
                  <div className="profit-stat-label">Заказов</div>
                  <div className="profit-stat-value">{orders.length}</div>
                </Col>
                <Col xs={4} className="text-center">
                  <div className="profit-stat-label">Расходы</div>
                  <div className="profit-stat-value">{formatCurrency(totals.extrasTotal)}</div>
                </Col>
              </Row>
            </div>
          </div>

          {/* Payment Stats */}
          <Row className="g-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Col xs={12} md={6}>
              <div className="payment-stat-card cash-card">
                <div className="payment-icon cash-icon">
                  <IconCash size={28} stroke={2.5} color="#ffffff" />
                </div>
                <div className="flex-grow-1">
                  <div className="payment-stat-label">Наличные</div>
                  <div className="payment-stat-amount">{formatCurrency(totals.totalCash)}</div>
                </div>
              </div>
            </Col>

            <Col xs={12} md={6}>
              <div className="payment-stat-card card-card">
                <div className="payment-icon card-icon">
                  <IconCreditCard size={28} stroke={2.5} color="#ffffff" />
                </div>
                <div className="flex-grow-1">
                  <div className="payment-stat-label">Безналичные</div>
                  <div className="payment-stat-amount">{formatCurrency(totals.totalCard)}</div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Add Order Section */}
          <div className="glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="d-flex flex-column gap-4">
              <div className="d-flex align-items-center gap-3">
                <IconTrendingUp size={24} stroke={2} style={{ color: 'var(--bs-teal)' }} />
                <Text size="xl" fw={800}>
                  Добавить заказ
                </Text>
              </div>

              {/* Payment Type Selector */}
              <Row className="g-2 g-md-3">
                <Col xs={6}>
                  <button
                    className={`payment-type-btn ${paymentType === 'cash' ? 'active cash' : ''}`}
                    onClick={() => setPaymentType('cash')}
                  >
                    <IconCash size={24} />
                    <span>Наличные</span>
                  </button>
                </Col>
                <Col xs={6}>
                  <button
                    className={`payment-type-btn ${paymentType === 'card' ? 'active card' : ''}`}
                    onClick={() => setPaymentType('card')}
                  >
                    <IconCreditCard size={24} />
                    <span>Безналичные</span>
                  </button>
                </Col>
              </Row>

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
                className="amount-input"
                styles={{
                  input: {
                    fontSize: '32px',
                    fontWeight: 800,
                    textAlign: 'center',
                    height: '80px',
                    borderRadius: '16px',
                    border: '2px solid rgba(18, 184, 134, 0.2)',
                    background: 'rgba(18, 184, 134, 0.05)',
                  },
                }}
              />

              <Button
                size="xl"
                leftSection={<IconPlus size={24} />}
                onClick={handleAddOrder}
                fullWidth
                className="add-order-btn"
              >
                Добавить заказ
              </Button>
            </div>
          </div>

          {/* Orders List */}
          {orders.length > 0 && (
            <div className="glass-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="d-flex flex-column gap-4">
                <div className="d-flex justify-content-between align-items-center">
                  <Text size="xl" fw={800}>
                    Заказы смены
                  </Text>
                  <div className="orders-badge">{orders.length}</div>
                </div>

                <div className="d-flex flex-column gap-3">
                  {orders.map((order, index) => (
                    <div
                      key={order.id}
                      className={`order-item ${order.paymentType}`}
                      style={{ animation: `fadeIn 0.4s ease-out ${index * 0.05}s both` }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                          <div className={`order-icon ${order.paymentType}`}>
                            {order.paymentType === 'cash' ? (
                              <IconCash size={24} color="#ffffff" stroke={2.5} />
                            ) : (
                              <IconCreditCard size={24} color="#ffffff" stroke={2.5} />
                            )}
                          </div>
                          <div>
                            <div className="order-amount">{formatCurrency(order.amount)}</div>
                            <Text size="sm" c="dimmed" fw={600} mt={1}>
                              {order.paymentType === 'cash' ? 'Наличные' : 'Безналичные'}
                            </Text>
                          </div>
                        </div>
                        <ActionIcon
                          size={48}
                          radius="12px"
                          variant="light"
                          color="red"
                          onClick={() => handleRemoveOrder(order.id)}
                          className="delete-btn"
                        >
                          <IconTrash size={22} />
                        </ActionIcon>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <Row className="g-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Col xs={12}>
              <Button
                size="xl"
                fullWidth
                leftSection={<IconDeviceFloppy size={24} />}
                onClick={handleSaveDay}
                disabled={!orders.length}
                className="save-btn"
              >
                Сохранить смену
              </Button>
            </Col>
            <Col xs={12}>
              <Button
                size="xl"
                fullWidth
                leftSection={<IconMinus size={24} />}
                variant="light"
                color="gray"
                onClick={() => setOrders([])}
                disabled={!orders.length}
                className="clear-btn"
              >
                Очистить
              </Button>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  )
}
