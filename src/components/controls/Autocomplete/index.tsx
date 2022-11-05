import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';

import {
    BaseSelect,
    BaseSelectChangePayload,
    BaseSelectProps,
    Optgroup as DefaultOptgroup,
    Option as DefaultOption,
    OptionsList as DefaultOptionsList,
    GroupShape,
    OptionShape,
} from '@controls/NewSelect';
import { Arrow as DefaultArrow } from '@controls/NewSelect/components/arrow';
import { ClearableItems } from '@controls/NewSelect/presets/useClearableItems';


import { scale } from '@scripts/helpers';
import AutocompleteField from './AutocompleteField';
import Clear from './Clear';

import { AutocompleteProps } from './types';

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
    (
        {
            isMobile,
            Arrow = DefaultArrow,
            OptionsList = DefaultOptionsList,
            Optgroup = DefaultOptgroup,
            Option = DefaultOption,
            Input,
            inputProps = {},
            onInput,
            value,
            success,
            readOnly,
            closeOnSelect = false,
            options,
            fieldProps,
            ...restProps
        },
        ref
    ) => {
        const props = useMemo(
            () => ({
                ref,
                autocomplete: !isMobile,
                options,
                closeOnSelect,
                Option,
                Arrow,
                Field: AutocompleteField,
                fieldProps: {
                    Input,
                    onInput,
                    value,
                    inputProps,
                    readOnly,
                    success,
                    ...fieldProps,
                },
                Optgroup,
                OptionsList,
                ...restProps,
            }),
            [
                Arrow,
                Input,
                Optgroup,
                Option,
                OptionsList,
                closeOnSelect,
                fieldProps,
                inputProps,
                isMobile,
                onInput,
                options,
                readOnly,
                ref,
                restProps,
                success,
                value,
            ]
        );

        return <BaseSelect {...props} />;
    }
);

Autocomplete.displayName = 'Autocomplete';

interface useAutocompleteProps extends Pick<BaseSelectProps, 'options'> {
    initialSelectedValues: any[];
    reinitialize?: boolean;
    multiple: boolean;
    showSelected?: boolean;
}

export const useAutocomplete = ({
    initialSelectedValues,
    reinitialize = true,
    multiple,
    options,
    showSelected = true,
}: useAutocompleteProps) => {
    const [selectedValues, setSelectedValues] = useState(initialSelectedValues);
    const selectedOptions = useMemo(
        () =>
            options.filter(e => {
                if ('value' in e) return selectedValues.includes(e.value);
                return false;
            }) as OptionShape[],
        [options, selectedValues]
    );
    const [search, setSearch] = useState('');

    const getKeyByValue = useCallback(
        (value: any) => {
            const result = options.find(e => {
                if ('value' in e) return e.value === value;
                return false;
            });

            if (!result || !('key' in result)) return null;

            return result.key;
        },
        [options]
    );

    useEffect(() => {
        if (!reinitialize) return;

        if (!multiple && initialSelectedValues.length > 0) {
            const key = getKeyByValue(initialSelectedValues[0]);
            if (key !== null) {
                setSearch(key);
            }
        }

        setSelectedValues(initialSelectedValues);
    }, [getKeyByValue, initialSelectedValues, multiple, reinitialize]);

    const matchOption = useCallback((option: GroupShape | OptionShape, inputValue: string) => {
        if (!inputValue) return true;

        if ('key' in option) {
            return option.key.toLowerCase().includes(inputValue.toLowerCase());
        }

        if ('label' in option) {
            return option.label?.toLowerCase().includes(inputValue.toLowerCase());
        }

        return false;
    }, []);

    const handleInput = useCallback((event: any) => {
        setSearch(event.target.value);
    }, []);

    const handleChange = ({ selected }: BaseSelectChangePayload) => {
        if (multiple) setSearch('');

        if (selected && !selectedValues.includes(selected.value)) {
            setSelectedValues(selectedValues.concat([selected.value]));
        }
    };

    const filteredOptions = useMemo(
        () =>
            options.filter(option => {
                if (!('value' in option)) return false;
                const isSelected = selectedValues.includes(option.value);
                const isMatched = matchOption(option, search);

                return (!isSelected || showSelected) && isMatched;
            }),
        [options, selectedValues, matchOption, search, showSelected]
    );

    return {
        value: search,
        setValue: setSearch,
        filteredOptions,
        handleInput,
        selectedValues,
        handleChange,
        matchOption,
        selectedOptions,
    };
};

const FormikAutocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
    ({ multiple = false, onChange, onInput, onBlur, options, fieldProps, ...props }, ref) => {
        // const initialSelectedValues = useMemo(() => {
        //     if (multiple) return (Array.isArray(field?.value) ? field?.value : []) || [];

        //     return field?.value === null ? [] : [field?.value];
        // }, [field?.value, multiple]);

        const { value, setValue, handleInput, handleChange, selectedOptions, filteredOptions } = useAutocomplete({
            multiple,
            options,
            initialSelectedValues: [],
        });
        const inputRef = useRef<HTMLInputElement | null>(null);

        return (
            <Autocomplete
                ref={ref}
                options={filteredOptions}
                {...props}
                value={value}
                selected={selectedOptions}
                onInput={e => {
                    handleInput(e);
                    onInput?.(e);
                }}
                onChange={payload => {
                    handleChange(payload);

                    setTimeout(() => {
                        if (!multiple) {
                            // helpers?.setValue(payload.selected?.value);
                        } else {
                            // helpers?.setValue(payload.selectedMultiple.map(e => e.value));
                        }
                    }, 1);

                    onChange?.(payload);
                }}
                allowUnselect={multiple}
                multiple={multiple}
                onBlur={e => {
                    // field?.onBlur(e);
                    onBlur?.(e);
                }}
                inputProps={{
                    ref: mergeRefs([inputRef /* props.inputProps!.ref */]),
                }}
                fieldProps={{
                    // meta,
                    rightAddons: (
                        <Clear
                            visible={!!value.length}
                            clear={() => {
                                setValue('');
                            }}
                            focus={() => inputRef.current?.focus()}
                            css={{ marginLeft: 'auto' }}
                        />
                    ),
                    bottomAddons: (
                        <ClearableItems
                            selectedMultiple={selectedOptions}
                            setSelectedItems={newSelected => {
                                console.log(newSelected);
                                if (!multiple) {
                                    // const newValue = newSelected.length ? newSelected[0].value : '';
                                    // helpers?.setValue(newValue);
                                } else {
                                    // helpers?.setValue(newSelected.map(e => e.value));
                                }

                                setValue('');

                                inputRef.current?.blur();
                            }}
                            css={{ marginTop: scale(1) }}
                        />
                    ),

                    ...fieldProps,
                }}
            />
        );
    }
);

FormikAutocomplete.displayName = 'FormikAutocomplete';

export default FormikAutocomplete;
