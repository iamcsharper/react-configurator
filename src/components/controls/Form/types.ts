import { SVGRIcon } from '@customTypes/index';
import { CSSObject } from '@emotion/react';
import { ReactNode } from 'react';

export interface BasicFieldProps<T extends Record<string, any> = never> {
  name: T extends never ? string : keyof T;
  label?: string | ReactNode;
  showMessage?: boolean;
  messageText?: string;
  // messageType?:
  labelCSS?: CSSObject;
  Icon?: SVGRIcon;
  iconCSS?: CSSObject;
  className?: string;
  placeholder?: string;
  isLegend?: boolean;
  hint?: string;
  disabled?: boolean;
}

export interface FormFieldProps<T extends Record<string, any> = never>
  extends BasicFieldProps<T> {
  children?: ReactNode | ReactNode[];
}

export interface BasicInputProps extends BasicFieldProps {
  basicFieldCSS: CSSObject;
}
