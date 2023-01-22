import { useRef } from 'react';

import { FieldProps, SimpleSelect } from '@controls/NewSelect';

import { IntegerMaskedFormatProps } from './types';
import { FORMAT_OPTIONS } from './utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ButtonField = ({ innerProps, Arrow, className, disabled, id }: FieldProps) => {
  const { ref, ...restInnerProps } = innerProps;

  return (
    <div css={{ display: 'flex' }}>
      <button ref={ref} type="button" className={className} disabled={disabled} id={id} {...(restInnerProps as any)}>
        {Arrow}
      </button>
    </div>
  );
};

export const Format = ({ format, onChange }: IntegerMaskedFormatProps) => {
  const fieldRef = useRef<HTMLDivElement>(null);

  return (
    <SimpleSelect
      Field={ButtonField}
      selected={FORMAT_OPTIONS.filter(e => e.value === format)}
      onChange={e => {
        onChange((e.selected?.value || null) as any);
        setTimeout(() => {
          fieldRef.current?.focus();
        }, 0);
      }}
      options={FORMAT_OPTIONS}
      popoverPosition="bottom-end"
      ref={fieldRef}
      size="md"
    />
  );
};
