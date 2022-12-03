import { z, ZodTypeAny } from 'zod';

export const zodStringToNumber = <T extends ZodTypeAny>(
  schema: T,
  params?: { invalid_type_error?: string; required_error?: string },
) =>
  z.preprocess(
    (a) => {
      if (Number.isNaN(a) || a === null || a === undefined) return undefined;
      if (typeof a === 'number') return a;

      return Number(a as string);
    },
    schema,
    params,
  );
