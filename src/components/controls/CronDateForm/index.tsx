import { colors } from '@scripts/colors';
import { scale } from '@scripts/helpers';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { parseSafeInt, getClosestDates } from './getClosestDates';

import Mask from '../Mask';
import { Select, OptionShape } from '../NewSelect';
import Button from '../Button';

export interface DateFormValues {
  day: number | null;
  month: number | null; // 0 ... 11, 0 - январь
  year: number | null;
}

export interface DateFormProps {
  // Controlled
  value?: DateFormValues;
  onChange?: (value: DateFormValues) => void;
}

const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CronDateForm = ({ value, onChange }: DateFormProps, _ref?: any) => {
  const optionsMonths = useMemo<OptionShape[]>(
    () => [
      {
        key: 'Любой',
        content: 'Любой',
        value: '',
      },
      ...months.map((month, index) => ({
        key: month,
        value: index,
      })),
    ],
    [],
  );

  const [year, setYear] = useState(`${value?.year || ''}`);
  const [day, setDay] = useState(`${value?.day || ''}`);

  useEffect(() => {
    setYear(`${value?.year}`);
  }, [value?.year]);

  useEffect(() => {
    setDay(`${value?.day}`);
  }, [value?.day]);

  const selectedMonth =
    optionsMonths.find((e) => e.value === value?.month) || null;

  const month = selectedMonth?.value;

  const [closestDate, setClosestDate] = useState('...');

  useEffect(() => {
    const dates = getClosestDates({ day, month, year, length: 4 });

    const closestDates = dates.map((e) => e.toLocaleDateString()).join(', ');

    setTimeout(() => {
      setClosestDate(closestDates);
    }, 0);
  }, [day, month, year]);

  const error = !closestDate.length; // TODO: from zod

  return (
    <div>
      <div
        css={{
          border: `1px solid ${colors?.autofill}`,
          padding: scale(1),
          marginBottom: scale(1),
        }}
      >
        <strong>Даты ближайшего повторения:</strong>
        <div
          css={{
            marginTop: scale(1),
          }}
        >
          {closestDate || 'N/A'}
        </div>
      </div>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: scale(1),
        }}
      >
        <div>
          <Mask
            label="Год"
            mask="0000"
            value={year}
            autoComplete="off"
            onBlur={(e) => {
              e.preventDefault();

              if (!error) {
                onChange?.({
                  ...value!,
                  year: parseSafeInt(e.target.value),
                });
              }
            }}
            size="md"
            error={error}
            onAccept={(newVal) => {
              setYear(newVal);
            }}
          />
        </div>
        <Select
          options={optionsMonths}
          label="Месяц"
          error={error}
          onChange={(month) => {
            if (value) {
              onChange?.({
                ...value,
                month: month?.selected?.value,
              });
            }
          }}
          selected={selectedMonth}
        />
        <div>
          <Mask
            label="Число"
            mask={Number}
            min={1}
            error={error}
            max={31}
            lazy={false}
            value={day}
            autoComplete="off"
            onBlur={(e) => {
              e.preventDefault();

              if (!error) {
                onChange?.({
                  ...value!,
                  day: parseSafeInt(e.target.value),
                });
              }
            }}
            size="md"
            // error={error}
            onAccept={(newVal) => {
              setDay(newVal);
            }}
          />
        </div>
      </div>
      {onChange && (
        <div css={{ marginTop: scale(1) }}>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              const date = new Date();
              const month = date.getMonth();
              const year = date.getFullYear();
              const day = date.getDate();

              console.log('day:', day, 'month:', month, 'year:', year);

              onChange({
                day,
                month,
                year,
              });
            }}
          >
            Взять дату с компьютера
          </Button>
        </div>
      )}
    </div>
  );
};

export default forwardRef(CronDateForm);
