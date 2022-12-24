import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode } from 'react';
import { useForm, useFormContext, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { DetailsTrigger } from '@components/DetailsTrigger';
import { FormSticky } from '@components/FormSticky';
import { PeripheryWrapper } from '@components/PeripheryWrapper';
import FormUnsavedPrompt from '@components/UnsavedPrompt';
import Checkbox from '@components/controls/Checkbox';
import Form from '@components/controls/Form';
import Select from '@components/controls/NewSelect';
import Tabs from '@components/controls/Tabs';

import { AdcChannel, AdcState, VRef, adcInitialState, adcStateSchema, setAdc } from '@store/analog/adc';
import { RootState } from '@store/index';

import { scale } from '@scripts/helpers';

const AdcSettings = () => {
  const [adcEnabled] = useWatch({
    name: ['enabled'],
  });

  if (!adcEnabled) return null;

  return (
    <>
      <Form.Field name="channel" css={{ marginBottom: scale(2) }}>
        <Select
          label={
            <div css={{ display: 'flex', gap: scale(1) }}>
              <span>Канал</span>
              <DetailsTrigger title="Канал АЦП" description="Информация о канале. TODO" />
            </div>
          }
          options={Object.keys(AdcChannel).map(name => ({ key: name, value: (AdcChannel as any)[name] }))}
        />
      </Form.Field>
      <Form.Field name="vRef">
        <Select
          label={
            <div css={{ display: 'flex', gap: scale(1) }}>
              <span>Источник опорного напряжения</span>
              <DetailsTrigger
                title="Источник опорного напряжения"
                description="Информация об источнике опорного напряжения. TODO"
              />
            </div>
          }
          options={[
            {
              value: VRef.INNER,
              key: 'Внутернний',
            },
            {
              value: VRef.CALIBRATABLE,
              key: 'Настраиваемый',
            },
            {
              value: VRef.ADC_REF,
              key: 'Внешний вывод ADC_REF',
            },
          ]}
        />
      </Form.Field>
      <FormUnsavedPrompt />
    </>
  );
};

const CommonSettings = () => (
  <div
    css={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scale(1),
    }}
  >
    <Form.Field name="enabled">
      <Checkbox>Включить ADC</Checkbox>
    </Form.Field>
    <DetailsTrigger title="ADC" description="Информация об ADC" />
  </div>
);

const AdcForm = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const adc = useSelector<RootState, AdcState>(state => state.analog.adc);
  const form = useForm<AdcState>({
    defaultValues: adc,
    mode: 'all',
    resolver: zodResolver(adcStateSchema),
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
          dispatch(setAdc(vals));
          form.reset(vals);
        }}
        onReset={() => {
          dispatch(setAdc(form.getValues()));
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

const AdcInner = () => {
  const formContext = useFormContext();
  const adc = useSelector<RootState, AdcState>(state => state.analog.adc);

  const dispatch = useDispatch();
  return (
    <FormSticky
      onDefaultReset={() => {
        dispatch(setAdc(adcInitialState));
        formContext.reset(adcInitialState);
      }}
      onReset={() => {
        formContext.reset(adc);
      }}
      css={{
        padding: scale(2),
        justifyContent: 'end',
      }}
    />
  );
};

const Adc = () => (
  <AdcForm>
    <PeripheryWrapper title="Настройки ADC">
      <CommonSettings />
      <Tabs css={{ marginTop: scale(2) }} forceRenderTabPanel>
        <Tabs.List>
          <Tabs.Tab>Настройки</Tabs.Tab>
          <Tabs.Tab>Прерывания</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel>
          <AdcSettings />
        </Tabs.Panel>
        <Tabs.Panel>Interrupts</Tabs.Panel>
      </Tabs>
    </PeripheryWrapper>
    <AdcInner />
  </AdcForm>
);

export default Adc;
