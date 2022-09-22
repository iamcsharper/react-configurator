export {};

// import { CSSObject } from '@emotion/react';
// import { UseSelectState } from 'downshift';
// import { HTMLProps, ReactNode } from 'react';
// import { BasicState, StyleOrFunction } from '@scripts/theme';

// export enum SelectVariants {
//   primary = 'primary',
//   dark = 'dark',
// }

// export enum SelectSize {
//   md = 'md',
// }

// export interface SelectState {
//   isIconVertical?: boolean;
//   panelNoPadding?: boolean;
// }

// export type SelectStateFull = BasicState<
//   typeof SelectVariants,
//   typeof SelectSize
// > &
//   SelectState;

// type SelectThemePart = StyleOrFunction<SelectStateFull>;

// export interface SelectTheme {
  
// }

// // TODO:
// // https://gitlab.com/devrosa/rk_front/-/tree/master/src/scripts/themes/select

// export interface LegendWrapperProps {
//   /** Input name */
//   name?: string;
//   /** Label text */
//   label?: string;
//   /** Hint text */
//   hint?: string;
//   /** Required field */
//   required?: boolean;
//   /** Show message flag */
//   showMessage?: boolean;
//   /** Custom message text */
//   messageText?: string;
//   fieldWrapperCSS?: CSSObject;
//   children: ReactNode;
// }
// export interface SelectItemProps {
//   /** Select option value */
//   value: string | number | null;
//   /** Select option text */
//   label: ReactNode;
//   disabled?: boolean;
// }

// export type OnChangeProps = Partial<UseSelectState<SelectItemProps | null>> & {
//   name: string;
// };

// export type SelectBaseProps = Omit<
//   HTMLProps<HTMLDivElement>,
//   'size' | 'onChange'
// > &
//   Omit<LegendWrapperProps, 'children' | 'fieldWrapperCSS'>;

// export interface SelectProps extends SelectBaseProps {
//   /** Options list */
//   items: SelectItemProps[];
//   /** Index of option selected by default */
//   defaultIndex?: number;
//   /** Select option value */
//   value?: string;
//   /** Visually hidden legend */
//   hiddenLegend?: boolean;
//   /** Placeholder text */
//   placeholder?: string;
//   /** Select height */
//   // heightProp?: number;
//   /** legend visible flag */
//   isLegend?: boolean;
//   /** Change event handler */
//   onChange?: (changes: OnChangeProps) => void;
//   /** Selected item */
//   selectedItem?: SelectItemProps;
//   /** Simple select without search */
//   simple?: boolean;
//   /** Do we need filter options when typing */
//   search?: boolean;
//   /** Dropdown placement */
//   // placement?: 'bottom' | 'top';
//   /** label bottom position  */
//   isLabelBottom?: boolean;
//   /** label in one line */
//   isOneLine?: boolean;
//   /** additional css for field */
//   fieldCSS?: CSSObject;
//   /** Size for field, different from Option List  */
//   fieldSize?: ComponentThemeProps['size'];
//   /** Theme for field, different from Option List  */
//   fieldTheme?: ComponentThemeProps['theme'];
//   /** Variant for field, different from Option List  */
//   fieldVariant?: ComponentThemeProps['variant'];
// }

// export type SelectedItem = SelectItemProps | null | undefined;
