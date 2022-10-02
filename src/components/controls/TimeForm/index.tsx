import { colors } from '@scripts/colors';
import { scale } from '@scripts/helpers';
import { useMemo } from 'react';
import Select from '../Select';
import { SelectItemProps } from '../Select/types';

export interface TimeFormProps {
  value?: { hours: string; minutes: string; seconds: string };
  onChange?: (value: {
    hours: string | null;
    minutes: string | null;
    seconds: string | null;
  }) => void;
}

const getTerm = (val?: string | string | null) =>
  val === null ? 'XX' : `${val}`.padStart(2, '0');

const emptyLabel = 'Любое значение';

const TimeForm = ({ value, onChange }: TimeFormProps) => {
  const optionsHours = useMemo<SelectItemProps<string | null>[]>(
    () => [
      { label: emptyLabel, value: null },
      ...[...Array(24)].map((_, i) => ({
        value: `${i}`.padStart(2, '0'),
        label: `${i}`.padStart(2, '0'),
      })),
    ],
    [],
  );
  const optionsMinutes = useMemo<SelectItemProps<string | null>[]>(
    () => [
      { label: emptyLabel, value: null },
      ...[...Array(60)].map((_, i) => ({
        value: `${i}`.padStart(2, '0'),
        label: `${i}`.padStart(2, '0'),
      })),
    ],
    [],
  );

  const optionsSeconds = useMemo<SelectItemProps<string | null>[]>(
    () => [
      { label: emptyLabel, value: null },
      ...[...Array(60)].map((_, i) => ({
        value: `${i}`.padStart(2, '0'),
        label: `${i}`.padStart(2, '0'),
      })),
    ],
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
      <Select
        items={optionsHours}
        label="Часы"
        onChange={(hour) => {
          if (value) onChange?.({ ...value, hours: hour ? `${hour}` : null });
        }}
        selectedItem={optionsHours.find((e) => e.value === value?.hours)}
        isSearch
        emptyLabel={emptyLabel}
        css={{ marginBottom: scale(1) }}
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
        emptyLabel={emptyLabel}
        css={{ marginBottom: scale(1) }}
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
        emptyLabel={emptyLabel}
        css={{ marginBottom: scale(1) }}
      />
    </div>
  );
};

export default TimeForm;
