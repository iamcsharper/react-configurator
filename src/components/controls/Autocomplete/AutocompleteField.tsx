import { MouseEvent, Ref, useCallback, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';

import DefaultInput from '../Input';
import { AutocompleteFieldProps } from './types';

const AutocompleteField = ({
  label,
  labelView = 'inner',
  Input = DefaultInput,
  Arrow,
  value,
  hint,
  disabled,
  readOnly,
  onInput,
  inputProps = {},
  innerProps,
  className,
}: AutocompleteFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { onClick, onFocus } = innerProps;

  const inputDisabled = disabled || readOnly;

  const handleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (onClick) onClick(event);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [onClick],
  );

  return (
    <Input
      {...inputProps}
      {...innerProps}
      wrapperRef={mergeRefs([
        innerProps.ref as Ref<HTMLElement>,
        inputProps.wrapperRef as Ref<HTMLElement>,
      ])}
      className={className}
      ref={mergeRefs([inputRef, inputProps.ref as Ref<HTMLElement>])}
      disabled={disabled}
      readOnly={readOnly}
      block
      label={label}
      labelView={labelView}
      hint={hint}
      onChange={onInput}
      onClick={inputDisabled ? undefined : handleClick}
      onFocus={inputDisabled ? undefined : onFocus}
      autoComplete="off"
      value={value}
      rightAddons={
        (Arrow || inputProps.rightAddons) && (
          <>
            {inputProps.rightAddons}
            {Arrow}
          </>
        )
      }
    />
  );
};

export default AutocompleteField;
