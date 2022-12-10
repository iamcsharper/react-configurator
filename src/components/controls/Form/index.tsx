import { FC, HTMLProps, ReactNode, KeyboardEvent, useCallback } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import FormField from './Field';
import { FormFieldProps } from './types';

export interface FormCompositionProps {
  Field: FC<FormFieldProps>;
}

export interface FormProps<T extends Record<string, any>>
  extends Omit<HTMLProps<HTMLFormElement>, 'onSubmit' | 'onReset'> {
  children: ReactNode | ReactNode[];
  methods: UseFormReturn<T, any>;
  onSubmit: (values: T) => void;
  onReset?: (values: T) => void;
  isSubmitOnEnter?: boolean;
}

const checkKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
  if (e.code === 'Enter') e.preventDefault();
};

const Form = <T extends Record<string, any>>({
  children,
  methods,
  onSubmit,
  onReset,
  isSubmitOnEnter = false,
  ...props
}: FormProps<T> & Partial<FormCompositionProps>) => {
  const reset: typeof methods.reset = useCallback(
    (newValues, keepStateOptions) => {
      methods.reset(newValues, keepStateOptions);
      const values = methods.getValues();
      if (onReset) onReset(values);
    },
    [methods, onReset],
  );

  return (
    <FormProvider {...methods} reset={reset}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        onKeyDown={isSubmitOnEnter ? undefined : (e) => checkKeyDown(e)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
};

Form.Field = FormField;

export default Form;
