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
import { ReactNode, useCallback } from 'react';
import {
  useFormContext,
  Controller,
  useForm,
  ControllerRenderProps,
  ControllerFieldState,
} from 'react-hook-form';

import {
  rtcInitialState,
  RtcState,
  setRtc,
  rtcStateSchema,
  rtcRegisterSchema,
} from '@store/timers/rtc';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { colors } from '@scripts/colors';

import FormControl from '@components/controls/FormControl';
import { useCallbackPrompt } from '@scripts/hooks/useCallbackPrompt';
import UnsavedPrompt from '@components/UnsavedPrompt';
import { FormSticky } from '@components/FormSticky';
import { useIsDirty } from '@scripts/hooks/useIsDirty';

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

const RegisterByteTable = () => {
  const form = useFormContext();
  const { control } = form;

  const renderControlledByteTable = useCallback(
    ({
      fieldState,
      field,
    }: {
      field: ControllerRenderProps<any, any>;
      fieldState: ControllerFieldState;
    }) => (
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
    ),
    [],
  );

  return (
    <Controller
      name="rtcRegisters"
      control={control}
      render={renderControlledByteTable}
    />
  );
};

const RtcSettings = () => {
  const form = useFormContext();

  const rtcEnabled = form.watch('rtcEnabled');
  const alarmEnabled = form.watch('alarmEnabled');

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
              <DetailsTrigger
                title="Дата RTC"
                description="Вы можете задавать дату для срабатывания прерывания. При отсутствии выбора считается за любое значение."
              />
              <DateForm name="rtcDateTime" />
            </AccordionItem>
            <AccordionItem uuid="rtcRegisters" title="Регистры RTC">
              <RegisterByteTable />
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
    </>
  );
};

const Rtc = () => {
  const dispatch = useDispatch();
  const rtc = useSelector<RootState, RtcState>((state) => state.timers.rtc);

  const form = useForm<RtcState>({
    defaultValues: rtc,
    ...withValidation(rtcStateSchema),
  });

  console.log('Rtc re-rendered. form=', form.getValues(), 'rtc=', rtc);

  const rtcEnabled = form.watch('rtcEnabled');

  const { isDirty, isDefaultDirty } = useIsDirty(form, rtc, rtcInitialState);
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(isDirty);

  return (
    <div
      css={{
        minHeight: '100%',
        display: 'grid',
      }}
    >
      <Form
        methods={form}
        onSubmit={(vals) => {
          const newRtc = {
            ...vals,
            rtcDateTime: {
              ...vals.rtcDateTime,
              day: +vals.rtcDateTime.day,
              year: +vals.rtcDateTime.year,
            },
          };
          console.log('submit vals:', newRtc);
          dispatch(setRtc(newRtc));
          form.reset(newRtc);
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
        <div
          css={{
            padding: scale(2),
            height: '100%',
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
              <DetailsTrigger
                title="Будильник"
                description="Информация о будильнике. Также можно выделять в группы)"
              />
            </div>
          )}
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
        </div>
        <FormSticky
          isDirty={isDirty}
          isDefaultDirty={isDefaultDirty}
          onDefaultReset={() => {
            dispatch(setRtc(rtcInitialState));
            form.reset(rtcInitialState);
          }}
          css={{
            padding: scale(2),
            justifyContent: 'end',
          }}
        />
      </Form>
      <UnsavedPrompt
        isOpen={showPrompt}
        confirmNavigation={confirmNavigation}
        cancelNavigation={cancelNavigation}
      />
    </div>
  );
};

export default Rtc;
