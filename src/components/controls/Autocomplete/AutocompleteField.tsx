import { FocusEvent, MouseEvent, Ref, useCallback, useMemo, useRef, useState } from 'react';
import mergeRefs from 'react-merge-refs';

import Legend from '@controls/Legend';

import { scale } from '@scripts/gds';
import { useFieldCSS } from '@scripts/hooks';

import DefaultInput from './Input';
import { AutocompleteFieldProps, LegendWrapperProps } from './types';

const LegendWrapper = ({ label, fieldWrapperCSS, children, ...props }: LegendWrapperProps) =>
    label ? (
        <Legend label={label} fieldWrapperCSS={fieldWrapperCSS} {...props}>
            {children}
        </Legend>
    ) : (
        <div css={fieldWrapperCSS}>
            {children}
        </div>
    );

const AutocompleteField = ({
    Arrow,
    name,
    label,
    labelView = 'inner',
    placeholder,
    size = 'md',
    labelProps,
    Input = DefaultInput,
    value,
    meta,
    hint,
    disabled,
    readOnly,
    onInput,
    inputProps = {},
    innerProps,
    rightAddons,
    bottomAddons,
    className,
}: AutocompleteFieldProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [focused, setFocused] = useState(false);

    const { onClick, onFocus } = innerProps;

    const inputDisabled = disabled || readOnly;

    const handleClick = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            if (onClick) onClick(event);

            if (inputRef.current) {
                inputRef.current.focus();
            }
        },
        [onClick]
    );

    const wrapperRef = mergeRefs([innerProps.ref as Ref<HTMLElement>, inputProps.wrapperRef as Ref<HTMLElement>]);

    const { basicFieldCSS, fieldLabelCSS, fieldWrapperCSS, fieldErrorCSS, fieldHintCSS } = useFieldCSS({
        size,
        value,
        theme: 'basic',
        variant: 'primary',
        focus: focused,
        isLabel: !!label,
        isLabelBottom: labelView === 'inner',
        meta,
        placeholder,
    });

    const legendProps = useMemo(
        () => ({
            as: 'div',
            name,
            label,
            hint,
            meta,
            isLabelBottom: labelView === 'inner',
            labelCSS: {
                ...fieldLabelCSS,
                ...(!disabled && {
                    cursor: 'pointer',
                }),
                ...(disabled &&
                    labelView === 'inner' && {
                        pointerEvents: 'none',
                    }),
            },
            fieldWrapperCSS,
            hintCSS: fieldHintCSS,
            errorCSS: fieldErrorCSS,
            ...(labelProps?.htmlFor && {
                name: labelProps.htmlFor,
            }),
        }),
        [
            disabled,
            fieldErrorCSS,
            fieldHintCSS,
            fieldLabelCSS,
            fieldWrapperCSS,
            hint,
            label,
            labelProps?.htmlFor,
            labelView,
            meta,
            name,
        ]
    );
    const inputPropsMerged = useMemo(
        () => ({
            ...inputProps,
            ...innerProps,
        }),
        [innerProps, inputProps]
    );

    const handleFocus = useCallback(
        (e: FocusEvent<HTMLInputElement>) => {
            onFocus?.(e);
            inputPropsMerged.onFocus?.(e);
            setFocused(true);
        },
        [inputPropsMerged, onFocus]
    );

    const handleBlur = useCallback(
        (e: FocusEvent<HTMLInputElement>) => {
            inputPropsMerged.onBlur?.(e);
            setFocused(false);
        },
        [inputPropsMerged]
    );

    return (
        <div className={className}>
            <LegendWrapper {...legendProps} label={label}>
                <div css={{ ...basicFieldCSS, display: 'flex' }} ref={wrapperRef}>
                    <Input
                        {...inputProps}
                        {...innerProps}
                        ref={mergeRefs([inputRef, inputProps.ref as Ref<HTMLElement>])}
                        disabled={disabled}
                        readOnly={readOnly}
                        onChange={onInput}
                        onClick={inputDisabled ? undefined : handleClick}
                        onFocus={inputDisabled ? undefined : handleFocus}
                        onBlur={handleBlur}
                        autoComplete="off"
                        value={value}
                        placeholder={placeholder}
                        css={{
                            background: 'transparent',
                            border: 'none',
                            padding: 0,
                            outline: 'none!important',
                            height: scale(3),
                            display: 'flex',
                            alignItems: 'center',
                            flexShrink: 1,
                            width: '100%',
                            paddingRight: scale(2),
                        }}
                    />
                    {rightAddons}
                    {Arrow}
                </div>
            </LegendWrapper>
            {bottomAddons}
        </div>
    );
};

export default AutocompleteField;
