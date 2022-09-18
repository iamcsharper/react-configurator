import { Children, cloneElement, FC, isValidElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import BasicField from './BasicField';
import { FormFieldProps } from './types';

const FormField = ({
  name,
  children,
  isLegend = true,
  className,
  ...props
}: FormFieldProps) => {
  const { control } = useFormContext(); // retrieve all hook methods

  const isCheckbox =
    isValidElement(children) && (children?.type as FC)?.name === 'Checkbox';
  const isRadio =
    isValidElement(children) && (children?.type as FC)?.name === 'Radio';

  const inputProps = {
    type: 'text',
    name,
    ...(!isCheckbox && !isRadio && { isLegend }),
    ...props,
  };

  return (
    <div css={{ width: '100%' }} className={className}>
      {children ? (
        <>
          {Children.map(children, (child) => {
            if (isValidElement(child)) {
              const hookFormProps = {
                id: (child?.type as FC)?.displayName !== 'Legend' ? name : '',
              };

              return (
                <Controller
                  name={name}
                  control={control}
                  render={({ field }) =>
                    cloneElement(child, { ...field, ...hookFormProps })
                  }
                />
              );
            }
          })}
        </>
      ) : (
        <BasicField {...inputProps} {...props} />
      )}
    </div>
  );
};

export default FormField;
