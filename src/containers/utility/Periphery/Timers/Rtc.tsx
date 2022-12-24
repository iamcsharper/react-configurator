import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode, useCallback, useMemo } from 'react';
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import ByteTable from '@components/ByteTable';
import { DetailsTrigger } from '@components/DetailsTrigger';
import { FormSticky } from '@components/FormSticky';
import { PeripheryWrapper } from '@components/PeripheryWrapper';
import FormUnsavedPrompt from '@components/UnsavedPrompt';
import Accordion from '@components/controls/Accordion';
import Checkbox from '@components/controls/Checkbox';
import CronDateForm from '@components/controls/CronDateForm';
import DateForm from '@components/controls/DateTimeForm';
import Form from '@components/controls/Form';
import FormControl from '@components/controls/FormControl';
import Select from '@components/controls/NewSelect';
import Tabs from '@components/controls/Tabs';

import { RootState } from '@store/index';
import { RtcSourceType, RtcState, rtcInitialState, rtcRegisterSchema, rtcStateSchema, setRtc } from '@store/timers/rtc';

import { colors } from '@scripts/colors';
import { scale } from '@scripts/helpers';
import typography from '@scripts/typography';

const AccordionItem = ({
  children,
  title,
  uuid,
}: {
  children: ReactNode[] | ReactNode;
  title: ReactNode;
  uuid: string;
}) => {
  const { formState } = useFormContext();
  const errors = formState.errors?.[uuid];
  let errorsLength = 0;

  if (Array.isArray(errors)) {
    errorsLength = errors.length;
  } else if (typeof errors === 'object') {
    if (errors.message) {
      errorsLength = 1;
    } else {
      errorsLength = Object.keys(errors).length;
    }
  }
  return (
    <Accordion.Item uuid={uuid}>
      <Accordion.Heading>
        <Accordion.Button>
          <div css={{ display: 'flex' }}>
            <span>{title}</span>
            {!!errorsLength && (
              <span
                css={{
                  marginLeft: 8,
                  width: 16,
                  height: 16,
                  background: colors.negative,
                  borderRadius: '100%',
                  color: colors.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...typography('labelExtraSmall'),
                }}
              >
                {errorsLength}
              </span>
            )}
          </div>
        </Accordion.Button>
      </Accordion.Heading>
      <Accordion.Panel>{children}</Accordion.Panel>
    </Accordion.Item>
  );
};

const ByteTableLabel = () => (
  <>
    Таблица регистров
    <DetailsTrigger
      title="Регистры RTC"
      description="Регистры RTC представляют собой 4 байтные значения, записываемые в регистры R0-R15."
    />
  </>
);

const byteTableLabelCSS = {
  display: 'flex',
  width: 'fit-content',
  gap: scale(1),
  alignItems: 'center',
};

const RegisterByteTable = () => {
  const form = useFormContext();
  const { control } = form;

  const label = useMemo(() => <ByteTableLabel />, []);

  const renderControlledByteTable = useCallback(
    ({ fieldState, field }: { field: ControllerRenderProps<any, any>; fieldState: ControllerFieldState }) => (
      <FormControl block labelCSS={byteTableLabelCSS} label={label} error={JSON.stringify(fieldState.error)}>
        <ByteTable {...field} defaultValue={rtcInitialState.rtcRegisters} validationSchema={rtcRegisterSchema} />
      </FormControl>
    ),
    [label]
  );

  return <Controller name="rtcRegisters" control={control} render={renderControlledByteTable} />;
};

