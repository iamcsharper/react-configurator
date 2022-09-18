import { HTMLProps, useMemo, forwardRef, useRef, useEffect } from 'react';
import { ReactComponent as CheckIcon } from '@icons/small/check.svg';
import { Controller, useFormContext } from 'react-hook-form';
import cn from 'classnames';
import { scale } from '@scripts/helpers';
import { colors } from '@scripts/colors';
import { CSSObject } from '@emotion/react';

export interface CheckboxProps extends HTMLProps<HTMLInputElement> {
  /** Active state indeterminate */
  isIndeterminate?: boolean;
  /** Are all values selected for indeterminate state */
  all?: boolean;
  /** Checkbox text with indeterminate state */
  indeterminate?: string;
  /** Additional class for label */
  labelClass?: string;
  /** Additional class */
  className?: string;
  /** Additional classes from form (inner) */
  inputClasses?: string;
  /** Show error flag */
  showError?: boolean;
  forceControlled?: boolean;
}

const Checkbox = forwardRef<any, CheckboxProps>(
  (
    {
      name,
      value,
      isIndeterminate = false,
      all = false,
      indeterminate,
      children,
      className,
      checked: checkedFromProps,
      forceControlled,
      // showError,
      ...props
    },
    ref,
  ) => {
    const id = `${name}-${value}`;
    const innerRef = useRef<HTMLInputElement>(null);
    const { control } = useFormContext();

    const actualRef = ref || innerRef;

    useEffect(() => {
      if (!isIndeterminate) return;
      if (typeof actualRef === 'function') return;
      if (actualRef.current) {
        actualRef.current.indeterminate = isIndeterminate;
        actualRef.current.checked = all;
      }
    }, [actualRef, all, indeterminate, isIndeterminate]);

    const labelCSS = useMemo<CSSObject>(
      () => ({
        minHeight: scale(2),
        position: 'relative',
        display: 'inline-block',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'color ease 300ms',
        '.knob': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          transition: 'background-color ease-out 60ms',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: scale(1, true),
          width: scale(3),
          height: scale(3),
          backgroundColor: colors.grey100,
          'input:checked + &': {
            backgroundColor: colors.link,
          },
          'input:disabled + &': {
            borderWidth: 2,
            borderColor: colors.grey300,
            backgroundColor: 'transparent',
            cursor: 'not-allowed',
          },
          'input:checked:disabled + &': {
            backgroundColor: colors.grey300,
          },
        },
        paddingLeft: scale(4),
        '&.invalid': {
          '&:before': {
            background: colors?.error,
          },
        },

        'input:disabled + &': {
          color: colors.grey600,
        },
      }),
      [],
    );

    const iconCSS = useMemo<CSSObject>(
      () => ({
        transform: 'translate(-50%, -50%) scale(0)',
        position: 'absolute',
        top: `calc(${scale(3)}px / 2)`,
        left: `calc(${scale(3)}px / 2)`,
        transition: 'transform ease-out 300ms',

        fill: colors.white,
        'input:checked + label &': {
          transform: 'translate(-50%, -50%) scale(1)',
        },
        'input:disabled + label &': {
          fill: colors.grey600,
          opacity: 0.6,
          cursor: 'not-allowed',
        },
        'input:checked:disabled + label &': {
          transform: 'translate(-50%, -50%) scale(1)',
        },
      }),
      [],
    );

    if (name && !forceControlled) {
      return (
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <div className={className}>
              {/* <Legend meta={meta} showError={showError} errorCSS={errorMessageCSS}> */}
              <input
                {...props}
                {...field}
                id={id}
                type="checkbox"
                value={value}
                css={{ position: 'absolute', clip: 'rect(0, 0, 0, 0)' }}
              />
              <label
                htmlFor={id}
                css={labelCSS}
                className={cn({
                  invalid: fieldState.error,
                })}
              >
                <span className="knob" />
                <CheckIcon css={iconCSS} />
                {children}
              </label>
              {/* </Legend> */}
            </div>
          )}
        />
      );
    }

    // alert('we are here');

    delete props.ref;

    return (
      <div className={className}>
        {/* <Legend meta={meta} showError={showError} errorCSS={errorMessageCSS}> */}
        <input
          {...props}
          ref={ref}
          name={name}
          id={id}
          type="checkbox"
          value={value}
          {...(checkedFromProps && { checked: checkedFromProps })}
          css={{ position: 'absolute', clip: 'rect(0, 0, 0, 0)' }}
        />
        <label
          htmlFor={id}
          css={labelCSS}
          className={cn({
            invalid: false,
          })}
        >
          <span className="knob" />
          <CheckIcon css={iconCSS} />
          {children}
        </label>
        {/* </Legend> */}
      </div>
    );
  },
);

export default Checkbox;
