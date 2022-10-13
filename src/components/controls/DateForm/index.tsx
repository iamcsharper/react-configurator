import { colors } from '@scripts/colors';
import { scale } from '@scripts/helpers';
import { useFieldCSS } from '@scripts/hooks/useFieldCSS';
import { forwardRef, useMemo } from 'react';
import Legend from '../Legend';
import Select from '../Select';
import { SelectItemProps } from '../Select/types';

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
  const optionsCenturies = useMemo<SelectItemProps<number | null>[]>(
    () => [20, 21, 22].map((e) => ({ label: `${e}`, value: e })),
    [],
  );

  // TODO: filter values of filters

  const minYear = ((value?.century || optionsCenturies[1].value!) - 1) * 100;
  const maxYear = (value?.century || optionsCenturies[1].value!) * 100;

  const optionsMonths = useMemo<SelectItemProps<number | null>[]>(
    () =>
      months.map((month, index) => ({
        label: month,
        value: index,
      })),
    [],
  );

  const { basicFieldCSS } = useFieldCSS({});

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
            items={optionsCenturies}
            label="Век"
            onChange={(century) => {
              if (value)
                onChange?.({
                  ...value,
                  century: century === null ? null : +`${century}`,
                });
            }}
            selectedItem={optionsCenturies.find(
              (e) => e.value === value?.century,
            )}
            isSearch
            applyOnExactLabel
            emptyValue={null}
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
            onChange={(e) => {
              if (value) {
                onChange?.({
                  ...value,
                  year: e.currentTarget.value ? +e.currentTarget.value : null,
                });
              }
            }}
          />
        </Legend>
        <Select
          items={optionsMonths}
          label="Месяц"
          onChange={(month) => {
            if (value)
              onChange?.({
                ...value,
                month: month === null ? null : +`${month}`,
              });
          }}
          selectedItem={optionsMonths.find((e) => e.value === value?.month)}
          isSearch
          applyOnExactLabel
          emptyValue={null}
        />
        <Legend label="День">
          {/* TODO: yup validation? */}
          <input
            css={[basicFieldCSS, {}]}
            placeholder="День"
            type="number"
            onChange={(e) => {
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
