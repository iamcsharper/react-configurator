import { scale } from '@scripts/helpers';
import { useFieldCSS } from '@scripts/hooks/useFieldCSS';
import { forwardRef, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Legend from '../Legend';
import { BasicFieldProps, BasicInputProps } from './types';

const BasicInput = forwardRef<any, BasicInputProps>(
  ({ name, iconCSS, basicFieldCSS, Icon, className, ...props }, ref) => (
    <>
      <input
        id={name}
        {...props}
        css={{
          ...basicFieldCSS,
          ...(Icon && { paddingLeft: scale(6) }),
        }}
        className={className}
        ref={ref}
      />
      {Icon && (
        <Icon
          css={{
            position: 'absolute',
            left: scale(2),
            top: '50%',
            transform: 'translateY(-50%)',
            ...iconCSS,
          }}
        />
      )}
    </>
  ),
);

export const BasicField = forwardRef<any, BasicFieldProps>(
  (
    {
      name,
      label,
      hint,
      Icon,
      iconCSS,
      className,
      isLegend = false,
      showMessage,
      messageText,
      placeholder,
      labelCSS,
      disabled,
      ...props
    },
    ref,
  ) => {
    const {
      formState: { errors },
    } = useFormContext(); // retrieve all hook methods

    const error = errors?.[name];

    const {
      basicFieldCSS,
      fieldWrapperCSS,
      fieldLabelCSS,
      fieldHintCSS,
      fieldErrorCSS,
    } = useFieldCSS({
      isLabel: !!label,
      isError: !!error,
    });

    const commonProps = useMemo(
      () => ({
        basicFieldCSS,
        iconCSS,
        Icon,
        className,
        placeholder,
        disabled,
        hint,
        label,
      }),
      [
        Icon,
        basicFieldCSS,
        className,
        disabled,
        hint,
        iconCSS,
        label,
        placeholder,
      ],
    );

    return (
      <Controller
        name={name}
        render={({ field: { ref: hookRef, ...field } }) =>
          isLegend ? (
            <Legend
              name={name}
              label={label}
              hint={hint}
              showMessage={showMessage}
              messageText={messageText}
              labelCSS={{ ...fieldLabelCSS, ...labelCSS }}
              fieldWrapperCSS={fieldWrapperCSS}
              hintCSS={fieldHintCSS}
              errorCSS={fieldErrorCSS}
            >
              <span>{label}</span>
              <BasicInput
                {...commonProps}
                ref={(newRef) => {
                  hookRef(newRef);

                  if (typeof ref === 'function') {
                    ref(newRef);
                  } else if (ref) {
                    ref.current = newRef;
                  }
                }}
                {...field}
                {...props}
              />
            </Legend>
          ) : (
            <BasicInput
              {...commonProps}
              ref={(newRef) => {
                hookRef(newRef);

                if (typeof ref === 'function') {
                  ref(newRef);
                } else if (ref) {
                  ref.current = newRef;
                }
              }}
              {...field}
              {...props}
            />
          )
        }
      />
    );
  },
);

export default BasicField;
