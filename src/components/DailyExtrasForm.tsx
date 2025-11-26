import { Card, Group, NumberInput, Stack, Text, Textarea } from '@mantine/core'
import type { DayExtras } from '../types'

type Props = {
  extras: DayExtras
  onChange: (extras: DayExtras) => void
  notes: string
  onNotesChange: (value: string) => void
  showInfoServiceCost: boolean
  showRentPercent: boolean
  showMedicMechanic: boolean
}

export function DailyExtrasForm({
  extras,
  onChange,
  notes,
  onNotesChange,
  showInfoServiceCost,
  showRentPercent,
  showMedicMechanic,
}: Props) {
  const handleChange = <K extends keyof DayExtras>(key: K, value: number | string) => {
    onChange({ ...extras, [key]: Number(value) || 0 })
  }

  return (
    <Card
      radius="md"
      withBorder
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(21,170,191,0.05))',
        border: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <Card.Section inheritPadding py="sm">
        <Text fw={700}>Расходы и аренда</Text>
        <Text size="sm" c="dimmed">
          Управляйте доп. расходами и влиянием аренды в расчёте.
        </Text>
      </Card.Section>
      <Card.Section inheritPadding py="sm">
        <Stack gap="sm">
          <NumberInput
            label="Ежедневные расходы"
            placeholder="1000"
            min={0}
            hideControls
            thousandSeparator=" "
            suffix=" ₽"
            value={extras.dailyExpenses}
            onChange={(value) => handleChange('dailyExpenses', value || 0)}
          />

          {showInfoServiceCost && (
            <NumberInput
              label="Информационные услуги"
              placeholder="300"
              min={0}
              hideControls
              thousandSeparator=" "
              suffix=" ₽"
              value={extras.infoServiceCost}
              onChange={(value) => handleChange('infoServiceCost', value || 0)}
            />
          )}

          {showRentPercent && (
            <NumberInput
              label="Процент аренды"
              placeholder="3%"
              min={0}
              max={100}
              hideControls
              suffix=" %"
              value={extras.rentPercent}
              onChange={(value) => handleChange('rentPercent', value || 0)}
            />
          )}

          {showMedicMechanic && (
            <Group grow>
              <NumberInput
                label="Медик"
                min={0}
                hideControls
                thousandSeparator=" "
                suffix=" ₽"
                value={extras.medicCost}
                onChange={(value) => handleChange('medicCost', value || 0)}
              />
              <NumberInput
                label="Механик"
                min={0}
                hideControls
                thousandSeparator=" "
                suffix=" ₽"
                value={extras.mechanicCost}
                onChange={(value) => handleChange('mechanicCost', value || 0)}
              />
            </Group>
          )}

          <Textarea
            label="Заметка"
            placeholder="Коротко о смене"
            minRows={2}
            autosize
            value={notes}
            onChange={(event) => onNotesChange(event.currentTarget.value)}
          />
        </Stack>
      </Card.Section>
    </Card>
  )
}
