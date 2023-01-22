import { FieldProps, SimpleSelect } from '@controls/NewSelect';

import type { IntegerMaskedFormatProps } from './types';
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

export const Format = ({ format, onChange, inputRef }: IntegerMaskedFormatProps) => (
  <SimpleSelect
    Field={ButtonField}
    selected={FORMAT_OPTIONS.filter(e => e.value === format)}
    onChange={e => {
      onChange((e.selected?.value || null) as any);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }}
    options={FORMAT_OPTIONS}
    popoverPosition="bottom-end"
    size="md"
  />
);
