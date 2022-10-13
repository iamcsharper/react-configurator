import { CSSObject } from '@emotion/react';
import { UseComboboxStateChange, useCombobox } from 'downshift';
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFieldCSS } from '@scripts/hooks/useFieldCSS';

import Legend from '@components/controls/Legend';

import { ReactComponent as ArrowIcon } from '@icons/small/chevronUp.svg';
import { ReactComponent as CloseIcon } from '@icons/small/close.svg';

import { useThemeCSS, useThemeCSSPart } from '@scripts/theme';
import { getScrollParent, mergeRefs } from '@scripts/helpers';
import {
  LegendWrapperProps,
  SelectItemProps,
  SelectProps,
  SelectedItem,
  SelectSize,
  SelectVariants,
  SelectStateFull,
} from './types';
import { themes } from './themes';

export const getLabel = (item: SelectedItem) => {
  if (typeof item?.label === 'string') return item.label;
  if (item?.value) return item.value.toString();
  return '';
};

// const getValue = (item: SelectedItem) => {
//   if (item?.value) return item.value;
//   return null;
// };

const LegendWrapper = memo(
  ({ label, fieldWrapperCSS, children, ...props }: LegendWrapperProps) =>
    label ? (
      <Legend
        label={label}
        fieldWrapperCSS={fieldWrapperCSS}
        {...props}
        name={(props as any).htmlFor}
      >
        {children}
      </Legend>
    ) : (
      <div css={fieldWrapperCSS}>{children}</div>
    ),
);

