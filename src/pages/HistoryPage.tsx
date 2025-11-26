import { useEffect, useMemo, useState } from 'react'
import { ActionIcon, Badge, Button, Card, Flex, Group, Modal, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconTrash, IconRefresh, IconReportAnalytics, IconPigMoney, IconWallet, IconCreditCard } from '@tabler/icons-react'
import { formatCurrency, formatDate } from '../lib/format'
import { deleteDay, listDays } from '../lib/db'
import type { DayRecord } from '../types'
import type { ReactNode } from 'react'

export function HistoryPage() {
  const [days, setDays] = useState<DayRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<DayRecord | null>(null)

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
      { profit: 0, orders: 0, cash: 0, card: 0 },
    )
  }, [days])

  const load = async () => {
    setLoading(true)
    const stored = await listDays()
    setDays(stored)
    setLoading(false)
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
    <Stack gap="md">
      <Stack gap={4}>
        <Text size="xl" fw={800}>
          История смен
        </Text>
        <Text size="sm" c="dimmed">
          Сохранённые дни из локального хранилища. Скоро — синхронизация и отчёты.
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
        <SummaryCard label="Чистая прибыль" value={formatCurrency(summary.profit)} icon={<IconPigMoney size={18} />} color="teal" />
        <SummaryCard label="Всего заказов" value={summary.orders.toString()} icon={<IconWallet size={18} />} color="cyan" />
        <SummaryCard label="Наличные" value={formatCurrency(summary.cash)} icon={<IconPigMoney size={18} />} color="teal" />
        <SummaryCard label="Безнал" value={formatCurrency(summary.card)} icon={<IconCreditCard size={18} />} color="blue" />
      </SimpleGrid>

      <Group justify="space-between">
        <Text fw={700}>Сохраненные смены</Text>
        <Button size="compact-sm" leftSection={<IconRefresh size={16} />} variant="light" onClick={load} loading={loading}>
          Обновить
        </Button>
      </Group>

      {!days.length ? (
        <Card radius="md" withBorder>
          <Text c="dimmed">Нет сохраненных смен. Сохраните день из калькулятора.</Text>
        </Card>
      ) : (
        <Stack gap="sm">
          {days.map((day) => (
            <Card key={day.id} radius="md" withBorder>
              <Group justify="space-between" align="flex-start">
                <Stack gap={4}>
                  <Group gap="xs">
                    <Text fw={700}>{formatDate(day.date)}</Text>
                    <Badge variant="light">{day.orders.length} заказов</Badge>
                  </Group>
                  <Group gap="sm">
                    <Badge color="teal" variant="light">
                      Нал {formatCurrency(day.totals.totalCash)}
                    </Badge>
                    <Badge color="blue" variant="light">
                      Безнал {formatCurrency(day.totals.totalCard)}
                    </Badge>
                    <Badge color="gray" variant="light">
                      Расходы {formatCurrency(day.totals.extrasTotal)}
                    </Badge>
                  </Group>
                  <Text c="dimmed" size="sm">
                    Чистая прибыль: {formatCurrency(day.totals.netProfit)}
                  </Text>
                </Stack>
                <Group gap="xs">
                  <Button size="compact-sm" variant="light" onClick={() => setSelected(day)} leftSection={<IconReportAnalytics size={16} />}>
                    Детали
                  </Button>
                  <ActionIcon color="red" variant="subtle" onClick={() => handleDelete(day.id)} aria-label="Удалить смену">
                    <IconTrash size={18} />
                  </ActionIcon>
                </Group>
              </Group>
            </Card>
          ))}
        </Stack>
      )}

      <Modal opened={Boolean(selected)} onClose={() => setSelected(null)} title="Детализация дня" centered size="lg">
        {selected ? (
          <Stack gap="sm">
            <Text fw={600}>{formatDate(selected.date)}</Text>
            <Group gap="xs">
              <Badge color="teal" variant="light">
                Наличные {formatCurrency(selected.totals.totalCash)}
              </Badge>
              <Badge color="blue" variant="light">
                Безнал {formatCurrency(selected.totals.totalCard)}
              </Badge>
              <Badge color="gray" variant="light">
                Расходы {formatCurrency(selected.totals.extrasTotal)}
              </Badge>
            </Group>
            <Text>
              Чистая прибыль: <strong>{formatCurrency(selected.totals.netProfit)}</strong>
            </Text>
            <Stack gap={4}>
              {selected.orders.map((order) => (
                <Flex key={order.id} justify="space-between" gap="xs">
                  <Text>{formatCurrency(order.amount)}</Text>
                  <Group gap="xs">
                    <Badge size="sm" variant="light" color={order.paymentType === 'cash' ? 'teal' : 'blue'}>
                      {order.paymentType === 'cash' ? 'Наличные' : 'Безнал'}
                    </Badge>
                    {order.tips ? <Badge size="sm" color="yellow">Чаевые {formatCurrency(order.tips)}</Badge> : null}
                    {order.time ? <Badge size="sm">{order.time}</Badge> : null}
                  </Group>
                </Flex>
              ))}
            </Stack>
            {selected.notes ? (
              <Card radius="md" withBorder>
                <Text size="sm" c="dimmed">
                  Заметка
                </Text>
                <Text>{selected.notes}</Text>
              </Card>
            ) : null}
          </Stack>
        ) : null}
      </Modal>
    </Stack>
  )
}

function SummaryCard({
  label,
  value,
  icon,
  color = 'cyan',
}: {
  label: string
  value: string
  icon: ReactNode
  color?: string
}) {
  return (
    <Card radius="md" withBorder shadow="md" padding="md" style={{ backdropFilter: 'blur(4px)' }}>
      <Group gap="sm">
        <ThemeIcon variant="gradient" gradient={{ from: color, to: 'blue' }} radius="md">
          {icon}
        </ThemeIcon>
        <div>
          <Text size="sm" c="dimmed">
            {label}
          </Text>
          <Text fw={800}>{value}</Text>
        </div>
      </Group>
    </Card>
  )
}
