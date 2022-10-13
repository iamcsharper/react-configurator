import ByteTable from '@components/ByteTable';
import Accordion from '@components/controls/Accordion';
import Checkbox from '@components/controls/Checkbox';
import DateForm from '@components/controls/DateForm';
import Form from '@components/controls/Form';
import Select from '@components/controls/Select';
import Tabs from '@components/controls/Tabs';
import TimeForm from '@components/controls/TimeForm';
import { DetailedItemWrapper } from '@components/DetailedItemWrapper';
import { scale } from '@scripts/helpers';
import typography from '@scripts/typography';
import { ReactNode, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  RtcState,
  setRtcRegister,
  setAlarmEnabled,
  setRtcEnabled,
  setRtcDate,
  setRtcSource,
} from '@store/timers/rtc';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/index';

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

const RtcSettings = () => {
  const dispatch = useDispatch();
  const rtc = useSelector<RootState, RtcState>((state) => state.timers.rtc);
  const rehydrated = useSelector<RootState, boolean>(
    // eslint-disable-next-line no-underscore-dangle
    (state) => state._persist.rehydrated,
  );
  const { rtcEnabled, alarmEnabled } = rtc;

  console.log(rehydrated);

  const form = useForm({
    defaultValues: rtc,
  });

  const rtcDate = form.watch('rtcDate');
  useEffect(() => {
    dispatch(setRtcDate(rtcDate));
  }, [dispatch, rtcDate]);

  const rtcSource = form.watch('rtcSource');
  useEffect(() => {
    // TODO: bug Select does not provider correct bindings
    console.log(rtcSource);
    dispatch(setRtcSource(rtcSource));
  }, [dispatch, rtcSource]);

  const [registers, setRegisters] = useState(() =>
    rtc.rtcRegisters.map((e, i) => ({
      address: `R${i}`,
      value: e,
    })),
  );

  return (
    <Form
      methods={form}
      onSubmit={(vals) => {
        console.log(vals);
      }}
      css={{ marginTop: scale(2) }}
    >
      {rtcEnabled && (
        <Form.Field name="rtc.clockingSource">
          <Select
            label="Тактирование от"
            items={[
              {
                label: 'Внешний осциллятор OSC32K',
                value: 1,
              },
              {
                label: 'Внутренний осциллятор LSI32K',
                value: 2,
              },
            ]}
          />
        </Form.Field>
      )}
      <Accordion
        bordered
        css={{ marginTop: scale(2), marginBottom: scale(12) }}
      >
        {rtcEnabled && (
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
            <AccordionItem uuid="rtc.registers" title="Регистры RTC">
              {/* TODO: Form.Field-ready ByteTable OR <Controller /> */}
              <ByteTable
                data={registers}
                setData={setRegisters}
                onChangeData={(id, value) => {
                  dispatch(
                    setRtcRegister({
                      index: id,
                      value,
                    }),
                  );
                }}
              />
            </AccordionItem>
          </>
        )}
        {alarmEnabled && (
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
  const dispatch = useDispatch();
  const rtc = useSelector<
    RootState,
    { rtcEnabled: boolean; alarmEnabled: boolean }
  >((state) => ({
    rtcEnabled: state.timers.rtc.rtcEnabled,
    alarmEnabled: state.timers.rtc.alarmEnabled,
  }));

  const { alarmEnabled, rtcEnabled } = rtc;

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

      <DetailedItemWrapper id="0" title="RTC" description="Информация об RTC">
        <Checkbox
          name="rtc"
          value="1"
          checked={rtcEnabled}
          onChange={(e) => {
            dispatch(setRtcEnabled(e.currentTarget.checked));
          }}
        >
          Включить RTC
        </Checkbox>
      </DetailedItemWrapper>
      {rtcEnabled && (
        <DetailedItemWrapper
          id="1"
          title="Будильник"
          description="Информация о будильнике. Также можно выделять в группы)"
        >
          <Checkbox
            name="alarm"
            value="1"
            checked={alarmEnabled}
            onChange={(e) => {
              dispatch(setAlarmEnabled(e.currentTarget.checked));
            }}
          >
            Будильник
          </Checkbox>
        </DetailedItemWrapper>
      )}
      <Tabs css={{ marginTop: scale(2) }}>
        <Tabs.List>
          <Tabs.Tab>Настройки</Tabs.Tab>
          <Tabs.Tab>Прерывания</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel>
          <RtcSettings />
        </Tabs.Panel>
        <Tabs.Panel>Interrupts</Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default Rtc;
