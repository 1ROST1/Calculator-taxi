import { useEffect, useMemo, useState } from 'react'
import {
  Container,
  Stack,
  Text,
  Paper,
  Group,
  Badge,
  ActionIcon,
  Modal,
  Box,
  Button,
  Divider,
  UnstyledButton,
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
    <Container size="md" p="lg">
      <Stack gap="xl">
        {/* Gradient Header */}
        <Box className="animate-fade-in">
          <Text
            size="42px"
            fw={900}
            mb={8}
            style={{
              background: 'linear-gradient(135deg, #12b886 0%, #15aabf 50%, #228be6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            История смен
          </Text>
          <Text size="md" c="dimmed" fw={500}>
            Все ваши сохраненные смены и статистика
          </Text>
        </Box>

        {/* Summary Stats Cards */}
        <Box className="animate-scale-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <Paper
            radius="24px"
            p="xl"
            style={{
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #12b886 0%, #0ca678 50%, #099268 100%)',
              boxShadow: '0 20px 60px rgba(18, 184, 134, 0.35)',
              border: 'none',
            }}
          >
            {/* Decorative blur elements */}
            <Box
              style={{
                position: 'absolute',
                top: '-50%',
                right: '-10%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.15)',
                filter: 'blur(80px)',
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
                background: 'rgba(255, 255, 255, 0.1)',
                filter: 'blur(60px)',
              }}
            />

            <Stack gap="xl" style={{ position: 'relative', zIndex: 1 }}>
              <Group justify="space-between" align="flex-start">
                <Box>
                  <Group gap="xs" mb={4}>
                    <Box
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconChartLine size={24} color="white" />
                    </Box>
                    <Text size="sm" c="rgba(255, 255, 255, 0.85)" fw={600} tt="uppercase">
                      Общая прибыль
                    </Text>
                  </Group>
                  <Text size="48px" fw={900} c="white" style={{ lineHeight: 1.1 }}>
                    {formatCurrency(summary.profit)}
                  </Text>
                </Box>

                <Group gap="xl">
                  <Box ta="center">
                    <Text size="xs" c="rgba(255, 255, 255, 0.75)" fw={700} tt="uppercase" mb={4}>
                      Смен
                    </Text>
                    <Text size="28px" fw={900} c="white">
                      {days.length}
                    </Text>
                  </Box>
                  <Box ta="center">
                    <Text size="xs" c="rgba(255, 255, 255, 0.75)" fw={700} tt="uppercase" mb={4}>
                      Заказов
                    </Text>
                    <Text size="28px" fw={900} c="white">
                      {summary.orders}
                    </Text>
                  </Box>
                </Group>
              </Group>

              <Group grow>
                {/* Cash Card */}
                <Box
                  style={{
                    borderRadius: '16px',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Group gap="xs" mb={8}>
                    <Box
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.15))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconCash size={20} color="white" />
                    </Box>
                    <Text size="xs" c="rgba(255, 255, 255, 0.85)" fw={700} tt="uppercase">
                      Наличные
                    </Text>
                  </Group>
                  <Text size="24px" fw={900} c="white">
                    {formatCurrency(summary.cash)}
                  </Text>
                </Box>

                {/* Card Card */}
                <Box
                  style={{
                    borderRadius: '16px',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Group gap="xs" mb={8}>
                    <Box
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.15))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconCreditCard size={20} color="white" />
                    </Box>
                    <Text size="xs" c="rgba(255, 255, 255, 0.85)" fw={700} tt="uppercase">
                      Безналичные
                    </Text>
                  </Group>
                  <Text size="24px" fw={900} c="white">
                    {formatCurrency(summary.card)}
                  </Text>
                </Box>
              </Group>
            </Stack>
          </Paper>
        </Box>

        {/* Days List */}
        {!days.length ? (
          <Box
            className="animate-fade-in"
            style={{
              animationDelay: '0.2s',
              animationFillMode: 'both',
            }}
          >
            <Paper
              radius="20px"
              p="60px"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Stack align="center" gap="lg">
                <Box
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #f0f0f0, #e0e0e0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconReceipt size={40} stroke={1.5} color="var(--mantine-color-dimmed)" />
                </Box>
                <Box ta="center">
                  <Text size="lg" fw={700} mb={4}>
                    Нет сохраненных смен
                  </Text>
                  <Text c="dimmed" size="sm">
                    Начните добавлять заказы в калькуляторе
                  </Text>
                </Box>
              </Stack>
            </Paper>
          </Box>
        ) : (
          <Stack gap="md">
            {days.map((day, index) => (
              <Box
                key={day.id}
                className="animate-fade-in"
                style={{
                  animationDelay: `${0.2 + index * 0.05}s`,
                  animationFillMode: 'both',
                }}
              >
                <UnstyledButton
                  onClick={() => setSelected(day)}
                  style={{ width: '100%', textAlign: 'left' }}
                  onMouseEnter={() => setHoverStates((prev) => ({ ...prev, [day.id]: true }))}
                  onMouseLeave={() => setHoverStates((prev) => ({ ...prev, [day.id]: false }))}
                >
                  <Paper
                    radius="20px"
                    p="24px"
                    style={{
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      boxShadow: hoverStates[day.id]
                        ? '0 16px 48px rgba(0, 0, 0, 0.12)'
                        : '0 8px 32px rgba(0, 0, 0, 0.08)',
                      transform: hoverStates[day.id] ? 'translateY(-4px)' : 'translateY(0)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                    }}
                  >
                    <Stack gap="lg">
                      <Group justify="space-between" align="flex-start">
                        <Box style={{ flex: 1 }}>
                          <Group gap="xs" mb={8}>
                            <Box
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #15aabf, #12b886)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(21, 170, 191, 0.3)',
                              }}
                            >
                              <IconCalendar size={22} color="white" />
                            </Box>
                            <Text size="xl" fw={800}>
                              {formatDate(day.date)}
                            </Text>
                          </Group>
                          <Group gap="xs">
                            <Badge
                              size="lg"
                              variant="light"
                              color="cyan"
                              style={{
                                paddingLeft: '12px',
                                paddingRight: '12px',
                                fontWeight: 700,
                              }}
                            >
                              <Group gap={6}>
                                <IconShoppingCart size={16} />
                                {day.orders.length} заказов
                              </Group>
                            </Badge>
                            <Badge
                              size="lg"
                              style={{
                                paddingLeft: '12px',
                                paddingRight: '12px',
                                fontWeight: 700,
                                background:
                                  day.totals.netProfit >= 0
                                    ? 'linear-gradient(135deg, #12b886, #0ca678)'
                                    : 'linear-gradient(135deg, #fa5252, #e03131)',
                                color: 'white',
                                border: 'none',
                              }}
                            >
                              {formatCurrency(day.totals.netProfit)}
                            </Badge>
                          </Group>
                        </Box>
                        <Group gap={8}>
                          <ActionIcon
                            size={44}
                            variant="light"
                            color="cyan"
                            radius="xl"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelected(day)
                            }}
                            style={{
                              transition: 'all 0.2s ease',
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
                            style={{
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <IconTrash size={22} />
                          </ActionIcon>
                        </Group>
                      </Group>

                      <Group grow>
                        {/* Cash */}
                        <Box
                          style={{
                            borderRadius: '14px',
                            padding: '16px',
                            background: 'rgba(18, 184, 134, 0.08)',
                            border: '1px solid rgba(18, 184, 134, 0.15)',
                          }}
                        >
                          <Group gap="xs" mb={4}>
                            <Box
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #12b886, #0ca678)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <IconCash size={16} color="white" />
                            </Box>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                              Наличные
                            </Text>
                          </Group>
                          <Text size="lg" fw={800}>
                            {formatCurrency(day.totals.totalCash)}
                          </Text>
                        </Box>

                        {/* Card */}
                        <Box
                          style={{
                            borderRadius: '14px',
                            padding: '16px',
                            background: 'rgba(34, 139, 230, 0.08)',
                            border: '1px solid rgba(34, 139, 230, 0.15)',
                          }}
                        >
                          <Group gap="xs" mb={4}>
                            <Box
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #228be6, #1c7ed6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <IconCreditCard size={16} color="white" />
                            </Box>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                              Безналичные
                            </Text>
                          </Group>
                          <Text size="lg" fw={800}>
                            {formatCurrency(day.totals.totalCard)}
                          </Text>
                        </Box>

                        {/* Gross */}
                        <Box
                          style={{
                            borderRadius: '14px',
                            padding: '16px',
                            background: 'rgba(21, 170, 191, 0.08)',
                            border: '1px solid rgba(21, 170, 191, 0.15)',
                          }}
                        >
                          <Group gap="xs" mb={4}>
                            <Box
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #15aabf, #1098ad)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <IconTrendingUp size={16} color="white" />
                            </Box>
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                              Выручка
                            </Text>
                          </Group>
                          <Text size="lg" fw={800}>
                            {formatCurrency(day.totals.gross)}
                          </Text>
                        </Box>
                      </Group>
                    </Stack>
                  </Paper>
                </UnstyledButton>
              </Box>
            ))}
          </Stack>
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
      </Stack>
    </Container>
  )
}
