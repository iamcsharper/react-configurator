import Accordion from '@components/controls/Accordion';
import Checkbox from '@components/controls/Checkbox';
import Form from '@components/controls/Form';
import Select from '@components/controls/Select';
import Tabs from '@components/controls/Tabs';
import { DetailedItemWrapper } from '@components/DetailedItemWrapper';
import { scale } from '@scripts/helpers';
import { useForm } from 'react-hook-form';

const RtcSettings = ({ isAlarmEnabled }: { isAlarmEnabled: boolean }) => {
  const form = useForm({
    defaultValues: { clockingSource: '' },
  });

  return (
    <Form
      methods={form}
      onSubmit={(vals) => console.log(vals)}
      css={{ marginTop: scale(2) }}
    >
      <Form.Field name="clockingSource">
        <Select
          label="Тактирование от"
          items={[
            {
              label: 'Внешний осциллятор OSC32K (LSE)',
              value: 0,
            },
            {
              label: 'Внутренний осциллятор OSC32K (LSI)',
              value: 1,
            },
          ]}
        />
      </Form.Field>
      {isAlarmEnabled && (
        <Accordion bordered css={{ marginTop: scale(2) }}>
          <Accordion.Item uuid="time">
            <Accordion.Heading>
              <Accordion.Button>Время</Accordion.Button>
            </Accordion.Heading>
            <Accordion.Panel>todo</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item uuid="date">
            <Accordion.Heading>
              <Accordion.Button>Дата</Accordion.Button>
            </Accordion.Heading>
            <Accordion.Panel>
              <DetailedItemWrapper
                id="dateCentury"
                title="Век"
                description="Число от 0 до 21"
              >
                <Form.Field name="dateCentury" label="Век" />
              </DetailedItemWrapper>
              Вообще здесь будет нормальный календарь.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item uuid="gpio">
            <Accordion.Heading>
              <Accordion.Button>Регистры общего назначения</Accordion.Button>
            </Accordion.Heading>
            <Accordion.Panel>todo</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item uuid="clockTime">
            <Accordion.Heading>
              <Accordion.Button>Время будильника</Accordion.Button>
            </Accordion.Heading>
            <Accordion.Panel>todo</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item uuid="clockDate">
            <Accordion.Heading>
              <Accordion.Button>Дата будильника</Accordion.Button>
            </Accordion.Heading>
            <Accordion.Panel>todo</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item uuid="clockCmp">
            <Accordion.Heading>
              <Accordion.Button>Сравнение будильника</Accordion.Button>
            </Accordion.Heading>
            <Accordion.Panel>todo</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      )}
    </Form>
  );
};

const Rtc = () => {
  const form = useForm({
    defaultValues: { rtc: false, alarm: false },
  });

  const isRtcEnabled = form.watch('rtc');
  const isAlarmEnabled = form.watch('alarm');

  return (
    <div
      css={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: scale(1),
        padding: scale(2),
      }}
    >
      <h4>Настройки RTC</h4>
      <Form methods={form} onSubmit={(vals) => console.log(vals)}>
        <DetailedItemWrapper id="0" title="RTC" description="Информация об RTC">
          <Form.Field name="rtc">
            <Checkbox value="1" forceControlled>
              Включить RTC
            </Checkbox>
          </Form.Field>
        </DetailedItemWrapper>
        <DetailedItemWrapper
          id="1"
          title="Будильник"
          description="Информация о будильнике. Также можно выделять в группы)"
        >
          <Form.Field name="alarm">
            <Checkbox value="1" forceControlled>
              Будильник
            </Checkbox>
          </Form.Field>
        </DetailedItemWrapper>
        {/* <button type="submit">Submit</button> */}
      </Form>
      {isRtcEnabled && (
        <Tabs>
          <Tabs.List>
            <Tabs.Tab>Настройки</Tabs.Tab>
            <Tabs.Tab>Прерывания</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel>
            <RtcSettings isAlarmEnabled={isAlarmEnabled} />
          </Tabs.Panel>
          <Tabs.Panel>Interrupts</Tabs.Panel>
        </Tabs>
      )}
    </div>
  );
};

export default Rtc;
