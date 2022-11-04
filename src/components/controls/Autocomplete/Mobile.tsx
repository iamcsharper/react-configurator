import React, { useRef } from 'react';
import mergeRefs from 'react-merge-refs';

import { Arrow, BaseSelectMobile } from '@controls/NewSelect';

import { scale } from '@scripts/gds';

import CloseIcon from '@icons/small/close.svg';

import BasicField from '../Form/BasicField';
import { AutocompleteMobileField } from './AutocompleteMobileField';
import { AutocompleteProps } from './types';

export type AutocompleteMobileProps = Omit<
    AutocompleteProps,
    | 'Field'
    | 'OptionsList'
    | 'Checkmark'
    | 'onScroll'
    | 'nativeSelect'
    | 'autocomplete'
    | 'valueRenderer'
    | 'allowUnselect'
>;

export const AutocompleteMobile = React.forwardRef(
    ({ onInput, fieldProps, inputProps, ...restProps }: AutocompleteMobileProps, ref) => {
        const targetRef = useRef<HTMLDivElement>(null);
        const inputRef = useRef<HTMLInputElement>(null);

        const { value } = fieldProps;

        return (
            <BaseSelectMobile
                ref={mergeRefs([targetRef, ref])}
                onBeforeClose={() => {
                    setTimeout(() => {
                        inputRef.current?.blur();
                    }, 0);
                }}
                Arrow={Arrow}
                {...restProps}
                Field={AutocompleteMobileField}
                fieldProps={fieldProps}
                headerChildren={
                    <BasicField
                        {...inputProps}
                        ref={inputRef}
                        size="md"
                        value={value}
                        onInput={e => {
                            fieldProps?.onInput?.(e);
                            inputProps?.onInput?.(e);
                            onInput?.(e as any);
                        }}
                        placeholder="Поиск"
                        wrapperCSS={{
                            marginTop: scale(1),
                            width: '100%',
                            position: 'relative',
                        }}
                        rightAddons={
                            !!value?.length && (
                                <button
                                    type="button"
                                    css={{
                                        display: 'flex',
                                        fill: 'currentColor',
                                        position: 'absolute',
                                        right: scale(2),
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                    }}
                                    onClick={() => {
                                        fieldProps?.onInput({
                                            currentTarget: {
                                                value: '',
                                            },
                                            target: {
                                                value: '',
                                            },
                                        });

                                        setTimeout(() => {
                                            inputRef.current?.focus();
                                        }, 0);
                                    }}
                                >
                                    <CloseIcon />
                                </button>
                            )
                        }
                    />
                }
                autocomplete={false}
                allowUnselect
                shouldReturnFocusAfterClose={false}
            />
        );
    }
);

AutocompleteMobile.displayName = 'AutocompleteMobile';