const RtcSettings = () => {
  const [rtcEnabled, alarmEnabled] = useWatch({
    name: ['rtcEnabled', 'alarmEnabled'],
  });

  // TODO: preloader when will be on backend API
  // const rehydrated = useSelector<RootState, boolean>(
  //   // eslint-disable-next-line no-underscore-dangle
  //   (state) => state._persist.rehydrated,
  // );

  return (
    <>
      {rtcEnabled && (
        <Form.Field name="rtcSource">
          <Select
            label="Тактирование от"
            options={[
              {
                key: 'Внешний осциллятор OSC32K',
                value: RtcSourceType.External,
              },
              {
                key: 'Внутренний осциллятор LSI32K',
                value: RtcSourceType.Internal,
              },
            ]}
          />
        </Form.Field>
      )}
      <Accordion bordered css={{ marginTop: scale(2), marginBottom: scale(12) }}>
        {rtcEnabled && (
          <>
            <AccordionItem uuid="rtcDateTime" title="Дата и время RTC">
              <DetailsTrigger
                title="Дата RTC"
                description="Вы можете задавать дату для срабатывания прерывания. Срабатывает один раз."
              />
              <DateForm name="rtcDateTime" />
            </AccordionItem>
            <AccordionItem uuid="rtcRegisters" title="Регистры RTC">
              <RegisterByteTable />
            </AccordionItem>
          </>
        )}
        {alarmEnabled && (
          <AccordionItem uuid="alarmDateTime" title="Дата и время будильника">
            <DetailsTrigger
              title="Дата и время будильника"
              description="Вы можете задавать поля: век, год, месяц, день недели, день, часы, минуты и секунды. Сравнение происходит независимо по каждому из полей."
            />
            <CronDateForm name="alarmDateTime" />
          </AccordionItem>
        )}
      </Accordion>

      <FormUnsavedPrompt />
    </>
  );
};

const CommonSettings = () => {
  const form = useFormContext();

  const rtcEnabled = form.watch('rtcEnabled');

  return (
    <>
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: scale(1),
        }}
      >
        <Form.Field name="rtcEnabled">
          <Checkbox>Включить RTC</Checkbox>
        </Form.Field>
        <DetailsTrigger title="RTC" description="Информация об RTC" />
      </div>
      {rtcEnabled && (
        <div
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: scale(1),
          }}
        >
          <Form.Field name="alarmEnabled">
            <Checkbox>Включить будильник</Checkbox>
          </Form.Field>
          <DetailsTrigger title="Будильник" description="Информация о будильнике. Также можно выделять в группы)" />
        </div>
      )}
    </>
  );
};

const RtcForm = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const rtc = useSelector<RootState, RtcState>(state => state.timers.rtc);
  const form = useForm<RtcState>({
    defaultValues: rtc,
    mode: 'all',
    resolver: zodResolver(rtcStateSchema),
  });

  return (
    <div
      css={{
        minHeight: '100%',
        display: 'grid',
      }}
    >
      <Form
        methods={form}
        onSubmit={vals => {
          dispatch(setRtc(vals));
          form.reset(vals);
        }}
        onReset={() => {
          dispatch(setRtc(form.getValues()));
          form.reset();
        }}
        css={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {children}
      </Form>
    </div>
  );
};

const RtcInner = () => {
  const formContext = useFormContext();
  const rtc = useSelector<RootState, RtcState>(state => state.timers.rtc);

  const dispatch = useDispatch();
  return (
    <FormSticky
      onDefaultReset={() => {
        dispatch(setRtc(rtcInitialState));
        formContext.reset(rtcInitialState);
      }}
      onReset={() => {
        formContext.reset(rtc);
      }}
      css={{
        padding: scale(2),
        justifyContent: 'end',
      }}
    />
  );
};

const Rtc = () => (
  <RtcForm>
    <PeripheryWrapper title="Настройки RTC">
      <CommonSettings />
      <Tabs css={{ marginTop: scale(2) }} forceRenderTabPanel>
        <Tabs.List>
          <Tabs.Tab>Настройки</Tabs.Tab>
          <Tabs.Tab>Прерывания</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel>
          <RtcSettings />
        </Tabs.Panel>
        <Tabs.Panel>Interrupts</Tabs.Panel>
      </Tabs>
    </PeripheryWrapper>
    <RtcInner />
  </RtcForm>
);

export default Rtc;
