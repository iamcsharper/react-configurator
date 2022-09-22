import { CSSObject } from '@emotion/react';
import { UseComboboxStateChange, useCombobox } from 'downshift';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFieldCSS } from '@scripts/hooks/useFieldCSS';

import Legend from '@components/controls/Legend';

import ArrowIcon from '@icons/small/chevronUp.svg';

import {
  LegendWrapperProps,
  SelectItemProps,
  SelectProps,
  SelectedItem,
} from './types';

export const getLabel = (item: SelectedItem) => {
  if (typeof item?.label === 'string') return item.label;
  if (item?.value) return item.value.toString();
  return '';
};

const getValue = (item: SelectedItem) => {
  if (item?.value) return item.value;
  return null;
};

const LegendWrapper = ({
  label,
  fieldWrapperCSS,
  children,
  ...props
}: LegendWrapperProps) =>
  label ? (
    <Legend label={label} fieldWrapperCSS={fieldWrapperCSS} {...props}>
      {children}
    </Legend>
  ) : (
    <div css={fieldWrapperCSS}>{children}</div>
  );

const Select: FC<SelectProps> = ({
  name,
  label,
  hint,
  required = true,
  items,
  defaultIndex,
  selectedItem: selectedItemFromProps,
  placeholder = '',
  // heightProp,
  disabled = false,
  simple = true,
  onChange,
  showMessage,
  // placement = 'bottom',
  messageText,
  size = 'lg',
  theme = 'basic',
  variant = 'primary',
  isLabelBottom = false,
  isOneLine = false,
  fieldCSS: additFieldCSS,
  fieldTheme = theme,
  fieldSize = size,
  fieldVariant = variant,
  ...props
}) => {
  const {
    basicFieldCSS,
    fieldWrapperCSS,
    fieldLabelCSS,
    fieldHintCSS,
    fieldErrorCSS,
  } = useFieldCSS({
    size: fieldSize,
    theme: fieldTheme,
    variant: fieldVariant,
    meta,
    isLabel: !!label,
    isLabelBottom,
    placeholder,
    focus: false,
  });

  const fieldCSS: CSSObject = {
    ...basicFieldCSS,
    paddingRight: `${scale(4)}px !important`,
    ...additFieldCSS,
  };

  const [inputItems, setInputItems] = useState(items);
  const itemsRef = useRef(items);
  // to update internal state whet items prop changed
  useEffect(() => {
    if (itemsRef.current !== items) {
      setInputItems(items);
    }
  }, [items]);

  const onInputValueChange = useCallback(
    ({ inputValue }) => {
      setInputItems(
        items.filter((i) =>
          getLabel(i).toLowerCase().includes(inputValue?.toLowerCase()),
        ),
      );
    },
    [items],
  );

  const onSelectedItemChange = useCallback(
    (changes: UseComboboxStateChange<SelectItemProps>) => {
      if (helpers) helpers.setValue(getValue(changes.selectedItem));
      if (onChange) onChange({ name: name || '', ...changes });
    },
    [helpers, name, onChange],
  );

  const {
    isOpen,
    openMenu,
    selectedItem,
    selectItem,
    highlightedIndex,
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    getToggleButtonProps,
    getComboboxProps,
  } = useCombobox({
    items: inputItems,
    // фильтрация items по значению
    onInputValueChange: simple ? undefined : onInputValueChange,
    // приводит item к строковому значению
    itemToString: getLabel,
    initialHighlightedIndex:
      defaultIndex !== undefined ? defaultIndex : undefined,
    initialSelectedItem:
      defaultIndex !== undefined ? items[defaultIndex] : null,
    // Если селект контроллируется извне
    selectedItem: selectedItemFromProps,
    // Если используется в форме, то изменим selectedItem
    ...(field !== undefined && {
      selectedItem: items.find((item) => item.value === field?.value) || null,
    }),
    onSelectedItemChange,
  });

  const legendProps = useMemo(
    () => ({
      as: 'div',
      name,
      label,
      required,
      hint,
      meta,
      showMessage,
      messageText,
      isLabelBottom,
      labelCSS: fieldLabelCSS,
      fieldWrapperCSS,
      hintCSS: fieldHintCSS,
      errorCSS: fieldErrorCSS,
    }),
    [
      hint,
      label,
      messageText,
      meta,
      name,
      required,
      showMessage,
      isLabelBottom,
      fieldLabelCSS,
      fieldWrapperCSS,
      fieldHintCSS,
      fieldErrorCSS,
    ],
  );

  const hoverOptionCSS: CSSObject = {
    ...getOptionStyles(ComponentState.HOVER),
  };

  const [isMobilePopupOpen, setMobilePopupOpen] = useState(false);

  return (
    <div {...props} css={{ position: 'relative' }}>
      <div {...getComboboxProps()}>
        <LegendWrapper {...legendProps} {...getLabelProps()}>
          <>
            {simple ? (
              <>
                <input {...getInputProps({ css: { display: 'none' } })} />
                <button
                  type="button"
                  {...getToggleButtonProps({
                    css: {
                      ...fieldCSS,
                      display: 'flex',
                      alignItems: 'center',

                      ...(isOneLine && {
                        display: 'block',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textAlign: 'left',
                      }),
                      // paddingRight: 10,
                      // ...(getLabel(selectedItem).length === 0 && { color: IT?.placeholderColor }),
                      // ...(isOpen && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }),
                    },
                    disabled,
                  })}
                  {...(isMobile && {
                    onClick: (e) => {
                      e.preventDefault();
                      setMobilePopupOpen(true);
                    },
                  })}
                >
                  {selectedItem?.label || placeholder}
                </button>
              </>
            ) : (
              <input
                {...getInputProps({
                  css: {
                    ...fieldCSS,
                    // ...(isOpen && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }),
                  },
                  disabled,
                  placeholder,
                  autoComplete: 'off',
                  onFocus: () => {
                    if (!isOpen) openMenu();
                  },
                })}
              />
            )}
            <button
              type="button"
              disabled={disabled}
              {...getToggleButtonProps({
                disabled,
                css: {
                  ...getSelectStyles('arrowButton'),
                  pointerEvents: simple ? 'none' : 'all',
                },
              })}
            >
              <ArrowIcon
                css={{
                  transition: 'transform ease 300ms',
                  ...(!isOpen && { transform: 'rotate(180deg)' }),
                }}
              />
            </button>

            <ul
              {...getMenuProps({
                css: {
                  ...getSelectStyles('optionList'),
                  // ...(placement === 'top' && { bottom: optionHeight }),
                  // ...(isOpen && { border: ST?.menuBorder }),
                },
              })}
            >
              {isOpen &&
                inputItems.map((option, index) => (
                  <li
                    key={option.value}
                    {...getItemProps({
                      item: option,
                      index,
                      css: {
                        ...getOptionStyles(),
                        '&:hover:focus:not(:disabled)': hoverOptionCSS,
                        ...(index === highlightedIndex && hoverOptionCSS),
                        ...(option.disabled && {
                          ...getOptionStyles(ComponentState.DISABLED),
                        }),
                        ...(option.value === selectedItem?.value && {
                          ...getOptionStyles(ComponentState.SELECTED),
                        }),
                      },
                      disabled: option.disabled,
                    })}
                  >
                    {option.label}
                  </li>
                ))}
            </ul>
          </>
        </LegendWrapper>
      </div>
    </div>
  );
};

export default Select;
