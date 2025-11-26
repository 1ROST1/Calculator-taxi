import { useMemo, useState } from 'react'
import { Box, Button, Stack, Text, useMantineColorScheme } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import dayjs from 'dayjs'
import { calculateDay } from '../lib/calculator'
import { saveDay } from '../lib/db'
import { defaultSettings, useSettings } from '../hooks/useSettings'
import { formatCurrency } from '../lib/format'
import { DailyExtrasForm } from '../components/DailyExtrasForm'
import { OrderForm } from '../components/OrderForm'
import { OrdersList } from '../components/OrdersList'
import type { CalculationResult, DayExtras, DayRecord, OrderInput } from '../types'

const initialExtras: DayExtras = {
  dailyExpenses: 0,
  infoServiceCost: 0,
  rentPercent: 3,
  medicCost: 0,
  mechanicCost: 0,
}

export function CalculatorPage() {
  const { settings } = useSettings()
  const { colorScheme } = useMantineColorScheme()
  const [orders, setOrders] = useState<OrderInput[]>([])
  const [extras, setExtras] = useState<DayExtras>(initialExtras)
  const [date] = useState(dayjs().format('YYYY-MM-DD'))
  const [notes, setNotes] = useState('')

  const totals: CalculationResult = useMemo(
    () =>
      calculateDay({
        orders,
        extras,
        settings: settings || defaultSettings,
      }),
    [orders, extras, settings],
  )

  const handleAddOrder = (order: OrderInput) => {
    setOrders((prev) => [...prev, order])
  }

  const handleRemoveOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id))
  }

  const handleClear = () => {
    setOrders([])
    setExtras(initialExtras)
    setNotes('')
  }

  const handleSaveDay = async () => {
    if (!orders.length) {
      notifications.show({ color: 'yellow', title: 'Нет заказов', message: 'Добавьте хотя бы один заказ' })
      return
    }

    const record: DayRecord = {
      id: `${date}-${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}`,
      date,
      orders,
      notes,
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
  }

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 144px)',
      }}
    >
      <Box
        p="lg"
        style={{
          background: colorScheme === 'dark' ? '#212121' : '#ffffff',
          borderBottom: colorScheme === 'dark' ? '2px solid #2a2a2a' : '2px solid #e0e0e0',
        }}
      >
        <Stack gap="md">
          <Box>
            <Text size="sm" c="dimmed" fw={500} mb={4}>
              Заказов сегодня
            </Text>
            <Text size="48px" fw={900} lh={1}>
              {orders.length}
            </Text>
          </Box>

          <Box>
            <Text size="sm" c="dimmed" fw={500} mb={4}>
              Чистая прибыль
            </Text>
            <Text size="48px" fw={900} lh={1} c={totals.netProfit >= 0 ? 'teal' : 'red'}>
              {formatCurrency(totals.netProfit)}
            </Text>
          </Box>

          <Box
            p="md"
            style={{
              background: colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Text size="xs" c="dimmed" fw={500}>
                Наличные
              </Text>
              <Text size="xl" fw={700}>
                {formatCurrency(totals.totalCash)}
              </Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed" fw={500}>
                Безнал
              </Text>
              <Text size="xl" fw={700}>
                {formatCurrency(totals.totalCard)}
              </Text>
            </Box>
          </Box>
        </Stack>
      </Box>

      <Box style={{ flex: 1, overflow: 'auto' }} p="lg">
        <Stack gap="lg">
          <OrderForm onAdd={handleAddOrder} showTips={settings.showTips} showOrderTime={settings.showOrderTime} />

          {orders.length > 0 && (
            <Box>
              <Text size="sm" fw={700} mb="sm" c="dimmed">
                СПИСОК ЗАКАЗОВ ({orders.length})
              </Text>
              <OrdersList
                orders={orders}
                onRemove={handleRemoveOrder}
                showTips={settings.showTips}
                showOrderTime={settings.showOrderTime}
              />
            </Box>
          )}

          <DailyExtrasForm
            extras={extras}
            onChange={setExtras}
            notes={notes}
            onNotesChange={setNotes}
            showInfoServiceCost={settings.showInfoServiceCost}
            showRentPercent={settings.showRentPercent}
            showMedicMechanic={settings.showMedicMechanic}
          />
        </Stack>
      </Box>

      <Box
        p="lg"
        style={{
          borderTop: colorScheme === 'dark' ? '2px solid #2a2a2a' : '2px solid #e0e0e0',
          background: colorScheme === 'dark' ? '#212121' : '#ffffff',
        }}
      >
        <Stack gap="sm">
          <Button fullWidth size="xl" onClick={handleSaveDay} color="teal">
            Сохранить смену
          </Button>
          <Button fullWidth size="xl" variant="light" color="gray" onClick={handleClear}>
            Очистить
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}
