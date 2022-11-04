import { Dispatch, FC, useCallback, useEffect, useRef, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';

import { colors } from '@scripts/colors';

import { ReactComponent as CloseIcon } from '@icons/small/close.svg';

import { scale } from '@scripts/helpers';
import typography from '@scripts/typography';
import { Field as DefaultField } from '../components/field';
import { FieldProps, OptionShape } from '../types';

export interface useClearableItemsProps {
  Field?: FC<FieldProps>;
}

export interface ClearableItemsProps {
  selectedMultiple: OptionShape[];
  setSelectedItems: Dispatch<OptionShape[]>;
  className?: string;
  disabled?: boolean;
  allowUnselect?: boolean;
}

export const ClearableItems = ({
  className,
  setSelectedItems,
  selectedMultiple,
  disabled,
}: ClearableItemsProps) => {
  const itemsRef = useRef<{ [key: number]: HTMLButtonElement }>({});
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(-1);

  const itemsCount = selectedMultiple.length;

  const isValidIndex = (idx: number) => idx >= 0 && idx <= itemsCount - 1;

  const getClearableProps = (option: OptionShape, index: number) => ({
    tabIndex: -1,
    disabled,
    onClick: () => {
      setSelectedItems(selectedMultiple.filter((e) => e.key !== option.key));

      const left = activeIndex - 1;
      const right = activeIndex + 1;

      if (isValidIndex(left)) {
        itemsRef.current[left]?.focus();
        setActiveIndex(left);
      } else if (isValidIndex(right)) {
        itemsRef.current[right]?.focus();
        setActiveIndex(right);
      } else {
        setActiveIndex(-1);
      }
    },
    ref: (element: HTMLButtonElement) => {
      itemsRef.current[index] = element;
    },
    onBlur: () => {
      setTimeout(() => {
        const flatItems = Object.values(itemsRef.current);

        if (!flatItems.includes(document.activeElement as any)) {
          setActiveIndex(-1);
        }
      }, 0);
    },
  });

  const onKeyPress = useCallback(
    (event: KeyboardEvent) => {
      setActiveIndex((oldValue) => {
        if (!itemsCount) return -1;

        let value = oldValue;

        if (event.key === 'ArrowRight') {
          value += 1;
        } else if (event.key === 'ArrowLeft') {
          value -= 1;
        } else if (
          event.key === 'ArrowDown' ||
          event.key === 'ArrowUp' ||
          event.code === 'Enter' ||
          event.code === 'Space'
        ) {
          event.stopPropagation();
        }

        if (value < 0) {
          value = 0;
        }

        if (value > itemsCount - 1) {
          value = itemsCount - 1;
        }

        itemsRef.current[value]?.focus();

        return value;
      });
    },
    [itemsCount],
  );

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    wrapper.addEventListener('keydown', onKeyPress);
    return () => {
      wrapper.removeEventListener('keydown', onKeyPress);
    };
  }, [onKeyPress]);

  return (
    <div
      className={className}
      css={{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        gap: `${scale(1)}px ${scale(1, true)}px`,
      }}
      tabIndex={disabled || !itemsCount || activeIndex === 0 ? -1 : 0}
      ref={wrapperRef}
    >
      {selectedMultiple.map((option, index) => (
        <button
          key={option.key}
          type="button"
          {...getClearableProps(option, index)}
          css={{
            padding: `${scale(1, true)}px ${scale(1)}px`,
            overflow: 'hidden',
            height: scale(3),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: scale(1),
            background: colors.link,
            ':hover': {
              background: colors.linkHover,
            },
            color: colors.white,
            ...typography('paragraphSmall'),
          }}
          title="Удалить"
        >
          {option.content || option.key}{' '}
          <CloseIcon
            css={{
              fill: 'currentColor',
              width: scale(1),
              height: scale(1),
              marginLeft: scale(1, true),
            }}
          />
        </button>
      ))}
    </div>
  );
};

export const useClearableItems = ({
  Field = DefaultField,
}: useClearableItemsProps = {}) => {
  const fieldRef = useRef<HTMLDivElement | null>(null);

  const renderField = useCallback(
    (props: FieldProps) => {
      const fieldProps = {
        ...props,
        innerProps: {
          ...props.innerProps,
          ref: mergeRefs([props.innerProps.ref!, fieldRef]),
        },
        ...(props.multiple &&
          props.selectedMultiple?.length &&
          ({
            valueRenderer: () => (
              <ClearableItems
                selectedMultiple={props.selectedMultiple || []}
                setSelectedItems={props.setSelectedItems}
              />
            ),
          } as any)),
      };

      return <Field {...fieldProps} />;
    },
    [Field],
  );

  return {
    Field: renderField,
  };
};

export default useClearableItems;
