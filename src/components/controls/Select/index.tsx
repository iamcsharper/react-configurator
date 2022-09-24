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

import { useThemeCSS, useThemeCSSPart } from '@scripts/theme';
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
const Select = <T extends string | number, TName extends string | never>(
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
    value,
    ...props
  }: SelectProps<T, TName>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ref?: any,
) => {
  // console.log('select option value:', value);

  const [inputItems, setInputItems] = useState(items);
  const itemsRef = useRef(items);
  // to update internal state whet items prop changed
  useEffect(() => {
    if (itemsRef.current !== items) {
      setInputItems(items);
    }
  }, [items]);

  const onInputValueChange = useCallback(
    ({ inputValue }: { inputValue?: string }) => {
      // TODO: filter;
      setInputItems(
        items.filter((i) =>
          getLabel(i)
            .toLowerCase()
            .includes(inputValue?.toLowerCase() || ''),
        ),
      );
    },
    [items],
  );

  const onSelectedItemChange = useCallback(
    (changes: UseComboboxStateChange<SelectItemProps>) => {
      // if (field) field.onChange(getValue(changes.selectedItem));)
      if (onChange) onChange(changes.selectedItem?.value as T | null);
    },
    [onChange],
  );

  const {
    isOpen,
    getToggleButtonProps,
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
    onInputValueChange: isSearch ? onInputValueChange : undefined,
    // приводит item к строковому значению
    itemToString: getLabel,
    initialHighlightedIndex:
      defaultIndex !== undefined ? defaultIndex : undefined,
    initialSelectedItem:
      defaultIndex !== undefined ? items[defaultIndex] : null,
    // Если селект контроллируется извне
    selectedItem: selectedItemFromProps,
    ...(value !== undefined && {
      selectedItem: items.find((item) => item.value === value) || null,
    }),
    onSelectedItemChange,
  });

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setFocused] = useState(false);

  useEffect(() => {
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);
    const input = hiddenInputRef.current;

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
    isError: false, // TODO
    focus: isFocused,
  });

  const state = useMemo<SelectStateFull>(
    () => ({
      size,
      variant,
      isOpen,
      isOneLine,
      isSearch,
    }),
    [size, variant, isOpen, isOneLine, isSearch],
  );

  const { arrowButton, optionList } = useThemeCSS(theme, state);
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
                  ref: hiddenInputRef,
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
              })}
            />
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

          <ul {...getMenuProps({ css: optionList })}>
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

  // return (
  //   <div {...props} css={{ position: 'relative' }}>
  //     <div {...getComboboxProps()}>
  //       <LegendWrapper {...legendProps} {...getLabelProps()}>
  //         <>
  //           {!isSearch ? (
  //             <>
  //               <input {...getInputProps({ css: { display: 'none' } })} />
  //               <button
  //                 type="button"
  //                 {...getToggleButtonProps({
  //                   css: fieldCSS,
  //                   disabled,
  //                 })}
  //                 aria-label="toggle menu"
  //               >
  //                 {selectedItem?.label || placeholder}
  //               </button>
  //             </>
  //           ) : (
  //             <input
  //               {...getInputProps({
  //                 css: fieldCSS,
  //                 disabled,
  //                 placeholder,
  //                 autoComplete: 'off',
  //               })}
  //             />
  //           )}
  //           <button
  //             type="button"
  //             {...getToggleButtonProps({
  //               disabled,
  //               css: arrowButton,
  //             })}
  //           >
  //             <ArrowIcon />
  //           </button>

  //           <ul {...getMenuProps({ css: optionList })}>
  //             {isOpen &&
  //               inputItems.map((option, index) => (
  //                 <li
  //                   key={option.value}
  //                   {...getItemProps({
  //                     item: option,
  //                     index,
  //                     css: getCSS('option', {
  //                       isHover: index === highlightedIndex,
  //                       isSelected: option.value === selectedItem?.value,
  //                       isDisabled: option.disabled,
  //                     }),
  //                     disabled: option.disabled,
  //                   })}
  //                 >
  //                   {option.label}
  //                 </li>
  //               ))}
  //           </ul>
  //         </>
  //       </LegendWrapper>
  //     </div>
  //   </div>
  // );
};

export default forwardRef(Select);
