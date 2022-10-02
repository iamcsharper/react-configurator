import { colors } from '@scripts/colors';
import { scale } from '@scripts/helpers';
import { forwardRef, useMemo } from 'react';
import Select from '../Select';
import { SelectItemProps } from '../Select/types';

export interface TimeFormValues {
  hours: string | null;
  minutes: string | null;
  seconds: string | null;
}

export interface TimeFormProps {
  value?: TimeFormValues;
  onChange?: (value: TimeFormValues) => void;
}

const getTerm = (val?: string | string | null) =>
  val === null ? 'XX' : `${val}`.padStart(2, '0');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TimeForm = ({ value, onChange }: TimeFormProps, _ref: any) => {
  const optionsHours = useMemo<SelectItemProps<string | null>[]>(
    () =>
      [...Array(24)].map((_, i) => ({
        value: `${i}`.padStart(2, '0'),
        label: `${i}`.padStart(2, '0'),
      })),
    [],
  );
  const optionsMinutes = useMemo<SelectItemProps<string | null>[]>(
    () =>
      [...Array(60)].map((_, i) => ({
        value: `${i}`.padStart(2, '0'),
        label: `${i}`.padStart(2, '0'),
      })),
    [],
  );

  const optionsSeconds = useMemo<SelectItemProps<string | null>[]>(
    () =>
      [...Array(60)].map((_, i) => ({
        value: `${i}`.padStart(2, '0'),
        label: `${i}`.padStart(2, '0'),
      })),
    [],
  );

  const formatted = useMemo(
    () => [value?.hours, value?.minutes, value?.seconds].map(getTerm).join(':'),
    [value],
  );

  return (
    <div>
      <div
        css={{
          border: `1px solid ${colors?.autofill}`,
          padding: scale(1),
          marginBottom: scale(1),
        }}
      >
        <strong>Выбрано время:</strong>
        <p>{formatted}</p>
      </div>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: scale(1),
        }}
      >
        <Select
          items={optionsHours}
          label="Часы"
          onChange={(hour) => {
            if (value) onChange?.({ ...value, hours: hour ? `${hour}` : null });
          }}
          selectedItem={optionsHours.find((e) => e.value === value?.hours)}
          isSearch
          applyOnExactLabel
          emptyValue={null}
        />
        <Select
          items={optionsMinutes}
          label="Минуты"
          onChange={(minute) => {
            if (value)
              onChange?.({ ...value, minutes: minute ? `${minute}` : null });
          }}
          selectedItem={optionsMinutes.find((e) => e.value === value?.minutes)}
          isSearch
          applyOnExactLabel
          emptyValue={null}
        />
        <Select
          items={optionsSeconds}
          label="Секунды"
          onChange={(second) => {
            if (value)
              onChange?.({ ...value, seconds: second ? `${second}` : null });
          }}
          selectedItem={optionsSeconds.find((e) => e.value === value?.seconds)}
          isSearch
          applyOnExactLabel
          emptyValue={null}
        />
      </div>
    </div>
  );
};

export default forwardRef(TimeForm);
