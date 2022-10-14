import { Children, cloneElement, FC, isValidElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import BasicField from './BasicField';
import { FormFieldProps } from './types';

const FormField = <T extends Record<string, any> = never>({
  name,
  children,
  isLegend = true,
  className,
  ...props
}: FormFieldProps<T>) => {
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
                    cloneElement<any>(child, {
                      ...field,
                      ...hookFormProps,
                      onChange(...args: any[]) {
                        console.log('select onChange fired!', ...args);
                        console.log('field=', field);
                        if (
                          typeof (child?.props as any)?.onChange === 'function'
                        ) {
                          (child.props as any).onChange(...args);
                        }
                        field.onChange(...args);
                      },
                    })
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
