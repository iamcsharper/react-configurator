import Accordion from '@components/controls/Accordion';
import Checkbox from '@components/controls/Checkbox';
import DateForm, { DateFormValues } from '@components/controls/DateForm';
import Form from '@components/controls/Form';
import Select from '@components/controls/Select';
import Tabs from '@components/controls/Tabs';
import TimeForm, { TimeFormValues } from '@components/controls/TimeForm';
import { DetailedItemWrapper } from '@components/DetailedItemWrapper';
import { scale } from '@scripts/helpers';
import typography from '@scripts/typography';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';

const DetailedField = ({
  label,
  name,
  description,
}: {
  label: string;
  name: string;
  description: string;
}) => (
  <DetailedItemWrapper id={name} title={label} description={description}>
    <Form.Field name={name} label={label} />
  </DetailedItemWrapper>
);

const AccordionItem = ({
  children,
  title,
  uuid,
}: {
  children: ReactNode[] | ReactNode;
  title: string;
  uuid: string;
}) => (
  <Accordion.Item uuid={uuid}>
    <Accordion.Heading>
      <Accordion.Button>{title}</Accordion.Button>
    </Accordion.Heading>
    <Accordion.Panel>{children}</Accordion.Panel>
  </Accordion.Item>
);

interface RtcData {
  rtc: {
    clockingSource: string;
    time: TimeFormValues;
    date: DateFormValues;
  };
  alarm: {};
}

const RtcSettings = ({
  isAlarmEnabled,
  isRtcEnabled,
}: {
  isAlarmEnabled: boolean;
  isRtcEnabled: boolean;
}) => {
  const form = useForm<RtcData>({
    defaultValues: {
      rtc: {
        clockingSource: '',
        time: {
          hours: null,
          minutes: null,
          seconds: null,
        },
        date: {
          century: null,
          day: null,
          month: null,
          weekDay: null,
          year: null,
        },
      },
      alarm: {},
    },
  });

  return (
    <Form
      methods={form}
      onSubmit={(vals) => console.log(vals)}
      css={{ marginTop: scale(2) }}
    >
      {isRtcEnabled && (
        <Form.Field name="rtc.clockingSource">
          <Select
            label="Тактирование от"
            items={[
              {
                label: 'Внешний осциллятор OSC32K',
                value: 0,
              },
              {
                label: 'Внутренний осциллятор LSI32K',
                value: 1,
              },
            ]}
          />
        </Form.Field>
      )}
      <Accordion bordered css={{ marginTop: scale(2) }}>
        {isRtcEnabled && (
          <>
            <AccordionItem uuid="rtc.date" title="Дата RTC">
              <Form.Field name="rtc.date">
                <DateForm />
              </Form.Field>
            </AccordionItem>
            <AccordionItem uuid="rtc.time" title="Время RTC">
              <Form.Field name="rtc.time">
                {/* <TimePicker /> */}
                <TimeForm />
              </Form.Field>
            </AccordionItem>
            <AccordionItem uuid="rtc.gpio" title="Регистры RTC">
              gpio
            </AccordionItem>
          </>
        )}
        {isAlarmEnabled && (
          <>
            <AccordionItem uuid="alarm.time" title="Время будильника">
              todo
            </AccordionItem>
            <AccordionItem uuid="alarm.date" title="Дата будильника">
              <DetailedField
                description="Число от 0 до 21"
                label="Век"
                name="dateCentury"
              />
              Вообще здесь будет нормальный календарь.
            </AccordionItem>
            <AccordionItem uuid="alarm.clockTime" title="Время будильника">
              todo
            </AccordionItem>
          </>
        )}
      </Accordion>
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
        minHeight: '100%',
        padding: scale(2),
      }}
    >
      <h4 css={{ marginBottom: scale(2), ...typography('h4') }}>
        Настройки RTC
      </h4>
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
      <Tabs css={{ marginTop: scale(2) }}>
        <Tabs.List>
          <Tabs.Tab>Настройки</Tabs.Tab>
          <Tabs.Tab>Прерывания</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel>
          <RtcSettings
            isAlarmEnabled={isAlarmEnabled}
            isRtcEnabled={isRtcEnabled}
          />
        </Tabs.Panel>
        <Tabs.Panel>Interrupts</Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default Rtc;
