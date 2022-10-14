import { scale } from '@scripts/helpers';
import { useFieldCSS } from '@scripts/hooks/useFieldCSS';
import { forwardRef, useCallback, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Legend from '../Legend';
import { BasicFieldProps, BasicInputProps } from './types';

export const BasicInput = forwardRef<any, BasicInputProps>(
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

export const BasicField = forwardRef<any, BasicFieldProps<Record<string, any>>>(
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
    const formContext = useFormContext(); // retrieve all hook methods
    const {
      control,
      formState: { errors },
    } = formContext || {
      control: null,
      formState: {},
    };

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

    const InnerComponent = useCallback(
      ({ innerRef, field }: { innerRef: any; field?: any }) =>
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
            <BasicInput {...commonProps} ref={ref} {...field} {...props} />
          </Legend>
        ) : (
          <BasicInput {...commonProps} ref={innerRef} {...field} {...props} />
        ),
      [
        commonProps,
        fieldErrorCSS,
        fieldHintCSS,
        fieldLabelCSS,
        fieldWrapperCSS,
        hint,
        isLegend,
        label,
        labelCSS,
        messageText,
        name,
        props,
        ref,
        showMessage,
      ],
    );

    if (!name || !control) {
      return <InnerComponent innerRef={ref} />;
    }

    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { ref: hookRef, ...field } }) => (
          <InnerComponent
            field={field}
            innerRef={(newRef: any) => {
              hookRef(newRef);

              if (typeof ref === 'function') {
                ref(newRef);
              } else if (ref) {
                ref.current = newRef;
              }
            }}
          />
        )}
      />
    );
  },
);

export default BasicField;
