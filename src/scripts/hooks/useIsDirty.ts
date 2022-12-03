import { useMemo } from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import deepEqual from 'fast-deep-equal';

export const useIsDirty = (
  form: UseFormReturn<any, any>,
  initialValues: any,
  defaultValues: any,
) => {
  const values = form.watch();

  const isDirty = useMemo(
    () => !deepEqual(values, initialValues),
    [values, initialValues],
  );

  if (isDirty) {
    console.log('[useIsDirty] values=', values, 'initial=', initialValues);
  }

  const isDefaultDirty = useMemo(
    () => !deepEqual(values, defaultValues),
    [defaultValues, values],
  );

  return { isDirty, isDefaultDirty };
};

export const useIsDirtyInContext = (initialValues: any, defaultValues: any) => {
  const form = useFormContext();

  return useIsDirty(form, initialValues, defaultValues);
};
