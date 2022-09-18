import { SVGRIcon } from '@customTypes/index';
import { CSSObject } from '@emotion/react';
import { ReactNode } from 'react';

export interface BasicFieldProps {
  name: string;
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

export interface FormFieldProps extends BasicFieldProps {
  children?: ReactNode | ReactNode[];
}

export interface BasicInputProps extends BasicFieldProps {
  basicFieldCSS: CSSObject;
}