// TODO make generic for name
const Select = <T extends string | number | null, TName extends string | never>(
  {
    name,
    label,
    hint,
    required = true,
    items,
    defaultIndex,
    selectedItem: selectedItemFromProps,
    placeholder = '',
    disabled = false,
    isSearch = false,
    onChange,
    showMessage,
    messageText,
    theme = themes.basic,
    size = SelectSize.md,
    variant = SelectVariants.primary,
    fieldCSS: additFieldCSS,
    isOneLine,
    value: valueFromProps,
    defaultValue,
    emptyValue,
    applyOnExactLabel,
    scrollParent: scrollParentFromProps,
    isScrollIntoView = true,
    isClearable = true,
    ...props
  }: SelectProps<T, TName>,
  ref?: any,
) => {
  const [innerValue, setInnerValue] = useState(defaultValue);
  // console.log('select option value:', value);

  // if (!selectedItemFromProps && !selectedItemFromProps) {
  //   console.error('[Select] Must provide a value or selectedItem');
  // }

  const value = valueFromProps || selectedItemFromProps?.value || innerValue;

  const [inputItems, setInputItems] = useState(items);
  const itemsRef = useRef(items);
  // to update internal state whet items prop changed
  useEffect(() => {
    if (itemsRef.current !== items) {
      setInputItems(items);
    }
  }, [items]);

  const [inputValue, setInputValue] = useState('');
  const isNotFound = !inputItems.length && !!items.length;

  const onInputValueChange = useCallback(
    ({ inputValue }: { inputValue?: string }) => {
      setInputValue(inputValue || '');

      const newItems = items.filter((i) =>
        getLabel(i)
          .toLowerCase()
          .includes(inputValue?.toLowerCase() || ''),
      );
      // TODO: filter;
      setInputItems(newItems);

      if (newItems.length === 1 && items.length > 1 && applyOnExactLabel) {
        onChange?.(newItems[0].value);
      }
    },
    [applyOnExactLabel, items, onChange],
  );

  const onSelectedItemChange = useCallback(
    (
      changes: UseComboboxStateChange<SelectItemProps<string | number | null>>,
    ) => {
      // if (field) field.onChange(getValue(changes.selectedItem));)
      if (onChange) onChange(changes.selectedItem?.value as T | null);
      setInnerValue(`${changes.selectedItem?.value}`);
      setInputValue(
        (old) =>
          (old === changes.selectedItem?.label
            ? old
            : `${changes.selectedItem?.label}`) || '',
      );
    },
    [onChange],
  );

  // Если селект контроллируется извне
  let controlledSelectedItem = selectedItemFromProps || null;
  if (value !== undefined) {
    controlledSelectedItem = items.find((item) => item.value === value) || null;
  }

  const {
    isOpen,
    openMenu,
    getToggleButtonProps,
    reset,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    selectedItem,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    // фильтрация items по значению
    inputValue,
    onInputValueChange: isSearch ? onInputValueChange : undefined,
    // приводит item к строковому значению
    itemToString: getLabel,
    initialHighlightedIndex:
      defaultIndex !== undefined ? defaultIndex : undefined,
    initialSelectedItem:
      defaultIndex !== undefined ? items[defaultIndex] : null,
    selectedItem: controlledSelectedItem,
    onSelectedItemChange,
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isFocused, setFocused] = useState(false);

  const scrollParent = useRef<HTMLElement | null>(null);

  useEffect(() => {
    scrollParent.current =
      scrollParentFromProps || getScrollParent(inputRef.current);
  }, [scrollParentFromProps]);

  useEffect(() => {
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);
    const input = inputRef.current;

    input?.addEventListener('focus', onFocus);
    input?.addEventListener('blur', onBlur);
    return () => {
      input?.removeEventListener('focus', onFocus);
      input?.removeEventListener('blur', onBlur);
    };
  }, []);

  const {
    basicFieldCSS,
    fieldWrapperCSS,
    fieldLabelCSS,
    fieldHintCSS,
    fieldErrorCSS,
  } = useFieldCSS({
    isLabel: !!label,
    isError: isNotFound,
    focus: isFocused,
  });

  const hasSelected = !!selectedItem;
  const isOpenMeaningful = isOpen && !isNotFound;

  const menuListRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (
      isOpenMeaningful &&
      menuListRef.current &&
      scrollParent.current &&
      isScrollIntoView
    ) {
      const yOffset = 200;
      const scrollY = scrollParent.current.scrollTop;

      const y = menuListRef.current.getBoundingClientRect().top;
      const newY = y + scrollY - yOffset;

      const dy = Math.abs(scrollY - newY);

      if (dy > yOffset * 0.8) {
        // TODO: threshold. do not scroll when its already visible
        scrollParent.current.scrollTo({ top: newY, behavior: 'smooth' });
      }
    }
  }, [isOpenMeaningful, isScrollIntoView]);

  const state = useMemo<SelectStateFull>(
    () => ({
      size,
      variant,
      isOpen: isOpenMeaningful,
      isOneLine,
      isSearch,
      hasSelected,
    }),
    [size, variant, isOpenMeaningful, isOneLine, isSearch, hasSelected],
  );

  const { arrowButton, closeButton, optionList } = useThemeCSS(theme, state);
  const getCSS = useThemeCSSPart(theme, state);

  const fieldCSSMain = useMemo(
    () =>
      getCSS('field', {
        isFocused,
      }),
    [getCSS, isFocused],
  );

  const fieldCSS: CSSObject = useMemo(
    () => ({
      ...basicFieldCSS,
      ...fieldCSSMain,
      ...additFieldCSS,
    }),
    [additFieldCSS, basicFieldCSS, fieldCSSMain],
  );

  const legendProps = useMemo(
    () => ({
      as: 'div',
      name,
      label,
      required,
      hint,
      showMessage,
      messageText,
      labelCSS: fieldLabelCSS,
      fieldWrapperCSS,
      hintCSS: fieldHintCSS,
      errorCSS: fieldErrorCSS,
    }),
    [
      hint,
      label,
      messageText,
      name,
      required,
      showMessage,
      fieldLabelCSS,
      fieldWrapperCSS,
      fieldHintCSS,
      fieldErrorCSS,
    ],
  );

  return (
    <div {...props} css={{ position: 'relative' }}>
      <LegendWrapper {...legendProps} {...getLabelProps()}>
        <div {...getComboboxProps()}>
          {!isSearch ? (
            <>
              <input
                {...getInputProps({
                  ref: mergeRefs([inputRef, ref]),
                  css: {
                    clip: 'rect(0, 0, 0, 0)',
                    position: 'absolute',
                    margin: '-1px!important',
                    width: '0px!important',
                    height: '0px!important',
                    padding: '0px!important',
                    overflow: 'hidden!important',
                    whiteSpace: 'nowrap',
                    border: '0px!important',
                  },
                })}
              />
              <button
                type="button"
                {...getToggleButtonProps({
                  css: fieldCSS,
                  disabled,
                })}
                aria-label="toggle menu"
              >
                {selectedItem?.label || placeholder}
              </button>
            </>
          ) : (
            <input
              {...getInputProps({
                css: fieldCSS,
                disabled,
                placeholder,
                autoComplete: 'off',
                onFocus: () => {
                  openMenu();

                  if (emptyValue && selectedItem?.value === emptyValue) {
                    setInputValue('');
                  }
                },
                ref: mergeRefs([inputRef, ref]),
              })}
            />
          )}
          {emptyValue !== selectedItem?.value && isClearable && (
            <button css={closeButton} type="button" onClick={reset}>
              <CloseIcon />
            </button>
          )}
          <button
            type="button"
            {...getToggleButtonProps({
              disabled,
              css: arrowButton,
            })}
          >
            <ArrowIcon />
          </button>

          <ul {...getMenuProps({ css: optionList, ref: menuListRef })}>
            {isOpen &&
              inputItems.map((option, index) => (
                <li
                  key={option.value}
                  {...getItemProps({
                    item: option,
                    index,
                    css: getCSS('option', {
                      isHover: index === highlightedIndex,
                      isSelected: option.value === selectedItem?.value,
                      isDisabled: option.disabled,
                    }),
                    disabled: option.disabled,
                  })}
                >
                  {option.label}
                </li>
              ))}
          </ul>
        </div>
      </LegendWrapper>
    </div>
  );
};

export default forwardRef(Select);
