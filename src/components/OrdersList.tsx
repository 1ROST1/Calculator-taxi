import { ActionIcon, Badge, Card, Group, Stack, Text } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import type { OrderInput } from '../types'
import { formatCurrency } from '../lib/format'

type Props = {
  orders: OrderInput[]
  onRemove: (id: string) => void
  showTips: boolean
  showOrderTime: boolean
}

export function OrdersList({ orders, onRemove, showTips, showOrderTime }: Props) {
  if (!orders.length) {
    return (
      <Card radius="md" withBorder>
        <Text c="dimmed" ta="center">
          Заказы не добавлены
        </Text>
      </Card>
    )
  }

  return (
    <Stack>
      {orders.map((order) => (
        <Card
          key={order.id}
          radius="md"
          withBorder
          padding="md"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(21,170,191,0.05))',
            border: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <Group justify="space-between" align="flex-start">
            <div>
              <Group gap="xs">
                <Text fw={700}>{formatCurrency(order.amount)}</Text>
                <Badge variant="light" color={order.paymentType === 'cash' ? 'teal' : 'blue'}>
                  {order.paymentType === 'cash' ? 'Наличные' : 'Безнал'}
                </Badge>
              </Group>
              <Group gap="xs" mt={4}>
                {showTips && order.tips ? (
                  <Badge variant="dot" color="yellow">
                    Чаевые {formatCurrency(order.tips)}
                  </Badge>
                ) : null}
                {showOrderTime && order.time ? <Badge>{order.time}</Badge> : null}
              </Group>
            </div>
            <ActionIcon variant="subtle" color="red" onClick={() => onRemove(order.id)} aria-label="Удалить заказ">
              <IconTrash size={18} />
            </ActionIcon>
          </Group>
        </Card>
      ))}
    </Stack>
  )
}
