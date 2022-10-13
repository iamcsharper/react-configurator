import { CSSObject } from '@emotion/react';
import { HTMLProps, ReactNode } from 'react';
import { BasicState, StyleOrFunction } from '@scripts/theme';

export enum SelectVariants {
  primary = 'primary',
  dark = 'dark',
}

export enum SelectSize {
  md = 'md',
}

export interface SelectState {
  isOpen: boolean;
  isOneLine?: boolean;
  isSearch?: boolean;
  hasSelected?: boolean;
}

export type SelectStateFull = BasicState<
  typeof SelectVariants,
  typeof SelectSize
> &
  SelectState;

export interface SelectTheme {
  legend: StyleOrFunction<SelectStateFull>;
  field: StyleOrFunction<SelectStateFull & { isFocused: boolean }>;
  optionList: StyleOrFunction<SelectStateFull>;
  arrowButton: StyleOrFunction<SelectStateFull>;
  closeButton: StyleOrFunction<SelectStateFull>;
  option: StyleOrFunction<
    SelectStateFull & {
      isSelected: boolean;
      isHover: boolean;
      isDisabled: boolean;
    }
  >;
}

// TODO:
// https://gitlab.com/devrosa/rk_front/-/tree/master/src/scripts/themes/select

export interface LegendWrapperProps {
  /** Input name */
  name?: string;
  /** Label text */
  label?: string;
  /** Hint text */
  hint?: string;
  /** Required field */
  required?: boolean;
  /** Show message flag */
  showMessage?: boolean;
  /** Custom message text */
  messageText?: string;
  fieldWrapperCSS?: CSSObject;
  children: ReactNode;
}

export interface SelectItemProps<T extends string | number | null> {
  /** Select option value */
  value: T;
  /** Select option text */
  label: ReactNode;
  disabled?: boolean;
}

export type SelectBaseProps = Omit<
  HTMLProps<HTMLDivElement>,
  'size' | 'onChange'
> &
  Omit<LegendWrapperProps, 'children' | 'fieldWrapperCSS'>;

export interface SelectProps<
  T extends string | number | null,
  TName extends string | never,
> extends Partial<
      BasicState<typeof SelectVariants, typeof SelectSize, SelectTheme>
    >,
    Partial<SelectState>,
    Omit<SelectBaseProps, 'name'> {
  name?: TName;
  /** Options list */
  items: SelectItemProps<T>[];
  /** Index of option selected by default */
  defaultIndex?: number;
  /** Select option value */
  value?: string;
  /** Visually hidden legend */
  hiddenLegend?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** legend visible flag */
  isLegend?: boolean;
  /** Change event handler */
  onChange?: (value: T | null) => void;
  /** Selected item */
  selectedItem?: SelectItemProps<T>;
  /** Do we need filter options when typing */
  isSearch?: boolean;
  /** additional css for field */
  fieldCSS?: CSSObject;
  emptyValue?: T;
  // Автоматически выбирать опцию при наличии первого полного совпадения
  applyOnExactLabel?: boolean;
  // Автоматически скроллит родителя к менюшке
  isScrollIntoView?: boolean;
  scrollParent?: HTMLElement;
  openMenuOnInputClick?: boolean;
  isClearable?: boolean;
}

export type SelectedItem =
  | SelectItemProps<string | number | null>
  | null
  | undefined;
