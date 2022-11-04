import ByteTable from '@components/ByteTable';
import Accordion from '@components/controls/Accordion';
import Checkbox from '@components/controls/Checkbox';
import DateForm from '@components/controls/DateForm';
import Form from '@components/controls/Form';
import Select from '@components/controls/NewSelect';
import Tabs from '@components/controls/Tabs';
import TimeForm from '@components/controls/TimeForm';
import { DetailedItemWrapper } from '@components/DetailedItemWrapper';
import { scale, withValidation } from '@scripts/helpers';
import typography from '@scripts/typography';
import { ReactNode, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import deepEqual from 'fast-deep-equal';

import {
  RtcState,
  setRtc,
  setRtcEnabled,
  setAlarmEnabled,
  rtcStateSchema,
} from '@store/timers/rtc';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { colors } from '@scripts/colors';
import Button from '@components/controls/Button';

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

  console.log('rehydrated', rehydrated);

  const form = useForm<RtcState>({
    defaultValues: rtc,
    ...withValidation(rtcStateSchema),
  });

  const registersData = useMemo(
    () =>
      form.getValues().rtcRegisters.map((e, i) => ({
        address: `R${i}`,
        value: e,
      })),
    [form],
  );

  const values = form.watch();
  const { setValue } = form;

  const onChangeRegister = useCallback(
    (rowIdx: number, value: number) => {
      const { rtcRegisters } = values;
      setValue(
        'rtcRegisters',
        rtcRegisters.map((e) => {
          if (e !== rowIdx) return e;
          return value;
        }),
      );
    },
    [setValue, values],
  );

  const isDirty = useMemo(() => !deepEqual(values, rtc), [values, rtc]);

  return (
    <Form
      methods={form}
      onSubmit={(vals) => {
        console.log(vals);

        dispatch(setRtc(vals));
      }}
      css={{ marginTop: scale(2) }}
    >
      {rtcEnabled && (
        <Form.Field name="rtcSource">
          <Select
            label="Тактирование от"
            options={[
              {
                key: 'Внешний осциллятор OSC32K',
                value: 1,
              },
              {
                key: 'Внутренний осциллятор LSI32K',
                value: 2,
              },
            ]}
          />
        </Form.Field>
      )}
      rtcSource: {values.rtcSource}
      <Accordion
        bordered
        css={{ marginTop: scale(2), marginBottom: scale(12) }}
      >
        {rtcEnabled && (
          <>
            <AccordionItem uuid="rtcDate" title="Дата и время RTC">
              <Form.Field name="rtcDate">
                <DateForm />
              </Form.Field>
              <Form.Field name="rtcTime">
                <TimeForm />
              </Form.Field>
            </AccordionItem>
            <AccordionItem uuid="rtcRegisters" title="Регистры RTC">
              {/* TODO: Form.Field-ready ByteTable OR <Controller /> */}
              <ByteTable
                data={registersData}
                onChangeRow={onChangeRegister}
                // onChangeData={(id, value) => {
                //   TODO: change form data
                //   dispatch(
                //     setRtcRegister({
                //       index: id,
                //       value,
                //     }),
                //   );
                // }}
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
      {isDirty && (
        <div
          css={{
            position: 'sticky',
            bottom: 0,
            background: colors.white,
            paddingTop: scale(2),
            paddingBottom: scale(2),
          }}
        >
          <Button size="sm" type="submit">
            Сохранить
          </Button>
        </div>
      )}
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
      <Tabs css={{ marginTop: scale(2), height: '100%' }}>
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
