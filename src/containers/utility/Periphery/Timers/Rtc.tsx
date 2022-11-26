import ByteTable from '@components/ByteTable';
import Accordion from '@components/controls/Accordion';
import Checkbox from '@components/controls/Checkbox';
import DateForm from '@components/controls/DateTimeForm';
import Form from '@components/controls/Form';
import Select from '@components/controls/NewSelect';
import Tabs from '@components/controls/Tabs';
import { DetailsTrigger } from '@components/DetailsTrigger';
import { scale, withValidation } from '@scripts/helpers';
import typography from '@scripts/typography';
import { ReactNode, useMemo } from 'react';
import { useFormContext, Controller, useForm } from 'react-hook-form';
import deepEqual from 'fast-deep-equal';

import {
  rtcInitialState,
  RtcState,
  setRtc,
  setRtcEnabled,
  setAlarmEnabled,
  rtcStateSchema,
  rtcRegisterSchema,
} from '@store/timers/rtc';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { colors } from '@scripts/colors';
import Button from '@components/controls/Button';
import FormControl from '@components/controls/FormControl';
import { useCallbackPrompt } from '@scripts/hooks/useCallbackPrompt';
import UnsavedPrompt from '@components/UnsavedPrompt';

// const DetailedField = ({
//   label,
//   name,
//   description,
// }: {
//   label: string;
//   name: string;
//   description: string;
// }) => (
//   <DetailedItemWrapper id={name} title={label} description={description}>
//     <Form.Field name={name} label={label} />
//   </DetailedItemWrapper>
// );

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

const RtcSettings = () => {
  const dispatch = useDispatch();
  const rtc = useSelector<RootState, RtcState>((state) => state.timers.rtc);

  // TODO: preloader when will be on backend API
  // const rehydrated = useSelector<RootState, boolean>(
  //   // eslint-disable-next-line no-underscore-dangle
  //   (state) => state._persist.rehydrated,
  // );

  const { rtcEnabled, alarmEnabled } = rtc;

  const form = useForm<RtcState>({
    defaultValues: rtc,
    ...withValidation(rtcStateSchema),
  });

  const values = form.watch();
  const { control } = form;

  const isDirty = useMemo(() => !deepEqual(values, rtc), [values, rtc]);

  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(isDirty);

  return (
    <>
      <Form
        methods={form}
        onSubmit={(vals) => {
          form.setValue('rtcEnabled', rtcEnabled);
          form.setValue('alarmEnabled', alarmEnabled);

          dispatch(
            setRtc({
              ...vals,
              rtcEnabled,
              alarmEnabled,
            }),
          );
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
        <Accordion
          bordered
          css={{ marginTop: scale(2), marginBottom: scale(12) }}
        >
          {rtcEnabled && (
            <>
              <AccordionItem uuid="rtcDateTime" title="Дата и время RTC">
                <Form.Field name="rtcDateTime">
                  <DetailsTrigger
                    title="Дата RTC"
                    description="Вы можете задавать дату для срабатывания прерывания. При отсутствии выбора считается за любое значение."
                  />
                  <DateForm />
                </Form.Field>
              </AccordionItem>
              <AccordionItem uuid="rtcRegisters" title="Регистры RTC">
                {/* {JSON.stringify(values.rtcRegisters)} */}
                <Controller
                  name="rtcRegisters"
                  control={control}
                  render={({ fieldState, field }) => (
                    <FormControl
                      block
                      labelCSS={{
                        display: 'flex',
                        width: 'fit-content',
                        gap: scale(1),
                        alignItems: 'center',
                      }}
                      label={
                        <>
                          Таблица регистров
                          <DetailsTrigger
                            title="Регистры RTC"
                            description="Регистры RTC представляют собой 4 байтные значения, записываемые в регистры R0-R15."
                          />
                        </>
                      }
                      error={JSON.stringify(fieldState.error)}
                    >
                      <ByteTable
                        {...field}
                        defaultValue={rtcInitialState.rtcRegisters}
                        validationSchema={rtcRegisterSchema}
                      />
                    </FormControl>
                  )}
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
                {/* <DetailedField
                description="Число от 0 до 21"
                label="Век"
                name="dateCentury"
              /> */}
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
      <UnsavedPrompt
        isOpen={showPrompt}
        confirmNavigation={confirmNavigation}
        cancelNavigation={cancelNavigation}
      />
    </>
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

      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: scale(1),
        }}
      >
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
          <DetailsTrigger
            title="Будильник"
            description="Информация о будильнике. Также можно выделять в группы)"
          />
        </div>
      )}
      <Tabs css={{ marginTop: scale(2), height: '100%' }} forceRenderTabPanel>
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
