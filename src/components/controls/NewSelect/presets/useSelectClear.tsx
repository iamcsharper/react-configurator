import { FC, useCallback, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';

import { ReactComponent as CloseIcon } from '@icons/small/close.svg';

import { Field as DefaultField } from '../components/field';
import { FieldProps } from '../types';

export interface useSelectClearProps {
  Field?: FC<FieldProps>;
  closeOnClear?: boolean;
}

export const useSelectClear = ({
  Field = DefaultField,
  closeOnClear = false,
}: useSelectClearProps = {}) => {
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const renderField = useCallback(
    (props: FieldProps) => (
      <Field
        {...props}
        innerProps={{
          ...props.innerProps,
          ref: mergeRefs([props.innerProps.ref!, fieldRef]),
        }}
        rightAddons={
          <>
            {props.multiple && !!props.selectedMultiple?.length && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  props.setSelectedItems([]);

                  setTimeout(() => {
                    fieldRef.current?.focus();
                  }, 0);

                  if (closeOnClear && props.open) {
                    setTimeout(() => {
                      props.toggleMenu();
                    }, 0);
                  }
                }}
                css={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CloseIcon />
              </button>
            )}
            {props.rightAddons}
          </>
        }
      />
    ),
    [Field, closeOnClear],
  );

  return {
    Field: renderField,
  };
};

export default useSelectClear;
