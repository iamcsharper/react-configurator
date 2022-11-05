import { ChangeEvent, FC, ReactNode, RefAttributes } from 'react';

import { BaseSelectProps, FieldProps } from '@controls/NewSelect';
import { InputProps } from '../Input';

export type AutocompleteProps = Omit<
  BaseSelectProps,
  'Field' | 'nativeSelect'
> & {
  /**
   * Компонент ввода значения
   */
  Input?: FC<InputProps & RefAttributes<HTMLInputElement>>;

  // meta?: FieldMetaProps<string>;

  /**
   * Пропсы, которые будут прокинуты в инпут
   */
  inputProps?: InputProps & Record<string, unknown>;

  /**
   * Значение поля ввода
   */
  value?: string;

  /**
   * Поле доступно только для чтения
   */
  readOnly?: InputProps['readOnly'];

  /**
   * Отображение иконки успеха
   */
  success?: boolean;

  /**
   * Обработчик ввода
   */
  onInput?: (event: ChangeEvent<HTMLInputElement>) => void;

  /**
   * Хранит функцию, с помощью которой можно обновить положение поповера
   */
  updatePopover?: BaseSelectProps['updatePopover'];

  isMobile?: boolean;
};

export type AutocompleteFieldProps = FieldProps &
  Pick<
    AutocompleteProps,
    'Input' | 'inputProps' | 'value' | 'onInput' | 'readOnly'
  > & {
    bottomAddons?: ReactNode;
  };
