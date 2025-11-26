import { Card, Grid, Group, Progress, Stack, Text } from '@mantine/core'
import type { CalculationResult } from '../types'
import { formatCurrency } from '../lib/format'

type Props = {
  totals: CalculationResult
}

export function DaySummary({ totals }: Props) {
  const cashShare = totals.totalOrders ? Math.round((totals.totalCash / totals.totalOrders) * 100) : 0
  const cardShare = totals.totalOrders ? Math.round((totals.totalCard / totals.totalOrders) * 100) : 0

  return (
    <Card radius="md" withBorder>
      <Stack gap="xs">
        <Text fw={700}>Итого за день</Text>
        <Grid gutter="sm">
          <Grid.Col span={6}>
            <Stat label="Чистая прибыль" value={formatCurrency(totals.netProfit)} accent />
          </Grid.Col>
          <Grid.Col span={6}>
            <Stat label="Выручка" value={formatCurrency(totals.gross)} />
          </Grid.Col>
          <Grid.Col span={6}>
            <Stat label="Наличные" value={formatCurrency(totals.totalCash)} />
          </Grid.Col>
          <Grid.Col span={6}>
            <Stat label="Безнал" value={formatCurrency(totals.totalCard)} />
          </Grid.Col>
          <Grid.Col span={6}>
            <Stat label="Чаевые" value={formatCurrency(totals.totalTips)} />
          </Grid.Col>
          <Grid.Col span={6}>
            <Stat label="Расходы" value={formatCurrency(totals.extrasTotal)} />
          </Grid.Col>
          {totals.rentAmount ? (
            <Grid.Col span={12}>
              <Group justify="space-between" align="center">
                <Text size="sm" c="dimmed">
                  Наличные / Безнал
                </Text>
                <Text size="sm" c="dimmed">
                  Рента {formatCurrency(totals.rentAmount)}
                </Text>
              </Group>
            </Grid.Col>
          ) : (
            <Grid.Col span={12}>
              <Text size="sm" c="dimmed">
                Наличные / Безнал
              </Text>
            </Grid.Col>
          )}
          <Grid.Col span={12}>
            <Progress.Root size="md" radius="xl">
              <Progress.Section value={cashShare} color="teal" />
              <Progress.Section value={cardShare} color="blue" />
            </Progress.Root>
            <Group gap="xs" mt={6}>
              <BadgeLabel label="Наличные" value={cashShare} color="teal" />
              <BadgeLabel label="Безнал" value={cardShare} color="blue" />
            </Group>
          </Grid.Col>
        </Grid>
      </Stack>
    </Card>
  )
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <Stack gap={2}>
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <Text fw={accent ? 800 : 700} fz={accent ? 'lg' : 'md'}>
        {value}
      </Text>
    </Stack>
  )
}

function BadgeLabel({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Group gap={4}>
      <Text size="xs" c={color}>
        ●
      </Text>
      <Text size="xs" c="dimmed">
        {label} {value}%
      </Text>
    </Group>
  )
}
