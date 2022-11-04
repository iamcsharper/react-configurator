import { CSSObject } from '@emotion/core';
import { FieldMetaProps } from 'formik';
import { ChangeEvent, FC, HTMLProps, ReactNode, RefAttributes } from 'react';

import { BaseSelectProps, FieldProps } from '@controls/NewSelect';

export type InputProps = HTMLProps<HTMLInputElement>;

export type AutocompleteProps = Omit<BaseSelectProps, 'Field' | 'nativeSelect'> & {
    /**
     * Компонент ввода значения
     */
    Input?: FC<InputProps & RefAttributes<HTMLInputElement>>;

    meta?: FieldMetaProps<string>;

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
    Pick<AutocompleteProps, 'Input' | 'inputProps' | 'value' | 'onInput' | 'readOnly'> & {
        bottomAddons?: ReactNode;
    };

export interface LegendWrapperProps {
    /** Input name */
    name?: string;
    /** Formik meta object (inner) */
    meta?: FieldMetaProps<string>;
    /** Label text */
    label?: string | ReactNode;
    /** Hint text */
    hint?: string | ReactNode;
    /** Required field */
    required?: boolean;
    /** Show message flag */
    showMessage?: boolean;
    /** Custom message text */
    messageText?: string;
    fieldWrapperCSS?: CSSObject;
    children: ReactNode;
}
