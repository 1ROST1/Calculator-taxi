import { useEffect, useMemo, useState } from 'react'
import { Container as BSContainer, Row, Col } from 'react-bootstrap'
import {
  Text,
  Badge,
  ActionIcon,
  Modal,
  Box,
  Button,
  Divider,
  Stack,
  Group,
  Paper,
} from '@mantine/core'
import {
  IconTrash,
  IconEye,
  IconCash,
  IconCreditCard,
  IconCalendar,
  IconTrendingUp,
  IconReceipt,
  IconChartLine,
  IconShoppingCart,
} from '@tabler/icons-react'
import { formatCurrency, formatDate } from '../lib/format'
import { deleteDay, listDays } from '../lib/db'
import type { DayRecord } from '../types'
import './HistoryPage.css'

export function HistoryPage() {
  const [days, setDays] = useState<DayRecord[]>([])
  const [selected, setSelected] = useState<DayRecord | null>(null)
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({})

  const summary = useMemo(() => {
    if (!days.length) return { profit: 0, orders: 0, cash: 0, card: 0 }
    return days.reduce(
      (acc, day) => {
        acc.profit += day.totals.netProfit
        acc.orders += day.orders.length
        acc.cash += day.totals.totalCash
        acc.card += day.totals.totalCard
        return acc
      },
      { profit: 0, orders: 0, cash: 0, card: 0 }
    )
  }, [days])

  const load = async () => {
    const stored = await listDays()
    setDays(stored)
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id: string) => {
    await deleteDay(id)
    setDays((prev) => prev.filter((item) => item.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div className="history-page">
      <BSContainer className="py-3 py-md-4 py-lg-5">
        <div className="d-flex flex-column gap-4">
          {/* Header */}
          <div className="animate-fade-in">
            <h1 className="page-title mb-2">История смен</h1>
            <Text size="md" c="dimmed" fw={500}>
              Все ваши сохраненные смены и статистика
            </Text>
          </div>

          {/* Summary Stats Card */}
          <div className="summary-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="summary-decorations">
              <div className="blur-circle blur-circle-1"></div>
              <div className="blur-circle blur-circle-2"></div>
            </div>

            <div className="summary-content">
              <Row className="align-items-start mb-4">
                <Col xs={12} md={6}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="summary-icon">
                      <IconChartLine size={24} color="white" />
                    </div>
                    <span className="summary-label">Общая прибыль</span>
                  </div>
                  <div className="summary-profit">{formatCurrency(summary.profit)}</div>
                </Col>
                <Col xs={12} md={6}>
                  <Row className="g-3 g-md-4">
                    <Col xs={6} className="text-center">
                      <div className="summary-stat-label">Смен</div>
                      <div className="summary-stat-value">{days.length}</div>
                    </Col>
                    <Col xs={6} className="text-center">
                      <div className="summary-stat-label">Заказов</div>
                      <div className="summary-stat-value">{summary.orders}</div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="g-3">
                <Col xs={12} md={6}>
                  <div className="summary-payment-card">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div className="summary-payment-icon">
                        <IconCash size={20} color="white" />
                      </div>
                      <span className="summary-payment-label">Наличные</span>
                    </div>
                    <div className="summary-payment-amount">{formatCurrency(summary.cash)}</div>
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="summary-payment-card">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div className="summary-payment-icon">
                        <IconCreditCard size={20} color="white" />
                      </div>
                      <span className="summary-payment-label">Безналичные</span>
                    </div>
                    <div className="summary-payment-amount">{formatCurrency(summary.card)}</div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          {/* Days List */}
          {!days.length ? (
            <div className="empty-state animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="empty-state-icon">
                <IconReceipt size={40} stroke={1.5} />
              </div>
              <div className="text-center">
                <Text size="lg" fw={700} mb={1}>
                  Нет сохраненных смен
                </Text>
                <Text c="dimmed" size="sm">
                  Начните добавлять заказы в калькуляторе
                </Text>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {days.map((day, index) => (
                <div
                  key={day.id}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${0.2 + index * 0.05}s`,
                    animationFillMode: 'both',
                  }}
                >
                  <button
                    className={`day-card ${hoverStates[day.id] ? 'hovered' : ''}`}
                    onClick={() => setSelected(day)}
                    onMouseEnter={() => setHoverStates((prev) => ({ ...prev, [day.id]: true }))}
                    onMouseLeave={() => setHoverStates((prev) => ({ ...prev, [day.id]: false }))}
                  >
                    <div className="day-card-header">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <div className="day-card-icon">
                            <IconCalendar size={22} color="white" />
                          </div>
                          <span className="day-card-date">{formatDate(day.date)}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <Badge size="lg" variant="light" color="cyan">
                            <Group gap={6}>
                              <IconShoppingCart size={16} />
                              {day.orders.length} заказов
                            </Group>
                          </Badge>
                          <div className={`day-card-profit ${day.totals.netProfit >= 0 ? 'positive' : 'negative'}`}>
                            {formatCurrency(day.totals.netProfit)}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <ActionIcon
                          size={44}
                          variant="light"
                          color="cyan"
                          radius="xl"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelected(day)
                          }}
                        >
                          <IconEye size={22} />
                        </ActionIcon>
                        <ActionIcon
                          size={44}
                          variant="light"
                          color="red"
                          radius="xl"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(day.id)
                          }}
                        >
                          <IconTrash size={22} />
                        </ActionIcon>
                      </div>
                    </div>

                    <Row className="g-2 g-md-3 mt-3">
                      <Col xs={12} md={4}>
                        <div className="day-stat-card cash">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <div className="day-stat-icon cash">
                              <IconCash size={16} color="white" />
                            </div>
                            <span className="day-stat-label">Наличные</span>
                          </div>
                          <div className="day-stat-value">{formatCurrency(day.totals.totalCash)}</div>
                        </div>
                      </Col>
                      <Col xs={12} md={4}>
                        <div className="day-stat-card card">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <div className="day-stat-icon card">
                              <IconCreditCard size={16} color="white" />
                            </div>
                            <span className="day-stat-label">Безналичные</span>
                          </div>
                          <div className="day-stat-value">{formatCurrency(day.totals.totalCard)}</div>
                        </div>
                      </Col>
                      <Col xs={12} md={4}>
                        <div className="day-stat-card gross">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <div className="day-stat-icon gross">
                              <IconTrendingUp size={16} color="white" />
                            </div>
                            <span className="day-stat-label">Выручка</span>
                          </div>
                          <div className="day-stat-value">{formatCurrency(day.totals.gross)}</div>
                        </div>
                      </Col>
                    </Row>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Detail Modal */}
          <Modal
            opened={!!selected}
            onClose={() => setSelected(null)}
            title={
              <Text size="xl" fw={800}>
                Детали смены
              </Text>
            }
            size="lg"
            centered
            radius="xl"
            padding="xl"
            styles={{
              content: {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
              },
            }}
          >
            {selected && (
              <Stack gap="xl">
                <Box>
                  <Text size="28px" fw={900} mb={8}>
                    {formatDate(selected.date)}
                  </Text>
                  <Text
                    size="32px"
                    fw={900}
                    style={{
                      background:
                        selected.totals.netProfit >= 0
                          ? 'linear-gradient(135deg, #12b886, #0ca678)'
                          : 'linear-gradient(135deg, #fa5252, #e03131)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Прибыль: {formatCurrency(selected.totals.netProfit)}
                  </Text>
                </Box>

                <Divider />

                <Stack gap="md">
                  <Group gap="xs">
                    <Box
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #15aabf, #12b886)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconShoppingCart size={18} color="white" />
                    </Box>
                    <Text size="lg" fw={800} tt="uppercase">
                      Заказы ({selected.orders.length})
                    </Text>
                  </Group>

                  <Stack gap="xs">
                    {selected.orders.map((order, index) => (
                      <Box
                        key={order.id}
                        className="animate-fade-in"
                        style={{
                          animationDelay: `${index * 0.03}s`,
                          animationFillMode: 'both',
                        }}
                      >
                        <Paper
                          p="lg"
                          radius="16px"
                          style={{
                            background: 'rgba(255, 255, 255, 0.5)',
                            border: '1px solid rgba(0, 0, 0, 0.05)',
                          }}
                        >
                          <Group justify="space-between" align="center">
                            <Group gap="md">
                              <Box
                                style={{
                                  width: '44px',
                                  height: '44px',
                                  borderRadius: '12px',
                                  background:
                                    order.paymentType === 'cash'
                                      ? 'linear-gradient(135deg, #12b886, #0ca678)'
                                      : 'linear-gradient(135deg, #228be6, #1c7ed6)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow:
                                    order.paymentType === 'cash'
                                      ? '0 4px 12px rgba(18, 184, 134, 0.3)'
                                      : '0 4px 12px rgba(34, 139, 230, 0.3)',
                                }}
                              >
                                {order.paymentType === 'cash' ? (
                                  <IconCash size={24} color="white" />
                                ) : (
                                  <IconCreditCard size={24} color="white" />
                                )}
                              </Box>
                              <Box>
                                <Text size="xl" fw={800}>
                                  {formatCurrency(order.amount)}
                                </Text>
                                <Text size="sm" c="dimmed" fw={600}>
                                  {order.paymentType === 'cash' ? 'Наличные' : 'Безналичные'}
                                </Text>
                              </Box>
                            </Group>
                            {order.tips && order.tips > 0 && (
                              <Badge
                                size="lg"
                                style={{
                                  background: 'linear-gradient(135deg, #fab005, #fd7e14)',
                                  color: 'white',
                                  fontWeight: 700,
                                  paddingLeft: '12px',
                                  paddingRight: '12px',
                                }}
                              >
                                Чаевые {formatCurrency(order.tips)}
                              </Badge>
                            )}
                          </Group>
                        </Paper>
                      </Box>
                    ))}
                  </Stack>
                </Stack>

                {selected.notes && (
                  <>
                    <Divider />
                    <Box>
                      <Text size="sm" fw={800} c="dimmed" tt="uppercase" mb="md">
                        Заметка
                      </Text>
                      <Paper
                        p="lg"
                        radius="16px"
                        style={{
                          background: 'rgba(255, 255, 255, 0.5)',
                          border: '1px solid rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        <Text size="md" fw={500}>
                          {selected.notes}
                        </Text>
                      </Paper>
                    </Box>
                  </>
                )}

                <Button
                  fullWidth
                  size="xl"
                  radius="xl"
                  onClick={() => setSelected(null)}
                  style={{
                    background: 'linear-gradient(135deg, #15aabf, #12b886)',
                    fontWeight: 700,
                    boxShadow: '0 8px 24px rgba(18, 184, 134, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Закрыть
                </Button>
              </Stack>
            )}
          </Modal>
        </div>
      </BSContainer>
    </div>
  )
}
