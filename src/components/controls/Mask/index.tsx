import {
  FocusEvent,
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
} from 'react';
import { IMaskInput } from 'react-imask';
import { mergeRefs } from 'react-merge-refs';

import { FormFieldProps } from '@controls/Form/types';

import { useInputCSS } from '@scripts/hooks/useInputCSS';

import FormControl from '@controls/FormControl';

export interface MaskProps extends Omit<FormFieldProps, 'name'> {
  /** Input name */
  name?: string;
  /** Mask for input */
  mask: any;
  /** Placeholder for mask */
  placeholderChar?: string;
  /** Is show placholder */
  lazy?: boolean;

  error?: string;

  /** onChange handler */
  onAccept?: (value: string) => void;
}

const Mask = forwardRef<HTMLInputElement, MaskProps>(
  (
    {
      name,
      mask,
      className,
      placeholderChar = '_',
      lazy = true,
      theme = 'basic',
      size = 'lg',
      label,
      placeholder,
      onAccept,
      onChange,
      onFocus,
      onBlur,
      readOnly,
      error,
      labelView,
      inputCSS,
      block = true,
      value,
      ...props
    },
    ref,
  ) => {
    const id = useId();
    const htmlFor = props.id || id;
    const defaultCSS = useInputCSS();

    const filled = Boolean(value);

    const inputRef = useRef<HTMLInputElement>(null);
    const [focused, setFocused] = useState(false);

    const handleInputFocus = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        if (!readOnly) {
          setFocused(true);
        }

        if (onFocus) {
          onFocus(event);
        }
      },
      [onFocus, readOnly],
    );

    const handleInputBlur = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        setFocused(false);

        if (onBlur) {
          onBlur(event);
        }
      },
      [onBlur],
    );

    return (
      <FormControl
        label={label}
        error={error}
        focused={focused}
        filled={filled || focused || !!placeholder?.length || !!mask}
        htmlFor={htmlFor}
        readOnly={readOnly}
        theme={theme}
        size={size}
        labelView={labelView}
        className={className}
        block={block}
      >
        <IMaskInput
          ref={mergeRefs([ref, inputRef])}
          name={name}
          mask={mask}
          value={value}
          placeholder={placeholder}
          {...props}
          id={htmlFor}
          className="control"
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          css={{ ...defaultCSS, ...inputCSS }}
          lazy={lazy}
          placeholderChar={placeholderChar}
          onAccept={(val: any, _, e: any) => {
            if (onChange) onChange(e, { value: val });
            if (onAccept) onAccept(val);
          }}
          // unmask
          autofix={false}
          unmask
        />
      </FormControl>
    );
  },
);

Mask.displayName = 'Mask';

export default Mask;
