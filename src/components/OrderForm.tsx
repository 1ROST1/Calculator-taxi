import { Button, Group, NumberInput, Select, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { nanoid } from 'nanoid/non-secure'
import type { PaymentType, OrderInput } from '../types'

type Props = {
  onAdd: (order: OrderInput) => void
  showTips: boolean
  showOrderTime: boolean
}

export function OrderForm({ onAdd, showTips, showOrderTime }: Props) {
  const form = useForm({
    initialValues: {
      amount: 0,
      paymentType: 'cash' as PaymentType,
      tips: 0,
      time: '',
    },
    validate: {
      amount: (value) => (value && value > 0 ? null : 'Введите сумму заказа'),
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    const order: OrderInput = {
      id: nanoid(10),
      amount: Number(values.amount) || 0,
      paymentType: values.paymentType,
      tips: showTips ? Number(values.tips || 0) : 0,
      time: showOrderTime ? values.time : undefined,
    }
    onAdd(order)
    form.reset()
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="sm">
        <Group gap="sm" grow wrap="nowrap">
          <NumberInput
            label="Стоимость заказа"
            placeholder="500"
            min={0}
            hideControls
            thousandSeparator=" "
            suffix=" ₽"
            {...form.getInputProps('amount')}
          />
          <Select
            label="Оплата"
            data={[
              { value: 'cash', label: 'Наличные' },
              { value: 'card', label: 'Безнал' },
            ]}
            {...form.getInputProps('paymentType')}
          />
        </Group>

        {showTips && (
          <NumberInput
            label="Чаевые"
            placeholder="0"
            min={0}
            hideControls
            thousandSeparator=" "
            suffix=" ₽"
            {...form.getInputProps('tips')}
          />
        )}

        {showOrderTime && (
          <TextInput
            label="Время заказа"
            placeholder="12:45"
            {...form.getInputProps('time')}
          />
        )}

        <Button type="submit" fullWidth>
          Добавить заказ
        </Button>
      </Stack>
    </form>
  )
}
