import { useMemo, useRef, useState } from 'react';

import Legend from '@controls/Legend';
import { FieldProps as BaseFieldProps } from '@controls/NewSelect';

import { colors, scale } from '@scripts/gds';
import { useFieldCSS } from '@scripts/hooks';

import { AutocompleteFieldProps, AutocompleteProps, LegendWrapperProps } from './types';

export type AutocompleteMobileFieldProps = AutocompleteFieldProps &
    Omit<BaseFieldProps, 'selected' | 'multiple' | 'success'> &
    Pick<AutocompleteProps, 'value'>;

const LegendWrapper = ({ label, fieldWrapperCSS, children, ...props }: LegendWrapperProps) =>
    label ? (
        <Legend label={label} fieldWrapperCSS={fieldWrapperCSS} {...props}>
            {children}
        </Legend>
    ) : (
        <div css={fieldWrapperCSS}>{children}</div>
    );

export const AutocompleteMobileField = ({
    size = 'md',
    name,
    meta,
    label,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    open,
    hint,
    disabled,
    labelView = 'inner',
    placeholder,
    value,
    innerProps,
    labelProps,
    Arrow,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueRenderer,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toggleMenu,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setSelectedItems,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedMultiple,
    rightAddons,
    className,
    bottomAddons,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    inputProps,
    ...restProps
}: AutocompleteMobileFieldProps) => {
    const [focused, setFocused] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    const filled = Boolean(value);

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
    return (
        <div
            className={className}
            css={{
                width: '100%',
                outline: 'none!important',
            }}
            ref={wrapperRef}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        >
            <LegendWrapper {...legendProps}>
                <div css={{ ...basicFieldCSS, display: 'flex' }}>
                    <div
                        css={{
                            height: scale(3),
                            display: 'flex',
                            alignItems: 'center',
                            flexShrink: 1,
                            width: '100%',
                            paddingRight: scale(2),
                            outline: 'none!important',
                        }}
                        {...innerProps}
                        {...restProps}
                    >
                        {placeholder && !filled && (
                            <span
                                css={{
                                    color: colors.grey600,
                                }}
                            >
                                {placeholder}
                            </span>
                        )}
                        {value}
                    </div>
                    {rightAddons}
                    {Arrow}
                </div>
            </LegendWrapper>
            {bottomAddons}
        </div>
    );
};

AutocompleteMobileField.displayName = 'AutocompleteMobileField';
