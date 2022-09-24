import { FC, HTMLProps, ReactNode, KeyboardEvent } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import FormField from './Field';
import { FormFieldProps } from './types';

export interface FormCompositionProps {
  Field: FC<FormFieldProps>;
}

export interface FormProps<T extends Record<string, any>>
  extends Omit<HTMLProps<HTMLFormElement>, 'onSubmit'> {
  children: ReactNode | ReactNode[];
  methods: UseFormReturn<T, any>;
  onSubmit: (values: T) => void;
  isSubmitOnEnter?: boolean;
}

const checkKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
  if (e.code === 'Enter') e.preventDefault();
};

const Form = <T extends Record<string, any>>({
  children,
  methods,
  onSubmit,
  isSubmitOnEnter = false,
  ...props
}: FormProps<T>) => (
  <FormProvider {...methods}>
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      onKeyDown={isSubmitOnEnter ? undefined : (e) => checkKeyDown(e)}
      {...props}
    >
      {children}
    </form>
  </FormProvider>
);

Form.Field = FormField;

export default Form;
