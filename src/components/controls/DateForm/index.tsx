import { colors } from '@scripts/colors';
import { scale } from '@scripts/helpers';
import { useFieldCSS } from '@scripts/hooks/useFieldCSS';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import Legend from '../Legend';
import Select, { OptionShape } from '../NewSelect';

export interface DateFormValues {
  century: number | null;
  day: number | null;
  weekDay: number | null; // 0... 6, 0 - понедельник
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
  'Декабрь',
];

const formatDay = (val?: DateFormValues['day']) =>
  val === null || val === undefined ? 'XX' : `${val}`.padStart(2, '0');

const formatYear = (val?: DateFormValues['year']) =>
  val === null || val === undefined ? 'XXXX' : `${val}`;

const formatCentury = (val?: DateFormValues['century']) =>
  val === null || val === undefined ? 'XX' : `${val}-ый`;

const formatMonth = (val?: DateFormValues['month']) =>
  val === null || val === undefined ? 'XX' : months[val];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DateForm = ({ value, onChange }: DateFormProps, _ref?: any) => {
  const optionsCenturies = useMemo<OptionShape[]>(
    () => [20, 21, 22].map((e) => ({ key: `${e}`, value: e })),
    [],
  );

  // TODO: filter values of filters

  const minYear = ((value?.century || optionsCenturies[1].value!) - 1) * 100;
  const maxYear = (value?.century || optionsCenturies[1].value!) * 100;

  const optionsMonths = useMemo<OptionShape[]>(
    () =>
      months.map((month, index) => ({
        key: month,
        value: index,
      })),
    [],
  );

  const { basicFieldCSS } = useFieldCSS({});

  const [year, setYear] = useState(value?.year || '');
  const [day, setDay] = useState(value?.day || '');

  useEffect(() => {
    setYear((old) => {
      if (value?.year && old !== value?.year) return value?.year;
      return old;
    });
  }, [value?.year]);

  useEffect(() => {
    setDay((old) => {
      if (value?.day && old !== value?.day) return value?.day;
      return old;
    });
  }, [value?.day]);

  // console.log('value?.month', value?.month);

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
        <div
          css={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: scale(1),
          }}
        >
          <p>Век: {formatCentury(value?.century)}</p>
          <p>Год: {formatYear(value?.year)}</p>
          <p>Месяц: {formatMonth(value?.month)}</p>
          <p>День: {formatDay(value?.day)}</p>
        </div>
      </div>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: scale(1),
        }}
      >
        <div>
          <Select
            options={optionsCenturies}
            label="Век"
            onChange={(century) => {
              if (value) {
                const newVal = {
                  ...value,
                  century: century ? +century : null,
                };
                console.log('onChange newVal=', newVal);
                onChange?.(newVal);
              }
            }}
            selected={optionsCenturies.find((e) => e.value === value?.century)}
          />
        </div>
        <Legend label="Год">
          {/* TODO: yup validation? */}
          <input
            css={[basicFieldCSS, {}]}
            placeholder="Год"
            type="number"
            min={`${minYear}`}
            max={`${maxYear}`}
            value={year}
            onChange={(e) => {
              if (value) {
                onChange?.({
                  ...value,
                  year: e ? +e : null,
                });
              }
            }}
          />
        </Legend>
        <Select
          options={optionsMonths}
          label="Месяц"
          onChange={(month) => {
            console.log('onChange month:', month);
            if (value)
              onChange?.({
                ...value,
                month: month ? +month : null,
              });
          }}
          selected={optionsMonths.find((e) => e.value === value?.month)}
        />
        <Legend label="День">
          {/* TODO: yup validation? */}
          <input
            css={[basicFieldCSS, {}]}
            placeholder="День"
            type="number"
            value={day}
            onChange={(e) => {
              setDay(e.currentTarget.value);
              if (value) {
                onChange?.({
                  ...value,
                  day: e.currentTarget.value ? +e.currentTarget.value : null,
                });
              }
            }}
          />
        </Legend>
      </div>
    </div>
  );
};

export default forwardRef(DateForm);
