import { Button, Card, ColorInput, Group, SegmentedControl, Stack, Switch, Text } from '@mantine/core'
import { useSettings } from '../hooks/useSettings'

export function SettingsPage() {
  const { settings, updateSettings } = useSettings()

  return (
    <Stack gap="md">
      <Card radius="md" withBorder>
        <Stack gap="sm">
          <Text fw={700}>Что показывать</Text>
          <Switch
            label="Показывать время заказа"
            checked={settings.showOrderTime}
            onChange={(event) => updateSettings({ showOrderTime: event.currentTarget.checked })}
          />
          <Switch
            label="Учитывать чаевые"
            checked={settings.showTips}
            onChange={(event) => updateSettings({ showTips: event.currentTarget.checked })}
          />
          <Switch
            label="Отображать инфо-услуги"
            checked={settings.showInfoServiceCost}
            onChange={(event) => updateSettings({ showInfoServiceCost: event.currentTarget.checked })}
          />
          <Switch
            label="Отображать процент аренды"
            checked={settings.showRentPercent}
            onChange={(event) => updateSettings({ showRentPercent: event.currentTarget.checked })}
          />
          <Switch
            label="Показывать медика и механика"
            checked={settings.showMedicMechanic}
            onChange={(event) => updateSettings({ showMedicMechanic: event.currentTarget.checked })}
          />
          <Switch
            label="Вычитать аренду из прибыли"
            checked={settings.includeRentInProfit}
            onChange={(event) => updateSettings({ includeRentInProfit: event.currentTarget.checked })}
          />
        </Stack>
      </Card>

      <Card radius="md" withBorder>
        <Stack gap="sm">
          <Text fw={700}>Тема</Text>
          <Group>
            <Button
              variant={settings.colorScheme === 'light' ? 'filled' : 'light'}
              onClick={() => updateSettings({ colorScheme: 'light' })}
            >
              Светлая
            </Button>
            <Button
              variant={settings.colorScheme === 'dark' ? 'filled' : 'light'}
              onClick={() => updateSettings({ colorScheme: 'dark' })}
            >
              Тёмная
            </Button>
          </Group>
          <Text size="sm" c="dimmed">
            Акцентный цвет
          </Text>
          <SegmentedControl
            fullWidth
            value={settings.accentColor}
            onChange={(value) => updateSettings({ accentColor: value as typeof settings.accentColor })}
            data={[
              { label: 'Бирюза', value: 'cyan' },
              { label: 'Сине-зелёный', value: 'teal' },
              { label: 'Зелёный', value: 'green' },
              { label: 'Синий', value: 'blue' },
            ]}
          />
        </Stack>
      </Card>

      <Card radius="md" withBorder>
        <Stack gap="sm">
          <Text fw={700}>Кастомизация</Text>
          <Text size="sm" c="dimmed">
            Можно быстро подменить основные цвета для бренд-стиля.
          </Text>
          <ColorInput
            label="Брендовый цвет"
            value={accentColorHex(settings.accentColor)}
            onChange={() => {
              // ColorInput выводит выбранный цвет, но акцент задаётся пресетом выше.
            }}
            readOnly
          />
        </Stack>
      </Card>
    </Stack>
  )
}

function accentColorHex(color: string) {
  switch (color) {
    case 'teal':
      return '#12b886'
    case 'green':
      return '#2f9e44'
    case 'blue':
      return '#228be6'
    default:
      return '#15aabf'
  }
}
