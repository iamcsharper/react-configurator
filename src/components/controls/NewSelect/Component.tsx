import { forwardRef, useMemo } from 'react';

import { Arrow as DefaultArrow } from './components/arrow';
import { BaseSelect } from './components/base-select';
import { Field as DefaultField } from './components/field';
import { Optgroup as DefaultOptgroup } from './components/optgroup';
import { Option as DefaultOption } from './components/option';
import { OptionsList as DefaultOptionsList } from './components/options-list';
import { BaseSelectProps, OptionShape } from './types';

export type SelectProps = BaseSelectProps & {};

export const Select = forwardRef<HTMLDivElement, SelectProps>(
    (
        {
            Arrow = DefaultArrow,
            Field = DefaultField,
            OptionsList = DefaultOptionsList,
            Optgroup = DefaultOptgroup,
            Option = DefaultOption,
            ...restProps
        },
        ref
    ) => {
        const props = useMemo(
            () => ({
                Option,
                Field,
                Optgroup,
                OptionsList,
                Arrow,
                ...restProps,
            }),
            [Arrow, Field, Optgroup, Option, OptionsList, restProps]
        );

        return <BaseSelect ref={ref} {...props} />;
    }
);

Select.displayName = 'Select';

export const FormSelect = forwardRef<
    HTMLDivElement,
    Omit<SelectProps, 'onChange'> & {
        value?: any;
        onChange?: (valueOrValues: string | string[]) => void;
    }
>(({ name, multiple, options, onChange, onBlur, value, ...props }, ref) => {
    const selectedValues = useMemo(() => {
        if (multiple) return (Array.isArray(value) ? value : []) || [];

        return value === undefined ? [] : [value];
    }, [value, multiple]);

    const selectedOptions = useMemo(
        () =>
            options.filter(e => {
                if ('value' in e) return selectedValues.includes(e.value);
                return false;
            }) as OptionShape[],
        [options, selectedValues]
    );

    return (
        <Select
            ref={ref}
            name={name}
            options={options}
            {...props}
            multiple={multiple}
            selected={selectedOptions}
            onChange={payload => {
                // TODO: ???????????????? ?????????????????????????? ??????????. ???? ?????? Form.Field ???????????????? onChange, ???? ???????????????? ?? ?????????????? ???????????? Form.Field ???? ?????????????????? ???????????????? onChange.
                // ????????????, ????????????????, ???? ???? ???????? ???????????? value ??????????????, ?? ?????????? ???? initiator ?? ????????????
                onChange?.(payload.selected?.value);
            }}
            onBlur={e => {
                // field?.onBlur(e);
                onBlur?.(e);
            }}
            fieldProps={
                {
                    // meta,
                }
            }
        />
    );
});

FormSelect.displayName = 'FormSelect';
