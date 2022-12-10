import { colors } from '@scripts/colors';
import { parseSafeInt, scale } from '@scripts/helpers';
import { forwardRef, useEffect, useMemo } from 'react';

import { useFormContext } from 'react-hook-form';

import Mask from '../Mask';
import Select, { OptionShape } from '../NewSelect';
import Button from '../Button';
import Form from '../Form';

export interface DateTimeFormValues {
  weekDay: number | null;
  day: number | null;
  month: number | null; // 0 ... 11, 0 - январь
  year: number | null;

  hours: number | null;
  minutes: number | null;
  seconds: number | null;
}

export interface DateFormProps {
  name: string;
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

const getTerm = (val: number | null) =>
  val === null ? 'XX' : `${val}`.padStart(2, '0');

const optionsHours = [...Array(24)].map((_, i) => ({
  value: i,
  key: `${i}`.padStart(2, '0'),
}));

const optionsMinutes = [...Array(60)].map((_, i) => ({
  value: i,
  key: `${i}`.padStart(2, '0'),
}));

const optionsSeconds = [...Array(60)].map((_, i) => ({
  value: i,
  key: `${i}`.padStart(2, '0'),
}));

const valueToDate = (year: any, month: any, day: any) => {
  const monthStr = `${Number(month) + 1}`.padStart(2, '0');
  const dayStr = `${day}`.padStart(2, '0');
  const dateStr = `${monthStr}-${dayStr}-${year}`;
  const tryDate = new Date(dateStr);

  if (tryDate.getMonth() !== month) {
    return undefined;
  }

  return tryDate;
};

const DateForm = (
  { name }: DateFormProps,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _ref?: any,
) => {
  const optionsMonths = useMemo<OptionShape[]>(
    () =>
      months.map((month, index) => ({
        key: month,
        value: index,
      })),
    [],
  );

  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();
  const dateError = errors?.[name];
  const year = watch(`${name}.year`);
  const month = watch(`${name}.month`);
  const day = watch(`${name}.day`);

  const hours = watch(`${name}.hours`);
  const minutes = watch(`${name}.minutes`);
  const seconds = watch(`${name}.seconds`);

  const tryDate = useMemo(
    () => valueToDate(year, month, day),
    [year, month, day],
  );

  const weekDay = tryDate?.getDay();

  useEffect(() => {
    if (weekDay !== undefined) {
      setValue(`${name}.weekDay`, weekDay, {
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [name, setValue, weekDay]);

  useEffect(() => {
    trigger(name, {
      shouldFocus: false
    });
  }, [name, trigger, tryDate]);

  const formattedTime = useMemo(
    () => [hours, minutes, seconds].map(getTerm).join(':'),
    [hours, minutes, seconds],
  );

  const formattedDate = useMemo(() => {
    if (!tryDate) return '';

    return tryDate.toLocaleString('ru-RU', {
      dateStyle: 'full',
    });
  }, [tryDate]);

  return (
    <div>
      <div
        css={{
          border: `1px solid ${colors?.autofill}`,
          padding: scale(1),
          marginBottom: scale(1),
        }}
      >
        <strong>Выбрана дата:</strong>
        {dateError ? (
          <p css={{ color: colors.errorDark }}>
            {dateError?.message?.toString()}
          </p>
        ) : (
          <p>
            {formattedDate}, {formattedTime}
          </p>
        )}
      </div>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: scale(1),
        }}
      >
        <Form.Field label="Год" name={`${name}.year`}>
          <Mask
            mask="0000"
            autoComplete="off"
            size="md"
            transformValue={parseSafeInt}
          />
        </Form.Field>
        <Form.Field
          label="Месяц"
          name={`${name}.month`}
          {...(dateError?.message && { error: true })}
        >
          <Select options={optionsMonths} />
        </Form.Field>
        <Form.Field
          label="Число"
          name={`${name}.day`}
          {...(dateError?.message && { error: true })}
        >
          <Mask
            mask={Number}
            min={1}
            max={31}
            autoComplete="off"
            size="md"
            transformValue={parseSafeInt}
          />
        </Form.Field>
        <Form.Field label="Часы" name={`${name}.hours`}>
          <Select options={optionsHours} />
        </Form.Field>
        <Form.Field label="Минуты" name={`${name}.minutes`}>
          <Select options={optionsMinutes} />
        </Form.Field>
        <Form.Field label="Секунды" name={`${name}.seconds`}>
          <Select options={optionsSeconds} />
        </Form.Field>
      </div>
      <div css={{ marginTop: scale(1) }}>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();

            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();

            const weekDay = valueToDate(year, month, day);

            setValue(
              name,
              {
                day,
                month,
                year,
                weekDay: weekDay?.getDay(),
                hours,
                minutes,
                seconds,
              },
              {
                shouldTouch: true,
                shouldValidate: true,
              },
            );
          }}
        >
          Взять дату с компьютера
        </Button>
      </div>
    </div>
  );
};

DateForm.displayName = 'DateForm';

export default forwardRef(DateForm);
